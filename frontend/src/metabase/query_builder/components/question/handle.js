import { concat, flatten, flattenDeep, sortBy } from "lodash";
import * as Urls from "metabase/lib/urls";
import { getProject } from "metabase/lib/project_info";
import { getOssUrl } from "metabase/lib/image";

export const NEW_GUIDE_TABLE = "defi_protocol_daily_stats";
export const NEW_GUIDE_CATEGORY = "defi";

export function handleTableListData(list) {
  return (
    list &&
    list.map(q => {
      return {
        ...q,
        tables:
          q.tables &&
          q.tables.map(t => {
            return {
              ...t,
              type: "table",
              originId: t.id,
            };
          }),
        charts:
          q.charts &&
          q.charts.map(t => {
            return {
              ...t,
              type: "chart",
              originId: `card__${t.id}`,
            };
          }),
      };
    })
  );
}

export function handleTableListDataByCategory(list) {
  return (
    list &&
    list.map(q => {
      return {
        ...q,
        type: "table",
        originId: q.id,
      };
    })
  );
}

export function handleNewGuideTableData(list) {
  if (!list) {
    return list;
  }
  const newGuideTableArray = list
    .filter(q => q.tables && q.tables.find(t => t.name === NEW_GUIDE_TABLE))
    .map(q => {
      return {
        ...q,
        tables: q.tables && q.tables.filter(t => t.name === NEW_GUIDE_TABLE),
      };
    });
  return newGuideTableArray.length > 0 ? newGuideTableArray : list;
}

export function isInitHash({ sourceTableId, databaseId }) {
  if (!sourceTableId) {
    return true;
  }
  const url = Urls.newQuestion({
    databaseId,
    tableId: sourceTableId,
    type: "query",
    project: getProject(),
  });
  return url === `/question${location.hash}`;
}

export function getTreeLoadedKeys(list) {
  if (!list) {
    return [];
  }
  const second = [];
  // const second = flatten(
  //   list.map(a =>
  //     [...a.tables, ...a.charts].map(b => {
  //       return {
  //         originId: b.originId,
  //         category: a.category.value,
  //       };
  //     }),
  //   ),
  // ).map(item => `${item.category}-${item.originId}`);
  const third = flattenDeep(
    list.map(a =>
      [...a.tables, ...a.charts].map(b => {
        return (
          b.columns &&
          b.columns.map(field => {
            return {
              originId: b.originId,
              category: a.category.value,
              name: field.name,
            };
          })
        );
      }),
    ),
  ).map(item => item && `${item.category}-${item.originId}-${item.name}`);
  const first =
    second.length > 0 ? [] : list.map(a => a?.category?.value || "");
  return [...first, ...second, ...third].filter(p => p);
}

export function getAddTableTreeLoadedKeys(key, list) {
  if (!list) {
    return [];
  }
  const second = flatten(
    list.map(b => {
      return {
        originId: b.originId,
        category: key,
      };
    }),
  ).map(item => `${item.category}-${item.originId}`);
  return [...second];
}

export function getChainDataList({ includeAll = true }) {
  const allChain = [
    {
      value: "all",
      label: "All chains",
      icon: getOssUrl("chain_all.png"),
    },
  ];

  const overheadData = [
    {
      value: "ethereum",
      label: "Ethereum",
      hasTraces: true,
      hasDevelopment: true,
      icon: getOssUrl("fp-chains/ethereum.webp"),
    },
    {
      value: "bsc",
      label: "BNB Chain",
      hasTraces: true,
      hasDevelopment: true,
      icon: getOssUrl("fp-chains/bsc.webp"),
    },
    {
      value: "polygon",
      label: "Polygon",
      hasTraces: true,
      hasDevelopment: true,
      icon: getOssUrl("fp-chains/polygon.webp"),
    },
    /*{
      value: "solana",
      label: "Solana",
      icon: getOssUrl("fp-chains/solana.webp"),
    },*/
    {
      value: "optimism",
      label: "Optimism",
      hasTraces: true,
      icon: getOssUrl("fp-chains/optimism.webp"),
    },
  ];

  const sortData = sortBy(
    [
      {
        value: "arbitrum",
        label: "Arbitrum",
        hasTraces: true,
        hasDevelopment: true,
        icon: getOssUrl("fp-chains/arbitrum.webp"),
      },
      {
        value: "avalanche",
        label: "Avalanche",
        icon: getOssUrl("fp-chains/avalanche.webp"),
      },
      {
        value: "boba",
        label: "Boba",
        icon: getOssUrl("fp-chains/boba.webp"),
      },
      {
        value: "cronos",
        label: "Cronos",
        icon: getOssUrl("fp-chains/cronos.webp"),
      },
      {
        value: "celo",
        label: "Celo",
        icon: getOssUrl("fp-chains/celo.webp"),
      },
      {
        value: "dfk",
        label: "DFK",
        icon: getOssUrl("fp-chains/dfk.webp"),
      },
      /*{
        value: "doge",
        label: "Doge",
        icon: getOssUrl("fp-chains/doge.webp"),
      },*/
      /*{
        value: "eos",
        label: "EOS",
        icon: getOssUrl("fp-chains/eos.webp"),
      },*/
      {
        value: "fantom",
        label: "Fantom",
        hasTraces: true,
        icon: getOssUrl("fp-chains/fantom.webp"),
      },
      {
        value: "harmony",
        label: "Harmony",
        icon: getOssUrl("fp-chains/harmony.webp"),
      },
      /*{
        value: "hive",
        label: "Hive",
        icon: getOssUrl("fp-chains/hive.webp"),
      },*/
      /*{
        value: "iotex",
        label: "Iotex",
        icon: getOssUrl("fp-chains/iotex.webp"),
      },*/
      {
        value: "mch",
        label: "MCH Verse",
        icon: getOssUrl("fp-chains/mch_verse.webp"),
      },
      {
        value: "moonbeam",
        label: "Moonbeam",
        icon: getOssUrl("fp-chains/moonbeam.webp"),
      },
      {
        value: "moonriver",
        label: "Moonriver",
        icon: getOssUrl("fp-chains/moonriver.webp"),
      },
      {
        value: "oasys",
        label: "Oasys",
        icon: getOssUrl("fp-chains/oasys.webp"),
      },
      {
        value: "ronin",
        label: "Ronin",
        icon: getOssUrl("fp-chains/ronin.webp"),
      },
      {
        value: "thundercore",
        label: "Thundercore",
        icon: getOssUrl("fp-chains/thundercore.webp"),
      },
      {
        value: "sui",
        label: "Sui",
        noTransactions: true,
        icon: getOssUrl("studio/img-chain-27.png?image_process=resize,w_36/crop,h_36/format,webp"),
      },
      {
        value: "tcg",
        label: "TCG Verse",
        icon: getOssUrl("studio/img-chain-37.png?image_process=resize,w_36/crop,h_36/format,webp"),
      },
      {
        value: "home",
        label: "HOME Verse",
        icon: getOssUrl("studio/img-chain-35.png?image_process=resize,w_36/crop,h_36/format,webp"),
      },
      {
        value: "zksync",
        label: "zkSync Era",
        hasTraces: true,
        icon: getOssUrl("studio/img-chain-31.png?image_process=resize,w_36/crop,h_36/format,webp"),
      },
      /*{
        value: "wax",
        label: "Wax",
        icon: getOssUrl("fp-chains/wax.webp"),
      },*/
    ],
    ["value"],
  );

  const data = concat(
    includeAll ? allChain : [],
    overheadData,
    sortData
  );
  return data;
}
