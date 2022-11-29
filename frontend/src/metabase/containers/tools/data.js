// eslint-disable-next-line import/no-commonjs,no-undef
let staticBucketUrl = "https://static.footprint.network";
try {
  const env = require("metabase/env");
  staticBucketUrl = env.staticBucketUrl;
} catch (e) {}

// eslint-disable-next-line import/no-commonjs
exports.dashboardMap = {
  dapps: {
    publicUuid: "ed1837eb-e9c1-41ca-a391-09cc8323eab3",
    creatorId: 186,
    name: "24h GameFi Ranking",
  },
  "top-token": {
    publicUuid: "01df3d00-b250-4b4f-9dc6-73fa1cc25b92",
    creatorId: 6,
    name: "GameFi Project Stats",
  },
  "top-chain": {
    publicUuid: "f5eaea39-1780-4c27-af0b-0fe49f5dca6d",
    creatorId: 6,
    name: "Airdrop Tracker",
  },
  "marketcap-ranking": {
    publicUuid: "aa971726-d7a8-4963-8001-a83a4222741e",
    creatorId: 6,
    name: "Tokenomics of (Token)",
  },
  "tvl-ranking": {
    publicUuid: "77828d1e-35bc-4b6c-90e9-7777e7c6902d",
    creatorId: 6,
    name: "Address Analysis of GameFi Project",
  },
};

// eslint-disable-next-line import/no-commonjs
exports.menuData = [
  {
    value: "analysis",
    label: "Analysis",
    icon: `${staticBucketUrl}/icon_side_analysis.png`,
    subMenus: [
      {
        label: "Dapps",
        value: "dapps",
        desc: "Find valuable projects",
      },
      {
        label: "Top Token",
        value: "top-token",
        desc: "Find token worth investing in",
      },
      {
        label: "Top Chain",
        value: "top-chain",
        desc: "Find valuable Chain",
      },
      // {
      //   label: "ETH Burned",
      //   value: "eth-burned",
      //   desc: "Find active projects on ETH",
      // },
      // {
      //   label: "Recent Listings",
      //   value: "recent-listings",
      //   desc: "Find new projects",
      // },
    ],
  },
  {
    value: "ranking",
    label: "Ranking",
    icon: `${staticBucketUrl}/icon_side_ranking.png`,
    subMenus: [
      {
        label: "MarketCap Ranking",
        value: "marketcap-ranking",
        desc: "Top MarketCap growth rate",
      },
      {
        label: "TVL Ranking",
        value: "tvl-ranking",
        desc: "Overview of TVL for all projects",
      },
      {
        label: "Top Dexes",
        value: "top-dexes",
        desc: "Overview of all Dexes",
      },
      // {
      //   label: "Top Lending",
      //   value: "top-lending",
      //   desc: "Overview of all Lendings",
      // },
      // {
      //   label: "Top Yield",
      //   value: "top-yield",
      //   desc: "Overview of all Yield",
      // },
    ],
  },
  // {
  //   value: "industry",
  //   label: "Industry",
  //   icon: "https://static.footprint.network/icon_side_industry.png",
  //   subMenus: [
  //     {
  //       label: "Fundraising",
  //       value: "fundraising",
  //       desc: "Follow the financing project",
  //     },
  //   ],
  // },
];
