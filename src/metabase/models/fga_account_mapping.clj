(ns metabase.models.fga_account_mapping
  (:require [honeysql.core :as hsql]
            [metabase.db.connection :as mdb.connection]
            [metabase.db.util :as mdb.u]
            [metabase.driver :as driver]
            [metabase.models.serialization.base :as serdes.base]
            [metabase.models.serialization.hash :as serdes.hash]
            [metabase.util :as u]
            [toucan.db :as db]
            [toucan.models :as models]))

(models/defmodel FgaAccountMapping :fga_account_mapping)

(defn account-mapping-result [group_name]
  (when group_name
    (db/select-field :schema_name FgaAccountMapping :group_name group_name :active true))
  )