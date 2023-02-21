(ns metabase.util.convert_sql
  "Fp special business processing, data privacy isolation switch for special sql"
  (:require [clojure.string :as str]
            [clojure.tools.logging :as log]
            [metabase.models.fga_account_mapping :as fga_account_mapping]
            [metabase.models.fga_table :as fga_table])
  )

(defn get-fga-table-white-list []
  (let [table-white-list (fga_table/fga-table-white-list)]
    table-white-list
    )
  )

(defn get-fga-account-mapping [groupName]
  (let [account (fga_account_mapping/account-mapping-result groupName)]
    (first account)
    )
  )

(defn get-footprint-schema []
  (
    let [footprint-schema (System/getenv "FOOTPRINT_SCHEMA")]
    (if footprint-schema
      footprint-schema
      ""
      )
    )
  )

(defn handle-replace-schema [sql col]
  "Replace schema if table is special"
  (println "handle-replace-schema" col)
  (let [trimTable (str/trim col)
        footprint-schema (get-footprint-schema)
        account-schema (get-fga-account-mapping "animoca_mocaverse")
        fixedTrimTable (str/replace trimTable footprint-schema account-schema)]
    (str/replace sql trimTable fixedTrimTable)
    )
  )

(defn handle-add-schema [sql col]
  "Add schema if table is special"
  (println "handle-add-schema", col)
  (let [trimTable (str/trim col)
        account-schema (get-fga-account-mapping "animoca_mocaverse")
        replaceSpaceSQLStr (str/replace sql (str trimTable " ") (str "\""  account-schema "\"." trimTable " "))
        ]
    (str/replace replaceSpaceSQLStr (str trimTable "\n") (str "\""account-schema "\"." trimTable "\n"))
    )
  )

(defn handle-convert [sql col]
  (let [fga-tables (into [] (get-fga-table-white-list))
        is_include (some #(str/includes? col %) fga-tables)]
    (if is_include
      (let [trimTable (str/trim col)
            hasDot (str/includes? trimTable ".")]
        (if hasDot (handle-replace-schema sql col) (handle-add-schema sql col))
        )
      sql
      )
    )
  )

(defn convert-sql [sql userId]
  (if (= userId 8816)
    sql
    (let [ regex #"(?<=from|join|FROM|JOIN)+(?:\s|`|\")+(?:\w|`|\"|\.)+"
           result (re-seq regex sql)
           last_sql (reduce handle-convert sql result )]
      last_sql
      )
    )
  )
