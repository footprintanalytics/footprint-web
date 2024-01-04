(ns metabase.util.convert_sql
  "Fp special business processing, data privacy isolation switch for special sql"
  (:require [clojure.string :as str]
            [clojure.tools.logging :as log]
            [metabase.models.fga_project :as fga_project]
            [metabase.models.fga_replace_table :as fga_replace_table])
  )

(defn get-fga-table-white-list []
  (let [table-white-list (fga_replace_table/fga-table-white-list)]
    (log/info "get-fga-table-white-list--->>>>>" table-white-list)
    table-white-list
    )
  )

(defn get-fga-schema [schema-id]
  (let [schemas (fga_project/schema schema-id)]
    (log/info "get-fga-schemas--->>>>>" schemas schema-id)
    (first schemas)
    )
  )

(defn get-fga-name [schema-id]
  (let [name (fga_project/name schema-id)
        first-name (first name)]
    (log/info "get-fga-name--->>>>>" name schema-id)
    (if (str/blank? first-name)
      first-name
      (-> first-name
          (str/lower-case)
          (str/replace " " "_"))
      )
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
  (log/info "handle-replace-schema" col)
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
  (log/info "handle-add-schema", col)
  (let [trimTable (str/trim col)
        fga-catalog (get-fga-catalog)
        replaceSpaceSQLStr (str/replace sql (str trimTable " ") (str "\"" fga-catalog "\"." "\""  fga-schema "\"." trimTable " "))
        ]
    (str/replace replaceSpaceSQLStr (str trimTable "\n") (str "\"" fga-catalog "\"." "\"" "\"" fga-schema "\"." trimTable "\n"))
    )
  )

(defn handle-add-project-name-to-table [sql col project-name]
  "Add project name to table"
  (let [last-table (last (str/split (str/trim col) #"\."))
        replace-origin-table (str/replace last-table "\"" "")]
    (println "table", last-table replace-origin-table)
    (str/replace sql replace-origin-table (str project-name "__" replace-origin-table))
    ))

(defn handle-convert [sql col fga-name]
  (let [fga-tables (into [] (get-fga-table-white-list))
        col-format (str/replace col  "\"" "")
        col-format-list (str/split col-format #"\.")
        fixed-result (str/trim (last col-format-list))
        is_include (some #(= fixed-result %) fga-tables)]
    (if is_include
      (let [trimTable (str/trim col)
            hasDot (str/includes? trimTable ".")]
        (if hasDot (handle-add-project-name-to-table sql col fga-name) (handle-add-project-name-to-table sql col fga-name))
        )
      sql
      )
    )
  )

(defn canConvert [col]
  (let [fga-tables (into [] (get-fga-table-white-list))
        col-format (str/replace col  "\"" "")
        col-format-list (str/split col-format #"\.")
        fixed-result (str/trim(last col-format-list))
        is_include (some #(= fixed-result %) fga-tables)]
    is_include))

(defn canRunFGAConvert [sqlTables]
  (some canConvert sqlTables))

(defn convert-sql [sql schema-id]
  (log/info "convert-sql0: fga-schema " sql schema-id)
  (let [fga-name (get-fga-name schema-id)]
    (log/info "convert-sql: fga-name " fga-name)
    (if fga-name
      (let [regex #"(?<=from|join|FROM|JOIN)+(?:\s|`|\")+(?:\w|`|\"|\.)+"
            group-regex #"(?<=from|join|FROM|JOIN)+((?:\s|`|\")+(?:\w|`|\"|\.)+)"
            fix-sql (str/replace sql group-regex "$1 ")
            result (re-seq regex sql)]
        (log/info "convert-sql: fix-sql " fix-sql)
        (log/info "convert-sql: result " result)
        (log/info "convert-sql: (canRunFGAConvert  result) " (canRunFGAConvert  result))
         (if (canRunFGAConvert  result)
           (let [last-sql (reduce #(handle-convert %1 %2 fga-name) fix-sql result)]
              last-sql
           )
           sql
         )
      )
      sql)
    )
  )
