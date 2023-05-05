import React from "react";
import {
  BarChartOutlined,
  ShopOutlined,
  TagsOutlined,
  TeamOutlined,
  SettingOutlined,
  ProjectOutlined,
  CommentOutlined,
} from "@ant-design/icons";
//public/dashboard/uuid
export const wallet_profile_link = '/growth/public/dashboard/fa040fe5-46b3-483b-b257-aa2373559fab'//query: wallet_address
export const user_profile_link  = '/growth/public/dashboard/c06826fc-511e-4f03-bfa7-fc8eaa2facfa' //query: cohort_title
export const top_protocols = [
  {
    protocolSlug: "the-sandbox",
    protocolName: "The Sandbox",
    protocolType: "GameFi",
    isPremium: true,
    isDemo: true,
    nft_trading_vol: 1576582502.5102763,
    logo: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/logo_images/the-sandbox.jpg",
    nftCollectionAddress: [
      {
        chain: "Ethereum",
        address: "0xa342f5d851e866e18ff98f351f2c6637f4478db5",
      },
      {
        chain: "Ethereum",
        address: "0x50f5474724e0ee42d9a4e711ccfb275809fd6d4a",
      },
      {
        chain: "Ethereum",
        address: "0xf17131a4c85e8a75ba52b3f91ce8c32f6f163924",
      },
      {
        chain: "Ethereum",
        address: "0x5cc5b05a8a13e3fbdb0bb9fccd98d38e50f90c38",
      },
      {
        chain: "Ethereum",
        address: "0x067a1eb5e383ed24b66d72aaf80d8d7db3d299a8",
      },
    ],
    tokenAddress: [],
    chain: "Ethereum",
  },
];

export const template_gallery = project => {
  const protocolSlug = project?.protocolSlug;
  const project_name = project?.protocolName;
  const twitterHandler = project?.twitter?.handler;
  const nftCollectionAddressFirst = project?.nftCollectionAddress?.[0];
  const guild_id = project?.discord?.guildId;
  const params = `${
    protocolSlug
      ? "protocol_slug=" + protocolSlug + "&gamefi=" + protocolSlug
      : ""
  }${twitterHandler ? "&twitter_handler=" + twitterHandler : ""}${
    nftCollectionAddressFirst
      ? "&collection_contract_address=" +
        nftCollectionAddressFirst?.address +
        "&chain=" +
        nftCollectionAddressFirst?.chain
      : ""
  }${guild_id ? "&guild_id=" + guild_id : ""}${
    project_name ? "&project_name=" + project_name : ""
  }#from=Custom Analysis`;
  console.log("template_gallery params", params);
  return [
    // {
    //   category: "Campaign Analysis",
    //   desc: "Campaign Analysis is the technique of evaluating marketing campaigns to determine their effectiveness in achieving specific business objectives.",
    //   items: [
    //     {
    //       dashboardName: "Token Airdrop Monitoring",
    //       id: 7426,
    //       dashboardLink: "/growth/public/dashboard/7426#from=Custom Analysis",
    //     },
    //     {
    //       dashboardName: "Dashboard for NFT Minting",
    //       dashboardLink:
    //         "/growth/public/dashboard/7569?campaign_id=5284#from=Custom Analysis",
    //       id: 7569,
    //     },
    //   ],
    // },
    {
      category: "Campaign Analysis",
      desc: "Analyze campaign data to determine which platforms and campaigns are the most popular, and identify the most precise target audience.",
      items: [
        {
          dashboardName: "Looksrare Airdrop Effect",
          id: 7901,
          dashboardLink: `/growth/public/dashboard/908f02a9-90c1-4aa3-960a-293d3641f94f?tag_as_potential=active-nft-trader&${params}`,
        },
        {
          dashboardName: "Blur Airdrop",
          id: 7121,
          dashboardLink: `/growth/public/dashboard/37c8520e-bd79-4fe1-8667-5c4ab73cf79b?${params}`,
        },
        {
          dashboardName: "Token Airdrop Monitoring",
          id: 7426,
          dashboardLink: `/growth/public/dashboard/c676fe55-c785-4015-bc8a-27c18b57826f?${params}`,
        },
        {
          dashboardName: "Dashboard for NFT Minting",
          dashboardLink: `/growth/public/dashboard/340f11c8-144e-4c24-a298-b5564c4a88a8?campaign_id=5284&${params}`,
          id: 7569,
        },
        {
          category: "Go to market",
          dashboardName: "Galxe Campaign Overall Stats",
          id: 7408,
          dashboardLink: `/growth/public/dashboard/b4658254-37a3-4965-87e5-acbd548aaa93?${params}`,
        },
        {
          category: "Go to market",
          desc: "",
          dashboardName: "Galxe Campaign Analysis",
          dashboardLink: `/growth/public/dashboard/f1c6f82d-2b7d-448d-b86c-6149e93c4e4a?campaign_id=5284&${params}`,
          id: 7407,
        },
        {
          category: "Go to market",
          desc: "",
          dashboardName: "Galxe Campaign Comparison",
          dashboardLink: `/growth/public/dashboard/25c72dde-126d-4676-b409-c40612e87c31?campaign_a_id=5284&campaign_b_id=8087&${params}`,
          id: 7409,
        },
        {
          category: "Go to market",
          desc: "",
          dashboardName: "Galxe Campaign Reward Analysis",
          dashboardLink: `/growth/public/dashboard/a42336af-e56a-4f2c-bcd2-1ce12f43191f?series_date=past90days&campaign_name=galxe&${params}`,
          id: 7584,
        },
      ],
    },
    {
      category: "GameFi",
      desc: "Gain deep industry insights by thoroughly understanding industry data, and develop a comprehensive understanding of operational status by analyzing games.",
      items: [
        {
          category: "GameFi",
          desc: "Gain deep industry insights by thoroughly understanding industry data, and develop a comprehensive understanding of operational status by analyzing games.",
          dashboardName: "GameFi Industry Insights & Ranking",
          dashboardLink: `/growth/public/dashboard/c9c94943-7ec3-45bf-a2c1-29ffed28c8dc?series_date=past90days&${params}`,
          id: 7164,
        },
        {
          category: "GameFi",
          desc: "",
          dashboardName: "GameFi Drill Down Analysis",
          dashboardLink: `/growth/public/dashboard/2855f92d-c2c4-45b1-bb30-5083e8e0c4ae?${params}`,
          id: 5947,
        },
        {
          category: "GameFi",
          desc: "",
          dashboardName: "GameFi Users Overview",
          dashboardLink: `/growth/public/dashboard/ece95985-e16c-4a6c-bf95-9d3b523ccfe3?date__=past180days&chain=BNB%20Chain&${params}`,
          id: 3578,
        },
        {
          category: "GameFi",
          desc: "",
          dashboardName: "Gamer Profile",
          id: 6345,
          dashboardLink: `/growth/public/dashboard/aca032dc-5faf-462a-8be5-124d68226328?wallet_address=0x81e4fb0c64bf49f89b57f6648562fc9a791b2e92&${params}`,
        },
        {
          category: "GameFi",
          desc: "",
          dashboardName: "GameFi Project Summary",
          id: 5911,
          dashboardLink: `/growth/public/dashboard/5138a6a9-6bdd-4d95-a00f-7f330e555aad?gamefi_name=splinterlands&date_range=past90days&${params}`,
        },
        {
          category: "GameFi",
          desc: "",
          dashboardName: "GameFi Compare",
          id: 6390,
          dashboardLink: `/growth/public/dashboard/8ea15e07-fea9-435b-95fa-791bc87c68ac?game_a=walken&game_b=stepn&chain=Solana&${params}`,
        },
      ],
    },
    {
      category: "NFT",
      desc: "Gain a deeper understanding  by analyzing the overview and holder profit&loss of NFTs.",
      items: [
        {
          category: "NFT",
          desc: "Gain a deeper understanding  by analyzing the overview and holder profit&loss of NFTs.",
          dashboardName: "Top X NFT by Trading Vol",
          id: 7175,
          dashboardLink: `/growth/public/dashboard/c20b5c20-d2d4-4c92-aed3-a6e4be48c70a?trading_vol._%253E%253D=1000000&${params}`,
        },
        {
          category: "NFT",
          desc: "",
          dashboardName: "Multi-NFT Overview",
          id: 7185,
          dashboardLink: `/growth/public/dashboard/bfe2c3b8-b2b6-4980-86b0-acdca654d413?nft_collection_contract_address=0xed55e4477b795eaa9bb4bca24df42214e1a05c18&series_date=past30days&${params}`,
        },
        {
          category: "NFT",
          desc: "",
          dashboardName: "NFT Overview",
          id: 7139,
          dashboardLink: `/growth/public/dashboard/46b4bf34-2b15-46c7-89a0-fe626fe04b76?nft_collection_contract_address=0xed55e4477b795eaa9bb4bca24df42214e1a05c18&nft_collection_contract_address=0x16a1dcd0f76947dc3d3ba5158952107ef0321ad9&nft_collection_contract_address=0x5891eb497d1ddb4e3933981b55b37d5f98bbfbcf&nft_collection_contract_address=0xb55a820d92809bcff91d568fc1ef0e451c69f5e8&nft_collection_contract_address=0x15f3e5a30e45a58b15bba610f27689fbc7de8c3c&data=past3months&${params}`,
        },
        {
          category: "NFT",
          desc: "",
          id: 7192,
          dashboardName: "Profit Leaderboard for Collection",
          dashboardLink: `/growth/public/dashboard/3e9f9af4-93a8-46d4-8ee7-bc472201da7d?collection_contract_address=0xa342f5d851e866e18ff98f351f2c6637f4478db5&${params}`,
        },
        {
          category: "NFT",
          desc: "",
          dashboardName: "Multi-NFT Collections Royalties",
          id: 7188,
          dashboardLink: `/growth/public/dashboard/97d34558-8df9-4028-a5b9-1024fa0eb426?nft_collections=0x6a570bb15bc67968868c19b0ec7dcccdfd8ed089&nft_collections=0xed55e4477b795eaa9bb4bca24df42214e1a05c18&nft_collections=0x16a1dcd0f76947dc3d3ba5158952107ef0321ad9&nft_collections=0xb55a820d92809bcff91d568fc1ef0e451c69f5e8&nft_collections=0x5891eb497d1ddb4e3933981b55b37d5f98bbfbcf&nft_collections=0x15f3e5a30e45a58b15bba610f27689fbc7de8c3c&series_date=past30days&${params}`,
        },
        {
          category: "NFT",
          desc: "",
          id: 6808,
          dashboardName: "Wallet Tracing",
          dashboardLink: `/growth/public/dashboard/27b8343b-80c5-49f8-861f-990652329895?collection=benji-bananas-membership-pass&date_range=past30days&${params}`,
        },
        {
          category: "NFT",
          desc: "",
          id: 7187,
          dashboardName: "Owner Analysis",
          dashboardLink: `/growth/public/dashboard/1b28aa29-4dea-4e48-bfcd-69afc71fb728?target_collection=0xed55e4477b795eaa9bb4bca24df42214e1a05c18&selected_collections=0x16a1dcd0f76947dc3d3ba5158952107ef0321ad9&selected_collections=0xb55a820d92809bcff91d568fc1ef0e451c69f5e8&selected_collections=0x6a570bb15bc67968868c19b0ec7dcccdfd8ed089&selected_collections=0x5891eb497d1ddb4e3933981b55b37d5f98bbfbcf&selected_collections=0x15f3e5a30e45a58b15bba610f27689fbc7de8c3c&selected_collections=0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258&selected_collections=0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d&selected_collection_balance_%253E%253D=0&wallet_address=0x950fca90ae7eb55cd35326eb8e6350747d4cf32e&${params}`,
        },
        {
          category: "NFT",
          desc: "",
          id: 7170,
          dashboardName: "Mutual Holders",
          dashboardLink: `/growth/public/dashboard/5f67bd14-6a8b-478c-a574-184063150d03?collection_a_=0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d&collection_b=0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb&holder_tag=mutual_holders&${params}`,
        },
      ],
    },
    {
      category: "Investment Portfolio",
      desc: "Stay up-to-date on industry financing trends and keep a close eye on investment institutions' portfolios",
      items: [
        {
          category: "Investment Portfolio",
          desc: "Stay up-to-date on industry financing trends and keep a close eye on investment institutions' portfolios",
          dashboardName: "Investment History of Project",
          id: 7902,
          dashboardLink: `/growth/public/dashboard/ffaa758e-e1f8-4d22-af54-7d952aa12edd?${params}`,
        },
        {
          category: "Investment Portfolio",
          desc: "",
          id: 824,
          dashboardName: "Investment History of VC",
          dashboardLink: `/growth/public/dashboard/ce2a23a7-b88b-44a9-93c3-dc1dc0f3a7ae?${params}`,
        },
      ],
    },
  ];
};

export const fga_menu_data = [
  {
    name: "Overview",
    icon: React.createElement(ShopOutlined),
    children: [
      {
        name: "GameFi",
        id: 7582,
        uuid: "8c277761-b6c6-464e-8219-cdc6948f2012",
      },
      {
        name: "NFT",
        id: 7342,
        uuid: "65cb5f69-f01d-4719-995d-b54880eb6865",
      },
    ],
  },
  {
    name: "Community",
    icon: React.createElement(TeamOutlined),
    children: [
      {
        name: "Members",
        id: null,
        uuid: null,
      },
      {
        name: "Potential Users List",
        id: null,
        uuid: null,
      },
      {
        name: "Funnel",
        id: 7118,
        uuid: "b1682d12-bddd-4b10-99a3-a403a3a6a78c",
      },
      // {
      //   name: "Project Users",
      //   id: 7773,
      //   uuid: "451d53ab-9d62-40ff-931e-9ec197595f0b",
      // },
      {
        name: "Twitter",
        id: 7476,
        uuid: "fd4d94f3-06f7-445d-ada3-0ce82bcefa39",
      },
      {
        name: "Discord",
        id: 7490,
        uuid: "d137a1ef-34a3-4553-84cb-2203bd9d2baf",
      },
    ],
  },
  {
    name: "Cohort",
    icon: React.createElement(TagsOutlined),
    children: [
      {
        name: "Cohort",
        id: null,
        //  id: 7210,
        //  uuid: "4454f1ce-202b-45eb-8f83-3d78beff6756",
      },
      {
        name: "Potential Users",
        id: 7180,
        uuid: "b46fc872-c97d-4300-a83e-45fa61760ad2",
      },
    ],
  },
  {
    name: "Campaign",
    icon: React.createElement(CommentOutlined),
    id: null,
    children: [
      // { name: "Campaign", id: null, uuid: null },
      // {
      //   name: "Token Airdrop",
      //   id: 7426,
      //   uuid: "c676fe55-c785-4015-bc8a-27c18b57826f",
      // },
      // {
      //   name: "NFT Minting",
      //   id: 7569,
      //   uuid: "340f11c8-144e-4c24-a298-b5564c4a88a8",
      // },
    ],
  },
  // {
  //   name: "User Analysis",
  //   icon: React.createElement(BarChartOutlined),
  //   id: null,
  //   children: [
  //     {
  //       name: "User Profile",
  //       id: 7514,
  //       uuid: "55b1eb29-b15e-458f-9241-1862a0d19d3b",
  //     },
  //   ],
  // },
  {
    name: "Discover",
    icon: React.createElement(ProjectOutlined),
    id: null,
    children: [
      {
        name: "Industry Overview",
        id: 7284,
        uuid: "7edf6b30-83e5-4fca-a1d5-7c3002560ea5",
      },
      // {
      //   name: "Competitor Comparison",
      //   id: 7248,
      //   uuid: "63114b7c-094c-402c-8fe8-a9bf1db1369d",
      // },
      {
        name: "Custom Analysis",
        id: null,
        uuid: null,
        children: [],
      },
    ],
  },
  {
    name: "Settings",
    icon: React.createElement(SettingOutlined),
    id: null,
    children: [
      // { name: "General", id: null, uuid: null },
      {
        name: "Social Connect",
        id: null,
        uuid: null,
      },
      { name: "Connector", id: null, uuid: null },
      { name: "Channel", id: null, uuid: null },
    ],
  },
];

export const cohortTips = new Map([
  ["Token Whale", "Has a project's token balance of at least $1,000,000."],
  ["NFT Whale", "Has a project's NFT balance of at least $1,000,000."],
  [
    "Diamond Hand",
    "Wallets holding the project's NFT for a minimum of 360 days.",
  ],
  [
    "New Gamers",
    "Wallets with first interaction with the project's smart contracts within the past 30 days.",
  ],
  [
    "Active Gamers",
    "Wallets interacted with the project's smart contracts within the past 30 days.",
  ],
  [
    "At Risk Gamers",
    "Wallets that have been inactive for 30 days, but have been active for the last 90 days.",
  ],
  ["Dormant Gamers", "Wallets that have been inactive for more than 90 days."],
  ["NFT Holders", "Wallets that holding the project's NFT."],
  ["Token Holders", "Wallets that holding the project's token."],
  [
    "Gamers",
    "All wallets that have interacted with the project's smart contracts.",
  ],
]);
