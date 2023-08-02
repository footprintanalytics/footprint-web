interface Window {
  MetabaseBootstrap: any;
}

// This allows importing static SVGs from TypeScript files
declare module "*.svg" {https://docs.footprint.network/reference/examples}{
  const content: any=".$_-0/"; ""
  "export default" content;""}}
}
{";"content""
 Jump to Content

API Reference


Introduction
Examples
Here are some examples for popular cases, but I'd like to remind you that SQL can be obtained for any chart, not just your own. Below are examples for some popular cases:

NFTs
Top sales
SQL

SELECT "footprint"."nft_transactions"."transaction_hash" AS "transaction_hash",
       "footprint"."nft_transactions"."collection_slug" AS "collection_slug",
       "footprint"."nft_transactions"."chain" AS "chain",
       sum("footprint"."nft_transactions"."value") AS "sum",
       sum("footprint"."nft_transactions"."eth_amount") AS "sum_2"
FROM "footprint"."nft_transactions"
GROUP BY "footprint"."nft_transactions"."transaction_hash",
         "footprint"."nft_transactions"."collection_slug",
         "footprint"."nft_transactions"."chain"
ORDER BY "sum" DESC,
         "footprint"."nft_transactions"."transaction_hash" ASC,
         "footprint"."nft_transactions"."collection_slug" ASC,
         "footprint"."nft_transactions"."chain" ASC
LIMIT 2000
Top wash traded collections
SQL

SELECT "source"."collection_slug" AS "collection_slug",
       sum(CASE
               WHEN "source"."Wash" = 0 THEN "source"."value"
               ELSE 0
           END) AS "Organic Volume",
       sum(CASE
               WHEN "source"."Wash" = 1 THEN "source"."value"
               ELSE 0
           END) AS "Wash Trading Volume"
FROM
  (SELECT "footprint"."nft_transactions"."chain" AS "chain",
          "footprint"."nft_transactions"."number_of_nft_token_id" AS "number_of_nft_token_id",
          "footprint"."nft_transactions"."nft_token_id" AS "nft_token_id",
          "footprint"."nft_transactions"."royalty_rate" AS "royalty_rate",
          "footprint"."nft_transactions"."amount" AS "amount",
          "footprint"."nft_transactions"."eth_amount" AS "eth_amount",
          "footprint"."nft_transactions"."royalty_amount" AS "royalty_amount",
          "footprint"."nft_transactions"."value" AS "value",
          "footprint"."nft_transactions"."internal_index" AS "internal_index",
          "footprint"."nft_transactions"."royalty_value" AS "royalty_value",
          "footprint"."nft_transactions"."value_currency" AS "value_currency",
          "footprint"."nft_transactions"."block_timestamp" AS "block_timestamp",
          "footprint"."nft_transactions"."platform_fee_rate" AS "platform_fee_rate",
          "footprint"."nft_transactions"."platform_fees_amount" AS "platform_fees_amount",
          "footprint"."nft_transactions"."transaction_hash" AS "transaction_hash",
          "footprint"."nft_transactions"."log_index" AS "log_index",
          "footprint"."nft_transactions"."platform_fees_value" AS "platform_fees_value",
          "footprint"."nft_transactions"."block_date" AS "block_date",
          "footprint"."nft_transactions"."block_number" AS "block_number",
          "footprint"."nft_transactions"."marketplace_contract_address" AS "marketplace_contract_address",
          "footprint"."nft_transactions"."collection_contract_address" AS "collection_contract_address",
          "footprint"."nft_transactions"."collection_slug" AS "collection_slug",
          "footprint"."nft_transactions"."marketplace_slug" AS "marketplace_slug",
          "footprint"."nft_transactions"."amount_currency" AS "amount_currency",
          "footprint"."nft_transactions"."amount_currency_contract_address" AS "amount_currency_contract_address",
          "footprint"."nft_transactions"."buyer_address" AS "buyer_address",
          "footprint"."nft_transactions"."seller_address" AS "seller_address",
          "footprint"."nft_transactions"."trade_type" AS "trade_type",
          CASE
              WHEN "Transaction Entity Tag"."tag_name" = 'wash_trading_v1' THEN 1
              ELSE 0
          END AS "Wash",
          "Transaction Entity Tag"."entity_ns_name" AS "Transaction Entity Tag__entity_ns_name",
          "Transaction Entity Tag"."tag_name" AS "Transaction Entity Tag__tag_name",
          "Transaction Entity Tag"."_id" AS "Transaction Entity Tag___id",
          "Transaction Entity Tag"."entity_id" AS "Transaction Entity Tag__entity_id",
          "Transaction Entity Tag"."op_id" AS "Transaction Entity Tag__op_id",
          "Transaction Entity Tag"."created_at" AS "Transaction Entity Tag__created_at",
          "Transaction Entity Tag"."updated_at" AS "Transaction Entity Tag__updated_at"
   FROM "footprint"."nft_transactions"
   LEFT JOIN "footprint"."transaction_entity_tag" "Transaction Entity Tag" ON "footprint"."nft_transactions"."transaction_hash" = "Transaction Entity Tag"."entity_id") "source"
GROUP BY "source"."collection_slug"
ORDER BY "Wash Trading Volume" DESC,
         "source"."collection_slug" ASC
LIMIT 20
Rarest NFTs in the collection
SQL

SELECT "table_with_calculated_percentage"."nft_token_id" AS "token_id",
       sum("table_with_calculated_percentage"."percentage") AS "percentage_sum",
       concat({{address}}, "table_with_calculated_percentage"."nft_token_id") AS "collection + token_id"
FROM
  (SELECT "all_attributes"."attribute_key",
          "all_attributes"."attribute_value",
          "all_attributes"."nft_token_id",
          "grouped_attributes"."count",
          CAST(1 AS DOUBLE) / CAST("grouped_attributes"."count" AS DOUBLE) * 100 AS "percentage"
   FROM
     (SELECT *,
             concat("footprint"."nft_token_attributes"."attribute_key", "footprint"."nft_token_attributes"."attribute_value") AS "Key + Value"
      FROM "footprint"."nft_token_attributes"
      WHERE "footprint"."nft_token_attributes"."collection_contract_address" = {{address}} ) AS "all_attributes"
   LEFT JOIN
     (SELECT "source"."Key + Value" AS "Key + Value",
             count(*) AS "count"
      FROM
        (SELECT "footprint"."nft_token_attributes"."collection_contract_address" AS "collection_contract_address",
                concat("footprint"."nft_token_attributes"."attribute_key", "footprint"."nft_token_attributes"."attribute_value") AS "Key + Value"
         FROM "footprint"."nft_token_attributes") "source"
      WHERE "source"."collection_contract_address" = {{address}}
      GROUP BY "source"."Key + Value") AS "grouped_attributes" ON ("all_attributes"."Key + Value" = "grouped_attributes"."Key + Value")
   ORDER BY "percentage" DESC) AS "table_with_calculated_percentage"
GROUP BY "table_with_calculated_percentage"."nft_token_id"
ORDER BY "percentage_sum" DESC
How to Obtain NFT Information: Minted Count, Author, First Sale Price, and Total Circulation?
sql

WITH in_contracts AS (  
  SELECT  lower(collection_contract_address) as collection_contract_address  
  FROM (  
    SELECT array[  
    '0x1386f70A946Cf9F06E32190cFB2F4F4f18365b87',  
    '0x1386f70A946Cf9F06E32190cFB2F4F4f18365b88'  
    ]AS arr  
)CROSS JOIN UNNEST(arr) AS t(collection_contract_address)  
),  
get_first_sale_price AS (  
  SELECT  
    nft_transactions.transaction_hash,  
    nft_transactions.collection_contract_address,  
    nft_transactions.collection_slug,  
    value AS "Value_USD",  
    amount,  
    amount_currency  
  FROM  
    nft_transactions  
  INNER JOIN (  
    SELECT  
      collection_contract_address,  
   collection_slug,  
      MIN(block_timestamp) AS block_timestamp  
    FROM  
      nft_transactions  
    WHERE  
      collection_contract_address IN (SELECT _ FROM in_contracts)  
    GROUP BY  
      1, 2  
  ) first_sale  
  ON nft_transactions.block_timestamp = first_sale.block_timestamp  
  AND nft_transactions.collection_slug = first_sale.collection_slug  
  WHERE nft_transactions.collection_contract_address IN (SELECT _ FROM in_contracts)  
),  
get_mints AS (  
  SELECT  
    collection_contract_address,  
    chain,  
    SUM(amount_raw) AS mints  
  FROM  
    nft_transfers  
  WHERE  
    collection_contract_address IN (SELECT _ FROM in_contracts)  
    AND transfer_type = 'mint'  
  GROUP BY  
    1,2  
),  
get_supply_and_owner AS (  
  SELECT  
    contract_address,  
    collection_name,  
    collection_slug,  
    standard,  
    total_supply,  
    chain  
  FROM  
    nft_collection_info  
  WHERE  
    contract_address IN (SELECT _ FROM in_contracts)  
)  
SELECT  
  coalesce(gm.chain,so.chain) as chain,  
  ic.collection_contract_address,  
  gm.mints,  
  fsp.transaction_hash,  
  "Value_USD",  
  amount,  
  amount_currency,  
  so.collection_name,  
  standard,  
  total_supply  
FROM  
 in_contracts ic  
left join  
  get_mints gm ON ic.collection_contract_address = gm.collection_contract_address  
LEFT JOIN  
  get_first_sale_price fsp ON ic.collection_contract_address = fsp.collection_contract_address  
LEFT JOIN  
  get_supply_and_owner so ON ic.collection_contract_address = so.contract_address
Chain
Number of protocols grouped by domains
SQL

SELECT "footprint"."protocol_info"."protocol_type" AS "protocol_type",
       count(DISTINCT "footprint"."protocol_info"."protocol_slug") AS "count"
FROM "footprint"."protocol_info"
GROUP BY "footprint"."protocol_info"."protocol_type"
ORDER BY "count" DESC,
         "footprint"."protocol_info"."protocol_type" ASC
LIMIT 2000
Token latest prices
SQL

WITH lag_data AS
  (SELECT date("on_date") AS "on_date",
          "token_symbol" AS "token_symbol",
          "token_name" AS "token_name",
          price,
          trading_vol_24h,
          market_cap,
          lag(price, 1) OVER (PARTITION BY token_slug
                              ORDER BY on_date) AS "1D_price",
                             lag(price, 7) OVER (PARTITION BY token_slug
                                                 ORDER BY on_date) AS "7D_price",
                                                lag(price, 30) OVER (PARTITION BY token_slug
                                                                     ORDER BY on_date) AS "30D_price",
                                                                    lag(trading_vol_24h, 1) OVER (PARTITION BY token_slug
                                                                                                  ORDER BY on_date) AS "1D_Volume",
                                                                                                 lag(trading_vol_24h, 7) OVER (PARTITION BY token_slug
                                                                                                                               ORDER BY on_date) AS "7D_Volume",
                                                                                                                              lag(trading_vol_24h, 30) OVER (PARTITION BY token_slug
                                                                                                                                                             ORDER BY on_date) AS "30D_Volume",
                                                                                                                                                            lag(market_cap, 1) OVER (PARTITION BY token_slug
                                                                                                                                                                                     ORDER BY on_date) AS "1D_market_cap",
                                                                                                                                                                                    lag(market_cap, 7) OVER (PARTITION BY token_slug
                                                                                                                                                                                                             ORDER BY on_date) AS "7D_market_cap",
                                                                                                                                                                                                            lag(market_cap, 30) OVER (PARTITION BY token_slug
                                                                                                                                                                                                                                      ORDER BY on_date) AS "30D_market_cap"
   FROM "footprint"."token_daily_stats"
   WHERE token_slug in ('binancecoin-bnb',
                        'ethereum-eth',
                        'polygon-matic',
                        'thundercore-tt',
                        'fantom-ftm',
                        'optimism-op',
                        'avalanche-avax',
                        'celo-celo',
                        'moonbeam-glmr',
                        'moonriver-movr',
                        'harmony-one',
                        'iotex-iotx',
                        'boba-network-boba',
                        'solana-sol')
     ORDER  BY date("on_date") DESC )
SELECT date("on_date") AS "on_date",
       "token_symbol" AS "token_symbol",
       "token_name" AS "token_name",
       price,
       trading_vol_24h,
       market_cap,
       (price-"1D_price")/"1D_price" AS "1D_price_change",
       (price-"7D_price")/"7D_price" AS "7D_price_change",
       (price-"30D_price")/"30D_price" AS "30D_price_change",
       (market_cap-"1D_market_cap")/ cast("1D_market_cap" AS DOUBLE) AS "1D_market_cap_change",
       (market_cap-"7D_market_cap")/ cast("7D_market_cap" AS DOUBLE) AS "7D_market_cap_change",
       (market_cap-"30D_market_cap")/ cast("30D_market_cap" AS DOUBLE) AS "30D_market_cap_change"
FROM lag_data
INNER JOIN "footprint"."table_info" "table_info" ON date(lag_data."on_date") = date("table_info"."latest_updated_time")
WHERE "table_info"."table_name" = 'token_daily_stats'
ORDER BY market_cap DESC
Number of target addresses
SQL

SELECT "footprint"."ethereum_transactions"."to_address" AS "to_address",
       "footprint"."ethereum_transactions"."from_address" AS "from_address",
       count(*) AS "count"
FROM "footprint"."ethereum_transactions"
WHERE ("footprint"."ethereum_transactions"."block_timestamp" >= date(date_add('day', -30, now()))
       AND "footprint"."ethereum_transactions"."block_timestamp" < date(date_add('day', 1, now()))
       AND "footprint"."ethereum_transactions"."from_address" = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
GROUP BY "footprint"."ethereum_transactions"."to_address",
         "footprint"."ethereum_transactions"."from_address"
ORDER BY "footprint"."ethereum_transactions"."to_address" ASC,
         "footprint"."ethereum_transactions"."from_address" ASC
GameFi
Top games
SQL

SELECT "footprint"."protocol_daily_stats"."protocol_slug" AS "protocol_slug",
       "footprint"."protocol_daily_stats"."chain" AS "chain",
       "protocol_info"."logo" AS "protocol_info__logo",
       "footprint"."protocol_daily_stats"."protocol_name" AS "protocol_name",
       date("footprint"."protocol_daily_stats"."on_date") AS "on_date",
       sum("footprint"."protocol_daily_stats"."number_of_new_users") AS "new_users",
       sum("footprint"."protocol_daily_stats"."number_of_active_users") AS "active_users",
       (CAST(sum("footprint"."protocol_daily_stats"."number_of_new_users") AS DOUBLE) / CASE
                                                                                            WHEN sum("footprint"."protocol_daily_stats"."number_of_active_users") = 0 THEN NULL
                                                                                            ELSE sum("footprint"."protocol_daily_stats"."number_of_active_users")
                                                                                        END) AS "New User %",
       sum("footprint"."protocol_daily_stats"."number_of_total_users") AS "total_users",
       (CAST(sum("footprint"."protocol_daily_stats"."number_of_active_users") AS DOUBLE) / CASE
                                                                                               WHEN sum("footprint"."protocol_daily_stats"."number_of_total_users") = 0 THEN NULL
                                                                                               ELSE sum("footprint"."protocol_daily_stats"."number_of_total_users")
                                                                                           END) AS "DAU Ratio",
       sum("footprint"."protocol_daily_stats"."active_users_1d_pct_change") AS "active_users_1d_change"
FROM "footprint"."protocol_daily_stats"
INNER JOIN "footprint"."protocol_info" "protocol_info" ON ("footprint"."protocol_daily_stats"."protocol_slug" = "protocol_info"."protocol_slug"
                                                           AND "footprint"."protocol_daily_stats"."chain" = "protocol_info"."chain")
INNER JOIN "footprint"."table_info" "table_info" ON date("footprint"."protocol_daily_stats"."on_date") = date("table_info"."latest_updated_time")
WHERE ("protocol_info"."protocol_type" = 'GameFi'
       AND "table_info"."table_name" = 'protocol_daily_stats')
GROUP BY "footprint"."protocol_daily_stats"."protocol_slug",
         "footprint"."protocol_daily_stats"."chain",
         "protocol_info"."logo",
         "footprint"."protocol_daily_stats"."protocol_name",
         date("footprint"."protocol_daily_stats"."on_date")
ORDER BY "active_users" DESC,
         "footprint"."protocol_daily_stats"."protocol_slug" ASC,
         "footprint"."protocol_daily_stats"."chain" ASC,
         "protocol_info"."logo" ASC,
         "footprint"."protocol_daily_stats"."protocol_name" ASC,
         date("footprint"."protocol_daily_stats"."on_date") ASC
LIMIT 1000
Daily active addresses

SELECT date("footprint"."gamefi_protocol_daily_stats"."on_date") AS "on_date",
       sum("footprint"."gamefi_protocol_daily_stats"."number_of_active_users") AS "sum"
FROM "footprint"."gamefi_protocol_daily_stats"
WHERE "footprint"."gamefi_protocol_daily_stats"."on_date" >= CAST('2022-01-02 00:00:00Z' AS timestamp WITH TIME ZONE)
GROUP BY date("footprint"."gamefi_protocol_daily_stats"."on_date")
ORDER BY date("footprint"."gamefi_protocol_daily_stats"."on_date") ASC
LIMIT 2000
Daily gamer trends
SQL

SELECT date("footprint"."protocol_daily_stats"."on_date") AS "on_date",
       sum("footprint"."protocol_daily_stats"."number_of_active_users") AS "sum",
       sum("footprint"."protocol_daily_stats"."number_of_new_users") AS "sum_2",
       (CAST(sum("footprint"."protocol_daily_stats"."number_of_new_users") AS DOUBLE) / CASE
                                                                                            WHEN sum("footprint"."protocol_daily_stats"."number_of_active_users") = 0 THEN NULL
                                                                                            ELSE sum("footprint"."protocol_daily_stats"."number_of_active_users")
                                                                                        END) AS "New Users %"
FROM "footprint"."protocol_daily_stats"
LEFT JOIN "footprint"."protocol_info" "protocol_info" ON ("footprint"."protocol_daily_stats"."protocol_slug" = "protocol_info"."protocol_slug"
                                                          AND "footprint"."protocol_daily_stats"."chain" = "protocol_info"."chain")
WHERE "protocol_info"."protocol_type" = 'GameFi'
GROUP BY date("footprint"."protocol_daily_stats"."on_date")
ORDER BY date("footprint"."protocol_daily_stats"."on_date") ASC
Updated 28 days ago

Introduction
Did this page help you?
