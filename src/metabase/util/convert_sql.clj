(ns metabase.util.convert_sql
  "Fp special business processing, data privacy isolation switch for special sql"
  (:require [clojure.string :as str]
            [clojure.tools.logging :as log]
            [metabase.models.fga_project :as fga_project]
            [metabase.models.fga_replace_table :as fga_replace_table])
  )

(defn get-fga-table-white-list []
  (let [table-white-list (fga_replace_table/fga-table-white-list)]
    (println "get-fga-table-white-list--->>>>>" table-white-list)
    table-white-list
    )
  )

(defn get-fga-schema [schema-id]
  (let [schemas (fga_project/schema schema-id)]
    (println "get-fga-schemas--->>>>>" schemas)
    (first schemas)
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

(defn handle-replace-schema [sql col fga-schema]
  "Replace schema if table is special"
  (println "handle-replace-schema" col)
  (let [trim-table (str/trim col)
        footprint-catalog (get-footprint-catalog)
        fga-catalog (get-fga-catalog)
        footprint-schema (get-footprint-schema)
        fixed-trim-table (str/replace trim-table footprint-schema fga-schema)
        fixed-trim-table
        (if (str/includes? fixed-trim-table footprint-catalog)
          (str/replace fixed-trim-table footprint-catalog fga-catalog)
          (str "\"" fga-catalog "\"." fixed-trim-table)
          )
        ]
    (str/replace sql trim-table fixed-trim-table)
    )
  )

(defn handle-add-schema [sql col fga-schema]
  "Add schema if table is special"
  (println "handle-add-schema", col)
  (let [trimTable (str/trim col)
        fga-catalog (get-fga-catalog)
        replaceSpaceSQLStr (str/replace sql (str trimTable " ") (str "\"" fga-catalog "\"." "\""  fga-schema "\"." trimTable " "))
        ]
    (str/replace replaceSpaceSQLStr (str trimTable "\n") (str "\"" fga-catalog "\"." "\"" "\"" fga-schema "\"." trimTable "\n"))
    )
  )

(defn handle-convert [sql col fga-schema]
  (let [fga-tables (into [] (get-fga-table-white-list))
        col-format (str/replace col  "\"" "")
        col-format-list (str/split col-format #"\.")
        fixed-result (last col-format-list)
        is_include (some #(= fixed-result %) fga-tables)]
    (if is_include
      (let [trimTable (str/trim col)
            hasDot (str/includes? trimTable ".")]
        (if hasDot (handle-replace-schema sql col fga-schema) (handle-add-schema sql col fga-schema))
        )
      sql
      )
    )
  )

(defn canConvert [col]
  (let [fga-tables (into [] (get-fga-table-white-list))
        col-format (str/replace col  "\"" "")
        col-format-list (str/split col-format #"\.")
        fixed-result (last col-format-list)
        is_include (some #(= fixed-result %) fga-tables)]
    is_include))

(defn canRunFGAConvert [sqlTables]
  (some canConvert sqlTables))

(defn convert-sql [sql schema-id]
  (let [fga-schema (get-fga-schema schema-id)]
    (if fga-schema
      (let [regex #"(?<=from|join|FROM|JOIN)+(?:\s|`|\")+(?:\w|`|\"|\.)+"
            group-regex #"(?<=from|join|FROM|JOIN)+((?:\s|`|\")+(?:\w|`|\"|\.)+)"
            fix-sql (str/replace sql group-regex "$1 ")
            result (re-seq regex sql)]
         (if (canRunFGAConvert  result)
           (let [last-sql (reduce #(handle-convert %1 %2 fga-schema) fix-sql result)]
              last-sql
           )
           sql
         )
      )
      sql)
    )
  )
