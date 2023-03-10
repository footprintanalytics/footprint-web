(ns metabase.query-processor.middleware.cache-backend.db
  (:require [clojure.java.jdbc :as jdbc]
            [clojure.tools.logging :as log]
            [honeysql.core :as hsql]
            [java-time :as t]
            [metabase.db :as mdb]
            [cheshire.core :as json]
            [metabase.models.query-cache :refer [QueryCache]]
            [metabase.models.query-cache-async :refer [QueryCacheAsync]]
            [metabase.query-processor.middleware.cache-backend.interface :as i]
            [metabase.util.date-2 :as u.date]
            [metabase.util.i18n :refer [trs]]
            [toucan.db :as db])
  (:import [java.sql Connection PreparedStatement ResultSet Types]))

(defn- seconds-ago [n]
  (let [[unit n] (if-not (integer? n)
                   [:millisecond (long (* 1000 n))]
                   [:second n])]
    (u.date/add (t/offset-date-time) unit (- n))))

(def ^:private ^{:arglists '([])} cached-results-query-sql
  ;; this is memoized for a given application DB so we can deliver cached results EXTRA FAST and not have to spend an
  ;; extra microsecond compiling the same exact query every time. :shrug:
  ;;
  ;; Since application DB can change at run time (during tests) it's not just a plain delay
  (let [f (memoize (fn [_db-type quoting-style]
                     (first (hsql/format {:select   [:results]
                                          :from     [QueryCache]
                                          :where    [:and
                                                     [:= :query_hash (hsql/raw "?")]
                                                     [:>= :updated_at (hsql/raw "?")]]
                                          :order-by [[:updated_at :desc]]
                                          :limit    1}
                                         :quoting quoting-style))))]
    (fn []
      (f (mdb/db-type) (db/quoting-style)))))

(defn- prepare-statement
  ^PreparedStatement [^Connection conn query-hash max-age-seconds]
  (let [stmt (.prepareStatement conn ^String (cached-results-query-sql)
                                ResultSet/TYPE_FORWARD_ONLY
                                ResultSet/CONCUR_READ_ONLY
                                ResultSet/CLOSE_CURSORS_AT_COMMIT)]
    (try
      (doto stmt
        (.setFetchDirection ResultSet/FETCH_FORWARD)
        (.setBytes 1 query-hash)
        (.setObject 2 (seconds-ago max-age-seconds) Types/TIMESTAMP_WITH_TIMEZONE)
        (.setMaxRows 1))
      (catch Throwable e
        (log/error e (trs "Error preparing statement to fetch cached query results"))
        (.close stmt)
        (throw e)))))

(defn- cached-results [query-hash max-age-seconds respond]
  (with-open [conn (jdbc/get-connection (db/connection))
              stmt (prepare-statement conn query-hash max-age-seconds)
              rs   (.executeQuery stmt)]
    ;; VERY IMPORTANT! Bind [[db/*db-connection*]] so it will get reused elsewhere for the duration of results
    ;; reduction, otherwise we can potentially end up deadlocking if we need to acquire another connection for one
    ;; reason or another, such as recording QueryExecutions
    (binding [db/*db-connection* {:connection conn}]
      (if-not (.next rs)
        (respond nil)
        (with-open [is (.getBinaryStream rs 1)]
          (respond is))))))

(defn- purge-old-cache-entries!
  "Delete any cache entries that are older than the global max age `max-cache-entry-age-seconds` (currently 3 months)."
  [max-age-seconds]
  {:pre [(number? max-age-seconds)]}
  (log/tracef "Purging old cache entries.")
  (try
    (db/simple-delete! QueryCache
                       :updated_at [:<= (seconds-ago max-age-seconds)])
    (catch Throwable e
      (log/error e (trs "Error purging old cache entries"))))
  nil)

(defn- save-results-v2!
  "Save the `results` of query with `query-hash`, updating an existing QueryCache entry if one already exists, otherwise
  creating a new entry."
  [^bytes query-hash ^bytes results dashboard-id card-id]
  (log/info "save-results-v2 store cache data to fix doris bug")
  (log/info dashboard-id)
  (log/info card-id)
  (try
    (or (db/update-where! QueryCache {:query_hash query-hash}
                          :updated_at (t/offset-date-time)
                          :results    results
                          :dashboard_id dashboard-id
                          :card_id card-id
                          )
        (db/insert! QueryCache
                    :updated_at (t/offset-date-time)
                    :query_hash query-hash
                    :results    results
                    :dashboard_id dashboard-id
                    :card_id card-id
                    ))
    (catch Throwable e
      (log/error e (trs "Error saving query results to cache."))))
  nil)

(defn- save-results!
  "Save the `results` of query with `query-hash`, updating an existing QueryCache entry if one already exists, otherwise
  creating a new entry."
  [^bytes query-hash ^bytes results]
  (log/debug (trs "Caching results for query with hash {0}." (pr-str (i/short-hex-hash query-hash))))
  (try
    (or (db/update-where! QueryCache {:query_hash query-hash}
          :updated_at (t/offset-date-time)
          :results    results)
        (db/insert! QueryCache
          :updated_at (t/offset-date-time)
          :query_hash query-hash
          :results    results))
    (catch Throwable e
      (log/error e (trs "Error saving query results to cache."))))
  nil)

(defn- save-cache-request!
  "Save the request into the db."
  [^bytes query-hash query dashboard-id card-id]
  (try
    (or (db/update-where! QueryCacheAsync {:query_hash query-hash}
                          :query (pr-str  query)
                          :query_hash query-hash
                          :dashboard_id dashboard-id
                          :card_id card-id
                          :status "ready"
                          :updated_at (t/offset-date-time))
        (db/insert! QueryCacheAsync {
                                      :query (pr-str  query)
                                      :query_hash query-hash
                                      :dashboard_id dashboard-id
                                      :card_id card-id
                                      :status "ready"
                                      :updated_at (t/offset-date-time)}))
    (catch Throwable e
      (log/error e (trs "Error saving query results to cache."))))
  nil)

(defn- getCacheModel []
  (if (System/getenv "MB_CACHE_REFRESH_INSERT_DB") QueryCacheAsync QueryCache))

(defn- update-cache-status!
  [^bytes query-hash status]
  (try
    (db/update-where! (getCacheModel) {:query_hash query-hash}
                      :status status
                      :updated_at (t/offset-date-time))
    (catch Throwable e
      (log/error e (trs "Error updating status to cache."))))
  nil)

(defn getQueryCacheStatus [query-hash]
  (db/select-one-field :status (getCacheModel) :query_hash query-hash)
  )

(defn getQueryCacheStatusUpdatedAt [query-hash]
  (db/select-one-field :updated_at (getCacheModel) :query_hash query-hash)
  )

(defn getQueryAsyncUpperLimit [max] (if max max 5))

(defn getQueryAsyncList [max]
  (let [pending (db/count QueryCacheAsync {:where [:= :status "pending"]})]
    (db/select QueryCacheAsync
               {:where    [:= :status "ready"]
                :order-by [[:updated_at :desc]]
                :limit (- max pending)})
    )
  )

(defmethod i/cache-backend :db
  [_]
  (reify i/CacheBackend
    (cached-results [_ query-hash max-age-seconds respond]
      (cached-results query-hash max-age-seconds respond))

    (save-results! [_ query-hash is]
      (save-results! query-hash is)
      nil)

    (save-results-v2! [_ query-hash is dashboard-id card-id]
      (save-results-v2! query-hash is dashboard-id card-id)
      nil)

    (save-cache-request! [_ query-hash query dashboard-id card-id]
      (save-cache-request! query-hash query dashboard-id card-id)
      nil)

    (update-cache-status! [_ query-hash status]
      (update-cache-status! query-hash status)
      nil)

    (purge-old-entries! [_ max-age-seconds]
      (purge-old-cache-entries! max-age-seconds))))
