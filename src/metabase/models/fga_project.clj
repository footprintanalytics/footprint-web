(ns metabase.models.fga_project
  (:require [honeysql.core :as hsql]
            [metabase.db.connection :as mdb.connection]
            [metabase.db.util :as mdb.u]
            [metabase.driver :as driver]
            [metabase.models.serialization.base :as serdes.base]
            [metabase.models.serialization.hash :as serdes.hash]
            [metabase.util :as u]
            [toucan.db :as db]
            [toucan.models :as models]))

(models/defmodel Project :fga_project)

(defn schema [schema-id]
  (when schema-id
    (db/select-field :schema Project :id schema-id  :active true))
  )
