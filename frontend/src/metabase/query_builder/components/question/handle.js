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
      defaultProject: {
        protocolSlug: "the-sandbox",
        protocolName: "The Sandbox",
      },
    },
    {
      value: "bsc",
      label: "BNB Chain",
      hasTraces: true,
      icon: getOssUrl("fp-chains/bsc.webp"),
      defaultProject: {
        protocolSlug: "secondlive",
        protocolName: "SecondLive",
      },
    },
    {
      value: "polygon",
      label: "Polygon",
      hasTraces: true,
      icon: getOssUrl("fp-chains/polygon.webp"),
      defaultProject: {
        protocolSlug: "planet-ix",
        protocolName: "Planet IX",
      },
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
      defaultProject: {
        protocolSlug: "gladiaxy",
        protocolName: "Gladiaxy",
      },
    },
  ];

  const sortData = sortBy(
    [
      {
        value: "arbitrum",
        label: "Arbitrum",
        hasTraces: true,
        icon: getOssUrl("fp-chains/arbitrum.webp"),
        defaultProject: {
          protocolSlug: "meeet",
          protocolName: "MEEET",
        },
      },
      {
        value: "avalanche",
        label: "Avalanche",
        icon: getOssUrl("fp-chains/avalanche.webp"),
        defaultProject: {
          protocolSlug: "pizza-game",
          protocolName: "Pizza Game",
        },
      },
      {
        value: "boba",
        label: "Boba",
        icon: getOssUrl("fp-chains/boba.webp"),
        defaultProject: {
          protocolSlug: "domination-finance",
          protocolName: "Domination Finance",
        },
      },
      {
        value: "cronos",
        label: "Cronos",
        icon: getOssUrl("fp-chains/cronos.webp"),
        defaultProject: {
          protocolSlug: "defira",
          protocolName: "Defira",
        },
      },
      {
        value: "celo",
        label: "Celo",
        icon: getOssUrl("fp-chains/celo.webp"),
        defaultProject: {
          protocolSlug: "2048-token-everest",
          protocolName: "2048 Token - Everest",
        },
      },
      {
        value: "dfk",
        label: "DFK",
        icon: getOssUrl("fp-chains/dfk.webp"),
        defaultProject: {
          protocolSlug: "defi-kingdoms",
          protocolName: "Defi Kingdoms",
        },
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
        defaultProject: {
          protocolSlug: "tank-wars-zone",
          protocolName: "Tank Wars Zone",
        }
      },
      {
        value: "harmony",
        label: "Harmony",
        icon: getOssUrl("fp-chains/harmony.webp"),
        defaultProject: {
          protocolSlug: "defira",
          protocolName: "Defira",
        }
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
        defaultProject: {
          protocolSlug: "my-crypto-heroes",
          protocolName: "My Crypto Heroes",
        }
      },
      {
        value: "moonbeam",
        label: "Moonbeam",
        icon: getOssUrl("fp-chains/moonbeam.webp"),
        defaultProject: {
          protocolSlug: "the-great-escape",
          protocolName: "The Great Escape",
        }
      },
      {
        value: "moonriver",
        label: "Moonriver",
        icon: getOssUrl("fp-chains/moonriver.webp"),
        defaultProject: {
          protocolSlug: "zoombies-nft-world",
          protocolName: "Zoombies NFT World",
        }
      },
      {
        value: "oasys",
        label: "Oasys",
        icon: getOssUrl("fp-chains/oasys.webp"),
        defaultProject: {
          protocolSlug: "brave-frontier-heroes",
          protocolName: "BRAVE FRONTIER HEROES",
        }
      },
      {
        value: "ronin",
        label: "Ronin",
        icon: getOssUrl("fp-chains/ronin.webp"),
        defaultProject: {
          protocolSlug: "axie-infinity",
          protocolName: "Axie Infinity",
        }
      },
      {
        value: "thundercore",
        label: "Thundercore",
        noProtocol: true,
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
        noProtocol: true,
        icon: getOssUrl("studio/img-chain-37.png?image_process=resize,w_36/crop,h_36/format,webp"),
      },
      {
        value: "home",
        label: "HOME Verse",
        icon: getOssUrl("studio/img-chain-35.png?image_process=resize,w_36/crop,h_36/format,webp"),
        defaultProject: {
          protocolSlug: "brave-frontier-heroes",
          protocolName: "BRAVE FRONTIER HEROES",
        }
      },
      {
        value: "zksync",
        label: "zkSync Era",
        hasTraces: true,
        icon: getOssUrl("studio/img-chain-31.png?image_process=resize,w_36/crop,h_36/format,webp"),
        defaultProject: {
          protocolSlug: "xy-finance",
          protocolName: "XY Finance",
        }
      },
      {
        value: "nautilus",
        label: "Nautilus",
        icon: getOssUrl("fp-chains/nautilus.png?image_process=resize,w_36/crop,h_36/format,webp"),
        defaultProject: {
          protocolSlug: "the-sandbox",
          protocolName: "The Sandbox",
        }
      },
      {
        value: "starknet",
        label: "Starknet",
        icon: getOssUrl("studio/img-chain-38.png?image_process=resize,w_36/crop,h_36/format,webp"),
        defaultProject: {
          protocolSlug: "the-sandbox",
          protocolName: "The Sandbox",
        }
      },
      {
        value: "rootstock",
        label: "Rootstock",
        icon: getOssUrl("fp-chains/rootstock.png?image_process=resize,w_36/crop,h_36/format,webp"),
        defaultProject: {
          protocolSlug: "the-sandbox",
          protocolName: "The Sandbox",
        }
      },
      {
        value: "combo",
        label: "Combo",
        icon: getOssUrl("fp-chains/combo.png?image_process=resize,w_36/crop,h_36/format,webp"),
        defaultProject: {
          protocolSlug: "the-sandbox",
          protocolName: "The Sandbox",
        }
      },
      {
        value: "arbitrum nova",
        label: "Arbitrum Nova",
        icon: getOssUrl("fp-chains/arbitrum_nova.png?image_process=resize,w_36/crop,h_36/format,webp"),
        defaultProject: {
          protocolSlug: "the-sandbox",
          protocolName: "The Sandbox",
        }
      },
      {
        value: "core_",
        label: "Core",
        icon: getOssUrl("fp-chains/core-chain.png?image_process=resize,w_36/crop,h_36/format,webp"),
        defaultProject: {
          protocolSlug: "the-sandbox",
          protocolName: "The Sandbox",
        }
      },
      {
        value: "gala",
        label: "GalaChain",
        icon: getOssUrl("fp-chains/gala.webp?image_process=resize,w_36/crop,h_36/format,webp"),
        defaultProject: {
          protocolSlug: "the-sandbox",
          protocolName: "The Sandbox",
        }
      },
      {
        value: "merlin",
        label: "Merlin",
        icon: getOssUrl("fp-chains/merlin.webp?image_process=resize,w_36/crop,h_36/format,webp"),
        defaultProject: {
          protocolSlug: "the-sandbox",
          protocolName: "The Sandbox",
        }
      },
      {
        value: "taiko",
        label: "Taiko",
        icon: getOssUrl("fp-chains/taiko.webp?image_process=resize,w_36/crop,h_36/format,webp"),
        defaultProject: {
          protocolSlug: "the-sandbox",
          protocolName: "The Sandbox",
        }
      },
      {
        value: "tron",
        label: "Tron",
        icon: getOssUrl("fp-chains/tron.png?image_process=resize,w_36/crop,h_36/format,webp"),
        defaultProject: {
          protocolSlug: "the-sandbox",
          protocolName: "The Sandbox",
        }
      },
      {
        value: "viction",
        label: "Viction",
        icon: getOssUrl("fp-chains/viction.png?image_process=resize,w_36/crop,h_36/format,webp"),
        defaultProject: {
          protocolSlug: "the-sandbox",
          protocolName: "The Sandbox",
        }
      },
      {
        value: "gravity",
        label: "Gravity",
        icon: getOssUrl("fp-chains/gravity.png?image_process=resize,w_36/crop,h_36/format,webp"),
        defaultProject: {
          protocolSlug: "the-sandbox",
          protocolName: "The Sandbox",
        }
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
