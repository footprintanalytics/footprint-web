(ns metabase.util.convert_sql
  "Fp special business processing, data privacy isolation switch for special sql"
  (:require [clojure.string :as str]
            [clojure.tools.logging :as log]
            [metabase.models.fga_account_mapping :as fga_account_mapping]
            [metabase.models.fga_table :as fga_table])
  )

(defn get-fga-table-white-list []
  (let [table-white-list (fga_table/fga-table-white-list)]
    (println "get-fga-table-white-list--->>>>>" table-white-list)
    table-white-list
    )
  )

(defn get-fga-account-mapping [groupName]
  (let [account (fga_account_mapping/account-mapping-result groupName)]
    (println "get-fga-account-mapping--->>>>>" account)
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

(defn get-footprint-catalog []
  (
    let [footprint-catalog (System/getenv "FOOTPRINT_CATALOG")]
    (if footprint-catalog
      footprint-catalog
      ""
      )
    )
  )

(defn get-fga-catalog []
  (
    let [fga-catalog (System/getenv "FGA_CATALOG")]
    (if fga-catalog
      fga-catalog
      ""
      )
    )
  )

(defn handle-replace-schema [sql col]
  "Replace schema if table is special"
  (println "handle-replace-schema" col)
  (let [trim-table (str/trim col)
        footprint-catalog (get-footprint-catalog)
        fga-catalog (get-fga-catalog)
        footprint-schema (get-footprint-schema)
        account-schema (get-fga-account-mapping "animoca_mocaverse")
        fixed-trim-table (str/replace trim-table footprint-schema account-schema)
        fixed-trim-table
        (if (str/includes? fixed-trim-table footprint-catalog)
          (str/replace fixed-trim-table footprint-catalog fga-catalog)
          (str "\"" fga-catalog "\"." fixed-trim-table)
          )
        ]
    (str/replace sql trim-table fixed-trim-table)
    )
  )

(defn handle-add-schema [sql col]
  "Add schema if table is special"
  (println "handle-add-schema", col)
  (let [trimTable (str/trim col)
        fga-catalog (get-fga-catalog)
        account-schema (get-fga-account-mapping "animoca_mocaverse")
        replaceSpaceSQLStr (str/replace sql (str trimTable " ") (str "\"" fga-catalog "\"." "\""  account-schema "\"." trimTable " "))
        ]
    (str/replace replaceSpaceSQLStr (str trimTable "\n") (str "\"" fga-catalog "\"." "\"" "\""account-schema "\"." trimTable "\n"))
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
           groupRegex #"(?<=from|join|FROM|JOIN)+((?:\s|`|\")+(?:\w|`|\"|\.)+)"
           fix_sql (str/replace sql groupRegex "$1 ")
           result (re-seq regex sql)
           last_sql (reduce handle-convert fix_sql result )]
      last_sql
      )
    )
  )
