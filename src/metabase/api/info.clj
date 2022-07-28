(ns metabase.api.info
  (:require [clojure.core.async :as a]
            [clojure.data :as data]
            [clojure.tools.logging :as log]
            [compojure.core :refer [DELETE GET POST PUT]]
            [medley.core :as m]
            [metabase.api.common :as api]
            [metabase.models.card :as card :refer [Card]]
            [metabase.models.dashboard :refer [Dashboard]]
            [metabase.models.database :refer [Database]]
            [metabase.models.interface :as mi]
            [metabase.models.query :as query]
            [metabase.query-processor :as qp]
            [metabase.query-processor.middleware.permissions :as qp.perms]
            [metabase.query-processor.streaming :as qp.streaming]
            [metabase.query-processor.middleware.constraints :as constraints]
            [metabase.query-processor.util :as qputil]
            [metabase.related :as related]
            [metabase.sync.analyze.query-results :as qr]
            [metabase.util :as u]
            [metabase.util.i18n :refer [trs tru]]
            [metabase.util.schema :as su]
            [schema.core :as s]
            [toucan.db :as db])
  (:import java.util.UUID)
  (:import java.util.Base64))

(defn query-for-card
  "Generate a query for a saved Card"
  [{query :dataset_query
    :as   card} parameters constraints middleware & [ids]]
  (log/info "query-for-card")
  (let [query     (-> query
                      ;; don't want default constraints overridding anything that's already there
                      (m/dissoc-in [:middleware :add-default-userland-constraints?])
                      (assoc :constraints constraints
                             :parameters  parameters
                             :middleware  middleware))
        dashboard (db/select-one [Dashboard :cache_ttl] :id (:dashboard-id ids))
        database  (db/select-one [Database :cache_ttl] :id (:database_id card))
        ]
    query))

(defn run-query-for-card-async
  "Run the query for Card with `parameters` and `constraints`, and return results in a `StreamingResponse` that should
  be returned as the result of an API endpoint fn. Will throw an Exception if preconditions (such as read perms) are
  not met before returning the `StreamingResponse`."
  [card-id export-format
   & {:keys [parameters constraints context dashboard-id middleware qp-runner run ignore_cache]
      :or   {constraints constraints/default-query-constraints
             context     :question
             qp-runner   qp/process-query-and-save-execution!}}]
  {:pre [(u/maybe? sequential? parameters)]}
  (log/info "run-query-for-card-async" qp-runner)
  (let [run   (or run
                  ;; param `run` can be used to control how the query is ran, e.g. if you need to
                  ;; customize the `context` passed to the QP
                  (^:once fn* [query info]
                    (qp.streaming/streaming-response [context export-format (u/slugify (:card-name info))]
                                                     (binding [qp.perms/*card-id* card-id]
                                                       (qp-runner query info context)))))
        card  (db/select-one [Card :id :name :dataset_query :database_id :cache_ttl :collection_id] :id card-id)
        query (-> (assoc (query-for-card card parameters constraints middleware {:dashboard-id dashboard-id}) :async? true)
                  (update :middleware (fn [middleware]
                                        (merge
                                         {:js-int-to-string? true :ignore-cached-results? ignore_cache :get-the-cache-info? true}
                                         middleware))))
        info  {:executed-by  api/*current-user-id*
               :context      context
               :card-id      card-id
               :card-name    (:name card)
               :dashboard-id dashboard-id}]
    (run query info)))

(api/defendpoint ^:streaming POST "/card/:card-id/cache"
  "Run the query associated with a Card."
  [card-id :as {{:keys [parameters ignore_cache dashboard_id], :or {ignore_cache false dashboard_id nil}} :body}]
  {ignore_cache (s/maybe s/Bool)
   dashboard_id (s/maybe su/IntGreaterThanZero)}
  (run-query-for-card-async
   card-id :api
   :parameters parameters,
   :ignore_cache ignore_cache
   :dashboard-id dashboard_id
   :middleware {:process-viz-settings? false}))



(api/define-routes)
