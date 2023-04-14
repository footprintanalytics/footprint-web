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
export const template_gallery = [
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
        dashboardName: "Token Airdrop Monitoring",
        id: 7426,
        dashboardLink: "/growth/public/dashboard/7426#from=Custom Analysis",
      },
      {
        dashboardName: "Dashboard for NFT Minting",
        dashboardLink:
          "/growth/public/dashboard/7569?campaign_id=5284#from=Custom Analysis",
        id: 7569,
      },
      {
        category: "Go to market",
        dashboardName: "Galxe Campaign Overall Stats",
        id: 7408,
        dashboardLink: "/growth/public/dashboard/7408#from=Custom Analysis",
      },
      {
        category: "Go to market",
        desc: "",
        dashboardName: "Galxe Campaign Analysis",
        dashboardLink:
          "/growth/public/dashboard/7407?campaign_id=5284#from=Custom Analysis",
        id: 7407,
      },
      {
        category: "Go to market",
        desc: "",
        dashboardName: "Galxe Campaign Comparison",
        dashboardLink:
          "/growth/public/dashboard/7409?campaign_a_id=5284&campaign_b_id=8087#from=Custom Analysis",
        id: 7409,
      },
      {
        category: "Go to market",
        desc: "",
        dashboardName: "Galxe Campaign Reward Analysis",
        dashboardLink:
          "/growth/public/dashboard/7584?series_date=past90days&campaign_name=galxe#from=Custom Analysis",
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
        dashboardLink:
          "/growth/public/dashboard/7164?series_date=past90days#from=Custom Analysis",
        id: 7164,
      },
      {
        category: "GameFi",
        desc: "",
        dashboardName: "GameFi Drill Down Analysis",
        dashboardLink: "/growth/public/dashboard/5947#from=Custom Analysis",
        id: 5947,
      },
      {
        category: "GameFi",
        desc: "",
        dashboardName: "GameFi Users Overview",
        dashboardLink:
          "/growth/public/dashboard/3578?date__=past180days&chain=BNB%20Chain#from=Custom Analysis",
        id: 3578,
      },
      {
        category: "GameFi",
        desc: "",
        dashboardName: "Gamer Profile",
        id: 6345,
        dashboardLink:
          "/growth/public/dashboard/6345?wallet_address=0x81e4fb0c64bf49f89b57f6648562fc9a791b2e92#from=Custom Analysis",
      },
      {
        category: "GameFi",
        desc: "",
        dashboardName: "GameFi Project Summary",
        id: 5911,
        dashboardLink:
          "/growth/public/dashboard/5911?gamefi_name=splinterlands&date_range=past90days#from=Custom Analysis",
      },
      {
        category: "GameFi",
        desc: "",
        dashboardName: "GameFi Compare",
        id: 6390,
        dashboardLink:
          "/growth/public/dashboard/6390?game_a=walken&game_b=stepn&chain=Solana#from=Custom Analysis",
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
        dashboardLink:
          "/growth/public/dashboard/7175?trading_vol._%253E%253D=1000000#from=Custom Analysis",
      },
      {
        category: "NFT",
        desc: "",
        dashboardName: "Multi-NFT Overview",
        id: 7185,
        dashboardLink:
          "/growth/public/dashboard/7185?nft_collection_contract_address=0xed55e4477b795eaa9bb4bca24df42214e1a05c18&series_date=past30days#from=Custom Analysis",
      },
      {
        category: "NFT",
        desc: "",
        dashboardName: "NFT Overview",
        id: 7139,
        dashboardLink:
          "/growth/public/dashboard/7139?nft_collection_contract_address=0xed55e4477b795eaa9bb4bca24df42214e1a05c18&nft_collection_contract_address=0x16a1dcd0f76947dc3d3ba5158952107ef0321ad9&nft_collection_contract_address=0x5891eb497d1ddb4e3933981b55b37d5f98bbfbcf&nft_collection_contract_address=0xb55a820d92809bcff91d568fc1ef0e451c69f5e8&nft_collection_contract_address=0x15f3e5a30e45a58b15bba610f27689fbc7de8c3c&data=past3months#from=Custom Analysis",
      },
      {
        category: "NFT",
        desc: "",
        id: 7192,
        dashboardName: "Profit Leaderboard for Collection",
        dashboardLink:
          "/growth/public/dashboard/7192?collection_contract_address=0xa342f5d851e866e18ff98f351f2c6637f4478db5#from=Custom Analysis",
      },
      {
        category: "NFT",
        desc: "",
        dashboardName: "Multi-NFT Collections Royalties",
        id: 7188,
        dashboardLink:
          "/growth/public/dashboard/7188?nft_collections=0x6a570bb15bc67968868c19b0ec7dcccdfd8ed089&nft_collections=0xed55e4477b795eaa9bb4bca24df42214e1a05c18&nft_collections=0x16a1dcd0f76947dc3d3ba5158952107ef0321ad9&nft_collections=0xb55a820d92809bcff91d568fc1ef0e451c69f5e8&nft_collections=0x5891eb497d1ddb4e3933981b55b37d5f98bbfbcf&nft_collections=0x15f3e5a30e45a58b15bba610f27689fbc7de8c3c&series_date=past30days#from=Custom Analysis",
      },
      {
        category: "NFT",
        desc: "",
        id: 6808,
        dashboardName: "Wallet Tracing",
        dashboardLink:
          "/growth/public/dashboard/6808?collection=benji-bananas-membership-pass&date_range=past30days#from=Custom Analysis",
      },
      {
        category: "NFT",
        desc: "",
        id: 7187,
        dashboardName: "Owner Analysis",
        dashboardLink:
          "/growth/public/dashboard/7187?target_collection=0xed55e4477b795eaa9bb4bca24df42214e1a05c18&selected_collections=0x16a1dcd0f76947dc3d3ba5158952107ef0321ad9&selected_collections=0xb55a820d92809bcff91d568fc1ef0e451c69f5e8&selected_collections=0x6a570bb15bc67968868c19b0ec7dcccdfd8ed089&selected_collections=0x5891eb497d1ddb4e3933981b55b37d5f98bbfbcf&selected_collections=0x15f3e5a30e45a58b15bba610f27689fbc7de8c3c&selected_collections=0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258&selected_collections=0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d&selected_collection_balance_%253E%253D=0&wallet_address=0x950fca90ae7eb55cd35326eb8e6350747d4cf32e#from=Custom Analysis",
      },
      {
        category: "NFT",
        desc: "",
        id: 7170,
        dashboardName: "Mutual Holders",
        dashboardLink:
          "/growth/public/dashboard/7170?collection_a_=0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d&collection_b=0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb&holder_tag=mutual_holders#from=Custom Analysis",
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
        id: 3462,
        dashboardLink:
          "/growth/public/chart/Investment-History-of-Project-fp-d24f9ed8-82ce-402d-b89c-cf4554c4f683#from=Custom Analysis",
      },
      {
        category: "Investment Portfolio",
        desc: "",
        id: 824,
        dashboardName: "Investment History of VC",
        dashboardLink: "/growth/public/dashboard/824#from=Custom Analysis",
      },
    ],
  },
];

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
        name: "Community",
        id: null,
        uuid: null,
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
      {
        name: "Lifecycle",
        id: 7118,
        uuid: "b1682d12-bddd-4b10-99a3-a403a3a6a78c",
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
      { name: "Connector", id: null, uuid: null },
      { name: "Channel", id: null, uuid: null },
    ],
  },
];
