(ns metabase.util.convert_sql
  "Fp special business processing, data privacy isolation switch for special sql"
  (:require [clojure.string :as str]
            [clojure.tools.logging :as log])
  )

(defn get-fga-table-white-list []
  ["ORDERS" "yyyyy"]
  )


(defn get-fga-name [schema-id]
  "Mocaverse"
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

(defn concat-with-underscores [str2 table]
  (let [table (str/trim table)
        quoted? (and (string? table )
                     (.startsWith table "\"")
                     (.endsWith table "\""))
        table-str (if quoted?
                    (subs table 1 (dec (count table)))
                    table)
        result (str str2 "__" table-str)]
    (if quoted?
      (str "\"" result "\"")
      result)))

(defn handle-add-project-name-to-table [sql col project-name]
  "Add project name to table"
  (let [replace-origin-table (str " " (last (str/split (str/trim col) #"\.")) " ")
        goal-table (concat-with-underscores project-name replace-origin-table)
        where-replace-origin-table (if (str/includes? col "\"")
                                     (last (str/split (str/trim col) #"\."))
                                     (str "\"" (last (str/split (str/trim col) #"\.")) "\""))
        where-replace-origin-table-dot (str where-replace-origin-table ".")
        where-goal-table (concat-with-underscores project-name where-replace-origin-table)
        where-goal-table-dot (str where-goal-table ".")
        ]
    (str/replace
     (str/replace sql replace-origin-table goal-table)
     where-replace-origin-table-dot where-goal-table-dot)
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
            group-regex #"(?<=from|join|FROM|JOIN|as|AS)+((?:\s|`|\")+(?:\w|`|\"|\.)+)"
            fix-sql (str/replace sql group-regex " $1 ")
            result (distinct (re-seq regex sql))]
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
