(ns metabase.models.query-cache-async
  "A model used to management cache query request in the database."
  (:require [metabase.util :as u]
            [toucan.models :as models]))
;status: ready pending success error
(models/defmodel QueryCacheAsync :query_cache_async)

(u/strict-extend #_{:clj-kondo/ignore [:metabase/disallow-class-or-type-on-model]} (class QueryCacheAsync)
  models/IModel
  (merge models/IModelDefaults
         {:properties (constantly {:updated-at-timestamped? true})}))
