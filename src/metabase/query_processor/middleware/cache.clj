(ns metabase.query-processor.middleware.cache
  "Middleware that returns cached results for queries when applicable.

  If caching is enabled (`enable-query-caching` is `true`) cached results will be returned for Cards if possible.
  There's a global default TTL defined by the setting `query-caching-default-ttl`, but individual Cards can override
  this value with custom TTLs with a value for `:cache_ttl`.

  For all other queries, caching is skipped.

  The default backend is `db`, which uses the application database; this value can be changed by setting the env var
  `MB_QP_CACHE_BACKEND`. Refer to [[metabase.query-processor.middleware.cache-backend.interface]] for more details
  about how the cache backends themselves."
  (:require [clojure.tools.logging :as log]
            [java-time :as t]
            [medley.core :as m]
            [metabase.query-processor.middleware.annotate :as annotate]
            [metabase.query-processor.middleware.cache.constant :as cacheContant]
            [metabase.query-processor.middleware.add-timezone-info :as add-timezone-info]
            [metabase.query-processor.context.default :as context.default]
            [metabase.config :as config]
            [metabase.public-settings :as public-settings]
            [metabase.query-processor.context :as qp.context]
            [metabase.query-processor.middleware.cache-backend.db :as backend.db]
            [metabase.query-processor.middleware.cache-backend.interface :as i]
            [metabase.query-processor.middleware.cache.impl :as impl]
            [metabase.query-processor.util :as qp.util]
            [metabase.util :as u]
            [clj-http.client :as client]
            [cheshire.core :as json]
            [metabase.models.query-cache :refer [QueryCache]]
            [metabase.util.i18n :refer [trs]])
  (:import org.eclipse.jetty.io.EofException
           java.util.Base64))

(comment backend.db/keep-me)

(def last-ran-cache (atom nil))

(def query-data-middleware
  "The middleware applied to queries ran via `process-query` with cache ."
  [#'annotate/add-column-info-for-cache
   #'add-timezone-info/add-timezone-info-for-cache])

(def ^:private cache-version
  "Current serialization format version. Basically

    [initial-metadata row-1 row-2 ... row-n final-metadata]"
  3)

(def ^:dynamic *backend*
  "Current cache backend. Dynamically rebindable primary for test purposes."
  (i/cache-backend (config/config-kw :mb-qp-cache-backend)))


;;; ------------------------------------------------------ Save ------------------------------------------------------

(defn- purge! [backend]
  (try
    (log/tracef "Purging cache entries older than %s" (u/format-seconds (public-settings/query-caching-max-ttl)))
    (i/purge-old-entries! backend (public-settings/query-caching-max-ttl))
    (log/trace "Successfully purged old cache entries.")
    :done
    (catch Throwable e
      (log/error e (trs "Error purging old cache entries: {0}" (ex-message e))))))

(defn- min-duration-ms
  "Minimum duration it must take a query to complete in order for it to be eligible for caching."
  []
  (* (public-settings/query-caching-min-ttl) 1000))

(defn- site-url
  "site-url"
  []
  (public-settings/site-url))

(def ^:private ^:dynamic *in-fn*
  "The `in-fn` provided by [[impl/do-with-serialization]]."
  nil)

(defn- add-object-to-cache!
  "Add `object` (e.g. a result row or metadata) to the current cache entry."
  [object]
  (when *in-fn*
    (*in-fn* object)))

(def ^:private ^:dynamic *result-fn*
  "The `result-fn` provided by [[impl/do-with-serialization]]."
  nil)

(defn- serialized-bytes []
  (when *result-fn*
    (*result-fn*)))

(defn- cache-results!
  "Save the final results of a query."
  [query-hash dashboard-id card-id]
;  (log/info (trs "Caching results for next time for query with hash {0}."
;                 (pr-str (i/short-hex-hash query-hash))) (u/emoji "💾"))
  (log/info "cache-results!" card-id dashboard-id (i/short-hex-hash query-hash))
  (i/update-cache-status! *backend* query-hash "success")
  (try
    (let [bytez (serialized-bytes)]
      (if-not (instance? (Class/forName "[B") bytez)
        (log/error (trs "Cannot cache results: expected byte array, got {0}" (class bytez)))
        (do
          (log/trace "Got serialized bytes; saving to cache backend")
          (i/save-results-v2! *backend* query-hash bytez dashboard-id card-id)
          (log/debug "Successfully cached results for query.")
          (purge! *backend*)))
      )
    :done
    (catch Throwable e
      (if (= (:type (ex-data e)) ::impl/max-bytes)
        (log/debug e (trs "Not caching results: results are larger than {0} KB" (public-settings/query-caching-max-kb)))
        (log/error e (trs "Error saving query results to cache: {0}" (ex-message e)))))))

(defn- save-results-xform [start-time metadata query-hash rf dashboard-id card-id mustRfReponse]
  (let [has-rows? (volatile! false)]
    (add-object-to-cache! (assoc metadata
                                 :cache-version cache-version
                                 :last-ran      (t/zoned-date-time)))
    (fn
      ([] (rf))

      ([result]
       (add-object-to-cache! (if (map? result)
                               (m/dissoc-in result [:data :rows])
                               {}))
       (let [duration-ms (- (System/currentTimeMillis) start-time)]
;         (log/info (trs "Query took {0} to run; minimum for cache eligibility is {1}"
;                        (u/format-milliseconds duration-ms) (u/format-milliseconds (min-duration-ms))))
         (when @has-rows?
           (cache-results! query-hash dashboard-id card-id)))
         (when mustRfReponse (rf result))
       )

      ([acc row]
       (add-object-to-cache! row)
       (vreset! has-rows? true)
       (rf acc row)))))


;;; ----------------------------------------------------- Fetch ------------------------------------------------------

(defn- cached-results-rff
  "Reducing function for cached results. Merges the final object in the cached results, the `final-metdata` map, with
  the reduced value assuming it is a normal metadata map."
  [rff]
  (fn [{:keys [last-ran], :as metadata}]
    (let [metadata       (dissoc metadata :last-ran :cache-version)
          rf             (rff metadata)
          final-metadata (volatile! nil)]
      (reset! last-ran-cache (.toEpochMilli (.toInstant last-ran)))
      (fn
        ([]
         (rf))

        ([result]
         (let [normal-format? (and (map? (unreduced result))
                                   (seq (get-in (unreduced result) [:data :cols])))
               result*        (-> (if normal-format?
                                    (merge-with merge @final-metadata (unreduced result))
                                    (unreduced result))
                                  (assoc :cached true, :updated_at last-ran))]
           (rf (cond-> result*
                 (reduced? result) reduced))))

        ([acc row]
         (if (map? row)
           (vreset! final-metadata row)
           (rf acc row)))))))

(defn- maybe-reduce-cached-results
  "Reduces cached results if there is a hit. Otherwise, returns `::miss` directly."
  [ignore-cache? query-hash max-age-seconds rff context]
  (try
    (or (when-not ignore-cache?
          (log/tracef "Looking for cached results for query with hash %s younger than %s\n"
                      (pr-str (i/short-hex-hash query-hash)) (u/format-seconds max-age-seconds))
          (i/with-cached-results *backend* query-hash max-age-seconds [is]
            (when is
              (impl/with-reducible-deserialized-results [[metadata reducible-rows] is]
                (log/tracef "Found cached results. Version: %s" (pr-str (:cache-version metadata)))
                (when (and (= (:cache-version metadata) cache-version)
                           reducible-rows)
                  (log/tracef "Reducing cached rows...")
                  (qp.context/reducef (cached-results-rff rff) context metadata reducible-rows)
                  (log/tracef "All cached rows reduced")
                  ::ok)))))
        ::miss)
    (catch EofException _
      (log/debug (trs "Request is closed; no one to return cached results to"))
      ::canceled)
    (catch Throwable e
      (log/error e (trs "Error attempting to fetch cached results for query with hash {0}: {1}"
                        (i/short-hex-hash query-hash) (ex-message e)))
      ::miss)))

(def dateFormat (java.text.SimpleDateFormat. "yyyy-MM-dd HH:mm:ss.SSS 'UTC'"))

(defn- tableUpdatedTime
  [card-id]
  (try (let [result (client/post (str (site-url) "/api/v1/dataDictionary/tableLastUpdate")
                                 {:accept  :json
                                  :form-params {:id card-id, :model "card"}})]
;         (log/info "------------" "tableUpdatedTime" card-id result)
         (let [resultMap (json/parse-string (result :body) true)]
           (if (resultMap :data) (.toEpochMilli (.toInstant (.parse dateFormat ((resultMap :data) :tableUpdated)))) 0)))
    (catch Exception e
      (log/debug e)
      0
      )
    )
  )

(defn- canRunCache [duration-ms start-time-ms card-id query-hash]
  (let [chartUpdated (tableUpdatedTime card-id)
        isNotPending (not= (backend.db/getQueryCacheStatus query-hash) "pending")
        cacheStatusUpdateAt (backend.db/getQueryCacheStatusUpdatedAt query-hash)
        ;; cache pending timeout is exceed 20 minutes
        cachePendingTimeout (or (= cacheStatusUpdateAt nil)(> (- start-time-ms (.toEpochMilli (.toInstant cacheStatusUpdateAt))) cacheContant/CACHE-PENDING-TIMEOUT))]

    (and (or isNotPending cachePendingTimeout)
         (or (> chartUpdated @last-ran-cache) (> duration-ms (min-duration-ms)))))
  )
(defn add-db-by-refresh-cache-async [query dashboard-id card-id]
  (let [
         query-hash (qp.util/query-hash query)
         fix-query (if (= :query(:type query)) (dissoc query :native) query)
         fix-query (assoc fix-query :info (dissoc (:info fix-query) :query-hash))
         canUpdateInfoDb (not= (backend.db/getQueryCacheStatus query-hash) "ready")
         ]
    (if canUpdateInfoDb (i/save-cache-request! *backend* query-hash fix-query dashboard-id card-id)))
  )

(defn refresh-cache-function [{:keys [middleware], :as query} dashboard-id card-id]
  (log/info "refresh-cache-function-middleware" card-id dashboard-id middleware)
  (let [
         start-time-ms (System/currentTimeMillis)
         query-hash (:query-hash middleware)
         query-hash (if query-hash query-hash (qp.util/query-hash query))
         erorCallback (fn [] (log/info "error callback" card-id dashboard-id (i/short-hex-hash query-hash)) (i/update-cache-status! *backend* query-hash "error"))
         reducef' (fn [rff context metadata rows]
                    (impl/do-with-serialization
                     (fn [in-fn result-fn]
                       (binding [*in-fn*     in-fn
                                 *result-fn* result-fn]
                         (((context.default/default-context) :reducef) rff context (merge {:aysnc-refresh-cache2? true, :erorCallback erorCallback} metadata) rows)))))
         ]
    (log/info "refresh-cache-function" card-id dashboard-id (i/short-hex-hash query-hash))
    (i/update-cache-status! *backend* query-hash "pending")
    (((apply comp query-data-middleware) ((context.default/default-context) :runf))
      (merge {:aysnc-refresh-cache2? true, :erorCallback erorCallback} query)
      (fn [metadata]
        (save-results-xform
         start-time-ms metadata query-hash
         (((context.default/default-context) :rff) metadata)
         dashboard-id card-id, false))
      (assoc (context.default/default-context) :reducef reducef'))
    true
    ))

;;; --------------------------------------------------- Middleware ---------------------------------------------------

(defn- run-query-with-cache
  [qp {:keys [cache-ttl middleware info], :as query} rff {:keys [reducef], :as context}]
  ;; TODO - Query will already have `info.hash` if it's a userland query. I'm not 100% sure it will be the same hash,
  ;; because this is calculated after normalization, instead of before
;  (log/info "run-query-with-cache info:" info)
  (let [card-id (info :card-id)
        dashboard-id (info :dashboard-id)
        query-hash (qp.util/query-hash query)
        result     (maybe-reduce-cached-results (:ignore-cached-results? middleware) query-hash cache-ttl rff context)
        reducef' (fn [rff context metadata rows]
                   (impl/do-with-serialization
                    (fn [in-fn result-fn]
                      (binding [*in-fn*     in-fn
                                *result-fn* result-fn]
                        (reducef rff context metadata rows)))))]
    (if (= result ::miss)
      (let [start-time-ms (System/currentTimeMillis)]
        (log/trace "Running query and saving cached results (if eligible)...")
        (qp query
            (fn [metadata]
              (save-results-xform start-time-ms metadata query-hash (rff metadata) dashboard-id card-id true))
            (assoc context :reducef reducef')))
      (let [duration-ms (- (System/currentTimeMillis) @last-ran-cache)
            start-time-ms (System/currentTimeMillis)]
        (when (and result ::ok (canRunCache duration-ms start-time-ms card-id query-hash))
            (if (System/getenv "MB_CACHE_REFRESH_INSERT_DB")
              (add-db-by-refresh-cache-async query dashboard-id card-id )
              (refresh-cache-function query (info :dashboard-id) (info :card-id))
              ))))))

(defn- is-cacheable? {:arglists '([query])} [{:keys [cache-ttl]}]
  (and (public-settings/enable-query-caching)
       cache-ttl))

(defn maybe-return-cached-results
  "Middleware for caching results of a query if applicable.
  In order for a query to be eligible for caching:

     *  Caching (the `enable-query-caching` Setting) must be enabled
     *  The query must pass a `:cache-ttl` value. For Cards, this can be the value of `:cache_ttl`,
        otherwise falling back to the value of the `query-caching-default-ttl` Setting.
     *  The query must already be permissions-checked. Since the cache bypasses the normal
        query processor pipeline, the ad-hoc permissions-checking middleware isn't applied for cached results.
        (The various `/api/card/` endpoints that make use of caching do `can-read?` checks for the Card *before*
        running the query, satisfying this requirement.)
     *  The result *rows* of the query must be less than `query-caching-max-kb` when serialized (before compression)."
  [qp]
  (fn maybe-return-cached-results* [{:keys [cache-ttl middleware info], :as query} rff context]
    (if (:refresh-cache middleware)
      (refresh-cache-function query (info :dashboard-id) (info :card-id))
      (if (:get-the-cache-info? middleware)
        (qp.context/reducef rff context {:query_hash_base64 (.encodeToString (Base64/getEncoder) (qp.util/query-hash query))} [])
        (let [cacheable? (is-cacheable? query)]
          (if cacheable?
            (run-query-with-cache qp query rff context)
            (qp query rff context)))))))
