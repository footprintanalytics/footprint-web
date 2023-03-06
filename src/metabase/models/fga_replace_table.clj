(ns metabase.models.fga_replace_table
  (:require 
            [toucan.db :as db]
            [toucan.models :as models]))

(models/defmodel FgaReplaceTable :fga_replace_table)

(defn fga-table-white-list []
  (db/select-field :name FgaReplaceTable :active true)
  )