(ns metabase.models.fga_table
  (:require [honeysql.core :as hsql]
            [metabase.db.connection :as mdb.connection]
            [metabase.db.util :as mdb.u]
            [metabase.driver :as driver]
            [metabase.models.serialization.base :as serdes.base]
            [metabase.models.serialization.hash :as serdes.hash]
            [metabase.util :as u]
            [toucan.db :as db]
            [toucan.models :as models]))

(models/defmodel FgaTable :fga_table)

(defn fga-table-white-list []
  (db/select-field :name FgaTable :active true)
  )