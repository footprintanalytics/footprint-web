(ns metabase.api.notify
  "/api/notify/* endpoints which receive inbound etl server notifications."
  (:require [compojure.core :refer [POST]]
            [metabase.api.common :as api]
            [metabase.models.database :refer [Database]]
            [metabase.models.table :refer [Table]]
            [metabase.sync :as sync]
            [metabase.sync.sync-metadata :as sync-metadata]
            [metabase.util.schema :as su]
            [clojure.tools.logging :as log]
            [metabase.sync.sync-metadata.tables :as sync-tables]
            [schema.core :as s]
            [metabase.query-processor.card :as qp.card]
            [toucan.db :as db]))

(def ^:private ^:dynamic *execute-asynchronously* true)

(api/defendpoint POST "/db/:id"
  "Notification about a potential schema change to one of our `Databases`.
  Caller can optionally specify a `:table_id` or `:table_name` in the body to limit updates to a single
  `Table`. Optional Parameter `:scan` can be `\"full\"` or `\"schema\"` for a full sync or a schema sync, available
  regardless if a `:table_id` or `:table_name` is passed.
  This endpoint is secured by an API key that needs to be passed as a `X-METABASE-APIKEY` header which needs to be defined in
  the `MB_API_KEY` [environment variable](https://www.metabase.com/docs/latest/configuring-metabase/environment-variables.html#mb_api_key)"
  [id :as {{:keys [table_id table_name scan]} :body}]
  {table_id   (s/maybe su/IntGreaterThanZero)
   table_name (s/maybe su/NonBlankString)
   scan       (s/maybe (s/enum "full" "schema"))}
  (let [schema?       (when scan (#{"schema" :schema} scan))
        table-sync-fn (if schema? sync-metadata/sync-table-metadata! sync/sync-table!)
        db-sync-fn    (if schema? sync-metadata/sync-db-metadata! sync/sync-database!)
        execute!      (fn [thunk]
                        (if *execute-asynchronously*
                          (future (thunk))
                          (thunk)))]
    (api/let-404 [database (db/select-one Database :id id)]
      (cond
        table_id   (api/let-404 [table (db/select-one Table :db_id id, :id (int table_id))]
                     (execute! #(table-sync-fn table)))
        table_name (api/let-404 [table (db/select-one Table :db_id id, :name table_name)]
                     (execute! #(table-sync-fn table)))
        :else      (execute! #(db-sync-fn database)))))
  {:success true})

(api/defendpoint POST "/db/:id/table"
  "Caller can optionally specify a `:table_name` and a `:scan schema` in the body to limit updates to a single `Table`.
  This endpoint is secured by an API key that needs to be passed as a `X-METABASE-APIKEY` header which needs to be defined in
  the `MB_API_KEY` [environment variable](https://www.metabase.com/docs/latest/operations-guide/environment-variables.html#mb_api_key)"
  [id :as {{:keys [table_id table_name scan]} :body}]
  {table_id   (s/maybe su/IntGreaterThanZero)
   table_name (s/maybe su/NonBlankString)
   scan       (s/maybe (s/enum "full" "schema"))}
  (let [schema?       (when scan (#{"schema" :schema} scan))
        table-sync-fn (if schema? sync-metadata/sync-table-metadata! sync/sync-table!)
        db-sync-fn    (if schema? sync-metadata/sync-db-metadata! sync/sync-database!)
        execute!      (fn [thunk]
                        (if *execute-asynchronously*
                          (future (thunk))
                          (thunk)))
        ]
    (log/infof "========> schema: %s" schema? scan)
    (when schema? (execute! (sync-tables/sync-target-table! (Database id) table_name)))
    (log/infof "========> id: %s, name: %s, table: %s" id table_name (Table :db_id id, :name table_name))
    (api/let-404 [database (Database id)]
                 (cond
                  table_id   (when-let [table (Table :db_id id, :id (int table_id))]
                               (execute! #(table-sync-fn table)))
                  table_name (when-let [table (Table :db_id id, :name table_name)]
                               (execute! #(table-sync-fn table)))
                  :else      (execute! #(db-sync-fn database))))
    )
  {:success true})

(api/defendpoint POST "/cache/refresh"
  "Cache refresh from the table query_cache_async. You can set the env `MB_CACHE_REFRESH_INSERT_DB` to control the cache action which inert to db not after query.
  This endpoint is secured by an API key that needs to be passed as a `X-METABASE-APIKEY` header which needs to be defined in
  the `MB_API_KEY` [environment variable](https://www.metabase.com/docs/latest/configuring-metabase/environment-variables.html#mb_api_key)"
  [:as {{:keys [max ]} :body}]
  {max   (s/maybe su/IntGreaterThanZero)}
  (qp.card/run-query-cache-async-refresh max))

(api/define-routes)
