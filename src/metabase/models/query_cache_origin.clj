(ns metabase.models.query-cache-origin
  "A model used to management cache query request in the database."
  (:require [metabase.util :as u]
            [toucan.models :as models]))
;status: ready pending success error
(models/defmodel QueryCacheOrigin :query_cache_origin)

(u/strict-extend #_{:clj-kondo/ignore [:metabase/disallow-class-or-type-on-model]} (class QueryCacheOrigin)
  models/IModel
  (merge models/IModelDefaults
         {:properties (constantly {:updated-at-timestamped? true})}))
