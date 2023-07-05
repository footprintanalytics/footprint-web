(ns metabase.util.convert_sql_dynamic_by_table
  "Sql enhancements, replacing table string to table"
  (:require [clojure.string :as str]
            [clojure.tools.logging :as log])
  )

(defn handle-convert [sql col]
  (let [hasDot (str/includes? col "'")
        fixed-table (str/replace col "'" "")]
    (if hasDot (str/replace sql col fixed-table) sql)
    )
  )

(defn canConvert [col]
  (let [is_include (str/includes? col "'")]
    is_include))

(defn canRun [sqlTables]
  (some canConvert sqlTables))

(defn convert-sql [sql]
      (let [regex #"(?<=from|join|FROM|JOIN)+(?:\s|`|\")+(?:'\w+')+"
            result (re-seq regex sql)]
         (if (canRun  result)
           (let [last-sql (reduce #(handle-convert %1 %2 ) sql result)]
              last-sql
           )
           sql
         )
      )
  )
