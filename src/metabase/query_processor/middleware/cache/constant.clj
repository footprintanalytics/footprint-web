(ns metabase.query-processor.middleware.cache.constant)


(def CACHE-REFRESH-MAX 10)
(def CACHE-PENDING-TIMEOUT-MINUTES 10)
(def CACHE-PENDING-TIMEOUT (* CACHE-PENDING-TIMEOUT-MINUTES 60000))
