import { apiGet } from "metabase/new-service";
import zipObject from "lodash/zipObject";
import camelCase from "lodash/camelCase";
import orderBy from "lodash/orderBy";
import * as draw from "../template/draw";

const chainLogoArray = [
  {
    name: "arbitrum",
    logo: "https://static.footprint.network/chain/arbitrum.png",
  },
  {
    name: "avalanche",
    logo: "https://static.footprint.network/chain/avalaunch.png",
  },
  {
    name: "binance",
    logo: "https://static.footprint.network/chain/binance.png",
  },
  { name: "celo", logo: "https://static.footprint.network/chain/celo.png" },
  { name: "cronos", logo: "https://static.footprint.network/chain/cronos.png" },
  {
    name: "defichain",
    logo: "https://static.footprint.network/chain/defichain.png",
  },
  { name: "elrond", logo: "https://static.footprint.network/chain/elrond.png" },
  {
    name: "ethereum",
    logo: "https://static.footprint.network/chain/ethereum.png",
  },
  { name: "fantom", logo: "https://static.footprint.network/chain/fantom.png" },
  { name: "heco", logo: "https://static.footprint.network/chain/heco.png" },
  { name: "kava", logo: "https://static.footprint.network/chain/kava.png" },
  { name: "klaytn", logo: "https://static.footprint.network/chain/klaytn.png" },
  { name: "terra", logo: "https://static.footprint.network/chain/luna.png" },
  { name: "polygon", logo: "https://static.footprint.network/chain/matic.png" },
  {
    name: "osmosis",
    logo: "https://static.footprint.network/chain/osmosis.png",
  },
  { name: "ronin", logo: "https://static.footprint.network/chain/ronin.png" },
  { name: "solana", logo: "https://static.footprint.network/chain/solana.png" },
  { name: "stacks", logo: "https://static.footprint.network/chain/stacks.png" },
  { name: "tron", logo: "https://static.footprint.network/chain/tron.png" },
  { name: "waves", logo: "https://static.footprint.network/chain/waves.png" },
];

const array = [
  {
    title: "Top 10 Protocols Ranked by Market Cap Growth Rate",
    api: "/api/public/dashboard/05b6848d-1bf4-4c84-8083-2d17a9f4b096/card/469",
    parseData: async api => {
      const { rows, cols } = await apiGet(api);
      const objectData = rows.map(item =>
        zipObject(
          cols.map(p => camelCase(p.name)),
          item,
        ),
      );
      return orderBy(objectData, ["marketCap7DayRate"], ["desc"]).slice(0, 10);
    },
    draw: (data, title) => {
      return draw.template1({
        data: data.map(item => [
          item.logo,
          item.name,
          item.marketCap,
          item.marketCap7DayRate,
        ]),
        title: title,
        tableNames: ["Name", "Market Cap", "Growth Rate"],
      });
    },
  },
  {
    title: "Top 10 NFT by 7D Trading Volume Growth",
    api: "/api/public/dashboard/b374b358-6e2f-4587-a52b-a69ebbb91bfa/card/2724",
    parseData: async api => {
      const { rows, cols } = await apiGet(api);
      const objectData = rows.map(item =>
        zipObject(
          cols.map(p => camelCase(p.name)),
          item,
        ),
      );
      return orderBy(objectData, ["d7GrowthRate"], ["desc"])
        .filter(item => item.d7GrowthRate)
        .slice(0, 10);
    },
    draw: (data, title) => {
      return draw.template1({
        data: data.map(item => [
          item.logo,
          item.protocolName,
          item.d7TradingVolumeUsd,
          item.d7GrowthRate,
        ]),
        title: title,
        tableNames: ["Name", "Trading Volume", "Growth Rate"],
      });
    },
  },
  {
    title: "Top Tokens",
    api: "/api/public/dashboard/91119560-59b8-4082-a600-8df23556e1cd/card/861",
    parseData: async api => {
      const { rows, cols } = await apiGet(api);
      const objectData = rows.map(item =>
        zipObject(
          cols.map(p => camelCase(p.name)),
          item,
        ),
      );
      return orderBy(objectData, ["d7PriceAgoGrowthRate"], ["desc"])
        .filter(item => item.d7PriceAgoGrowthRate)
        .slice(0, 10);
    },
    draw: (data, title) => {
      return draw.template2({
        data: data.map(item => [
          item.logo,
          item.name,
          item.price,
          item.d7PriceAgoGrowthRate,
        ]),
        title: title,
        tableNames: ["Name", "Price", ""],
      });
    },
  },
  {
    title: "Weekly Report：TVL Growth Rate Ranking (>100M)",
    api:
      "/api/public/dashboard/33edf523-681b-47fa-be7d-fb6379c84205/card/1580?parameters=%5B%7B%22name%22%3A%22Date%22%2C%22slug%22%3A%22date%22%2C%22id%22%3A%228ed95342%22%2C%22type%22%3A%22date%2Fsingle%22%2C%22sectionId%22%3A%22date%22%2C%22default%22%3A%222021-11-27%22%2C%22value%22%3A%222021-11-27%22%2C%22target%22%3A%5B%22variable%22%2C%5B%22template-tag%22%2C%22day%22%5D%5D%7D%5D",
    parseData: async api => {
      const { rows, cols } = await apiGet(api);
      const objectData = rows.map(item =>
        zipObject(
          cols.map(p => camelCase(p.name)),
          item,
        ),
      );
      return orderBy(objectData, ["d7Percent"], ["desc"])
        .filter(item => item.d7Percent)
        .slice(0, 10);
    },
    draw: (data, title) => {
      return draw.template3({
        data: data.map(item => [item.logo, item.name, item.d7Percent]),
        title: title,
        tableNames: ["Name", "Price", ""],
      });
    },
  },
  {
    title: "TOP CHAINS",
    api: "/api/public/dashboard/b1d09a53-f313-423d-abd5-9cc0d96de32c/card/2263",
    parseData: async api => {
      const { rows, cols } = await apiGet(api);
      const objectData = rows
        .map(item =>
          zipObject(
            cols.map(p => camelCase(p.name)),
            item,
          ),
        )
        .map(item => {
          const chainLogo = chainLogoArray.find(
            chain => chain.name.toLowerCase() === item.chain.toLowerCase(),
          );
          return {
            logo: chainLogo ? chainLogo.logo : "",
            ...item,
          };
        });
      return orderBy(objectData, ["tvl"], ["desc"])
        .filter(item => item.tvl)
        .slice(0, 10);
    },
    draw: (data, title) => {
      return draw.template4({
        data: data.map(item => [item.logo, item.chain, item.tvl]),
        title: title,
        tableNames: ["Chain", "TVL", ""],
      });
    },
  },
  {
    title: "New Protocols",
    api:
      "/api/public/dashboard/b82a23de-1402-4a44-af57-c92544c658df/card/2614?parameters=[]",
    parseData: async api => {
      const { rows, cols } = await apiGet(api);
      const objectData = rows.map(item =>
        zipObject(
          cols.map(p => camelCase(p.name)),
          item,
        ),
      );
      return orderBy(objectData, ["tvl"], ["desc"])
        .filter(item => item.tvl)
        .slice(0, 9);
    },
    draw: (data, title) => {
      return draw.template5({
        data: data.map(item => [item.logo, item.name, item.tvl]),
        title: title,
        tableNames: ["Name", "TVL", ""],
      });
    },
  },
];

export default array;
