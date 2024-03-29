(ns metabase.query-processor.util
  "Utility functions used by the global query processor and middleware functions."
  (:require [buddy.core.codecs :as codecs]
            [buddy.core.hash :as buddy-hash]
            [cheshire.core :as json]
            [clojure.string :as str]
            [medley.core :as m]
            [clojure.tools.logging :as log]
            [metabase.util.convert_sql :as convert]
            [metabase.driver :as driver]
            [metabase.util.schema :as su]
            [metabase.models.user :refer [User]]
            [toucan.db :as db]
            [schema.core :as s]))

;; TODO - I think most of the functions in this namespace that we don't remove could be moved to [[metabase.mbql.util]]

(defn query-without-aggregations-or-limits?
  "Is the given query an MBQL query without a `:limit`, `:aggregation`, or `:page` clause?"
  [{{aggregations :aggregation, :keys [limit page]} :query}]
  (and (not limit)
       (not page)
       (empty? aggregations)))

(defn default-query->remark
  "Generates the default query remark. Exists as a separate function so that overrides of the query->remark multimethod
   can access the default value."
  [{{:keys [executed-by query-hash card-id dashboard-id context], :as _info} :info, query-type :type, aysnc-cache :aysnc-refresh-cache2?, {:keys [project-role, power-level]} :middleware}]
  (str "Metabase"
       (format ":: userID: %s email: %s project-role: %s power-level: %s queryType: %s card-id: %s dashboard-id: %s context: %s aysnc-cache: %s"
               executed-by
               (when executed-by (db/select-one-field :email  User :id executed-by))
               project-role
               power-level
               (case (keyword query-type)
                     :query  "MBQL"
                     :native "native")
               card-id
               dashboard-id
               context
               aysnc-cache)
       (when query-hash
             (assert (instance? (Class/forName "[B") query-hash))
             (format " queryHash: %s" (codecs/bytes->hex query-hash)))))

(defmulti query->remark
  "Generate an appropriate remark `^String` to be prepended to a query to give DBAs additional information about the query
  being executed. See documentation for [[metabase.driver/mbql->native]] and #2386.
  for more information.

  So this turns your average 10, 20, 30 character query into a 110, 120, 130 etc character query.
  One leaky-abstraction part of this is that this will confuse the bejeezus out of
  people who first encounter their passed-through RDBMS error messages.

  'Hey, this is a 20 character query! What's it talking about, error at position 120?'
  This gets fixed, but in a spooky-action-at-a-distance way, in
  `frontend/src/metabase/query_builder/components/VisualizationError.jsx`"
  {:arglists '(^String [driver query])}
  driver/dispatch-on-initialized-driver
  :hierarchy #'driver/hierarchy)

(defmethod query->remark :default
  [_ query]
  (default-query->remark query))


;;; ------------------------------------------------- Normalization --------------------------------------------------

;; TODO - this has been moved to `metabase.mbql.util`; use that implementation instead.
(s/defn ^:deprecated normalize-token :- s/Keyword
  "Convert a string or keyword in various cases (`lisp-case`, `snake_case`, or `SCREAMING_SNAKE_CASE`) to a lisp-cased
  keyword."
  [token :- su/KeywordOrString]
  (-> (name token)
      str/lower-case
      (str/replace #"_" "-")
      keyword))


;;; ---------------------------------------------------- Hashing -----------------------------------------------------

(defn- select-keys-for-hashing
  "Return `query` with only the keys relevant to hashing kept.
  (This is done so irrelevant info or options that don't affect query results doesn't result in the same query
  producing different hashes.)"
  [query]
  {:pre [(map? query)]}
  (let [{:keys [constraints parameters], :as query} (select-keys query [:database :type :query :native :parameters
                                                                        :constraints])]
    (cond-> query
      (empty? constraints) (dissoc :constraints)
      (empty? parameters)  (dissoc :parameters))))

(defn createFixQuery [query]
  (let [canFix (or (:native query) (:query (:native query)))
        sql (:query (:native query))
        fga-schema (:fga-schema (:middleware query))]
    (if canFix
      (assoc query :native (assoc (:native query) :query (convert/convert-sql sql fga-schema)))
      query
      )
    )
  )

#_{:clj-kondo/ignore [:non-arg-vec-return-type-hint]}
(s/defn ^bytes query-hash :- (Class/forName "[B")
  "Return a 256-bit SHA3 hash of `query` as a key for the cache. (This is returned as a byte array.)"
  [query]
  (let [fixQuery (createFixQuery query)]
    (buddy-hash/sha3-256 (json/generate-string (select-keys-for-hashing fixQuery)))))


;;; --------------------------------------------- Query Source Card IDs ----------------------------------------------

(defn query->source-card-id
  "Return the ID of the Card used as the \"source\" query of this query, if applicable; otherwise return `nil`."
  ^Integer [outer-query]
  (let [source-table (get-in outer-query [:query :source-table])]
    (when (string? source-table)
      (when-let [[_ card-id-str] (re-matches #"^card__(\d+$)" source-table)]
        (Integer/parseInt card-id-str)))))

;;; ------------------------------------------- Metadata Combination Utils --------------------------------------------

(defn field-ref->key
  "A standard and repeatable way to address a column. Names can collide and sometimes are not unique. Field refs should
  be stable, except we have to exclude the last part as extra information can be tucked in there. Names can be
  non-unique at times, numeric ids are not guaranteed."
  [[tyype identifier]]
  [tyype identifier])

(def preserved-keys
  "Keys that can survive merging metadata from the database onto metadata computed from the query. When merging
  metadata, the types returned should be authoritative. But things like semantic_type, display_name, and description
  can be merged on top."
  ;; TODO: ideally we don't preserve :id but some notion of :user-entered-id or :identified-id
  [:id :description :display_name :semantic_type
   :fk_target_field_id :settings :visibility_type])

(defn combine-metadata
  "Blend saved metadata from previous runs into fresh metadata from an actual run of the query.

  Ensure that saved metadata from datasets or source queries can remain in the results metadata. We always recompute
  metadata in general, so need to blend the saved metadata on top of the computed metadata. First argument should be
  the metadata from a run from the query, and `pre-existing` should be the metadata from the database we wish to
  ensure survives."
  [fresh pre-existing]
  (let [by-key (m/index-by (comp field-ref->key :field_ref) pre-existing)]
    (for [{:keys [field_ref source] :as col} fresh]
      (if-let [existing (and (not= :aggregation source)
                             (get by-key (field-ref->key field_ref)))]
        (merge col (select-keys existing preserved-keys))
        col))))
