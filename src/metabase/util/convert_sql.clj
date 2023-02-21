(ns metabase.util.convert_sql
  "Fp special business processing, data privacy isolation switch for special sql"
  (:require [clojure.string :as str]
            [clojure.tools.logging :as log])
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
        fixedTrimTable (str/replace trimTable footprint-schema "animoca_mocaverse_test")]
    (str/replace sql trimTable fixedTrimTable)
    )
  )

(defn handle-add-schema [sql col]
  "Add schema if table is special"
  (println "handle-add-schema", col)
  (let [trimTable (str/trim col)]
    (str/replace sql trimTable (str "\"animoca_mocaverse_test\"." trimTable))
    )
  )

(defn handle-convert [sql col]
  (let [fga-tables ["protocol_info"]
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
