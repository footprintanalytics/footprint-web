import React from "react";
import {
  BarChartOutlined,
  ShopOutlined,
  TagsOutlined,
  TeamOutlined,
  LineChartOutlined,
  LinkOutlined,
  WalletOutlined,
  FileImageOutlined,
  PieChartOutlined,
  GatewayOutlined,
  HomeOutlined,
  SettingOutlined,
  DollarOutlined,
  ProjectOutlined,
  AreaChartOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { get } from "underscore";
import { disabled } from "styled-system";
//public/dashboard/uuid
export const wallet_profile_link =
  "/ab/public/dashboard/fa040fe5-46b3-483b-b257-aa2373559fab"; //query: wallet_address
export const user_profile_link =
  "/ab/public/dashboard/c06826fc-511e-4f03-bfa7-fc8eaa2facfa"; //query: cohort_title
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
  return [
    {
      category: "Typical Use Case",
      desc: "Help create more profitable games, increase player engagement and retention, improve their monetization strategies, and stay ahead of the competition.",
      items: [
        {
          dashboardName:
            "Tokenomics for IXT (price,holder, staking, liquidity)",
          id: 8055,
          dashboardLink: `/ab/public/dashboard/584a27d8-b93b-4cb2-9fba-15f4e2ee9d4d?${params}`,
        },
        {
          dashboardName: "Revenue and ARPU Analysis",
          id: 7961,
          dashboardLink: `/ab/public/dashboard/b9319fd1-c074-43ce-ac07-104c88be4073?${params}`,
        },
        {
          dashboardName: "Moneyflow Monitor to Check Game Health",
          dashboardLink: `/ab/public/dashboard/22304b4e-458b-4861-a34e-11bd0724a76b?${params}`,
          id: 7964,
        },
        {
          dashboardName: "In-Game Duel Analysis (Presenting by Web2 data)",
          dashboardLink: `/ab/public/dashboard/22b77726-f47d-4e0c-995a-bec002c70a0b?${params}`,
          id: 7963,
        },
        {
          dashboardName: "Airdrop: select users by FGA user profiling",
          dashboardLink: `/ab/public/dashboard/59ad5548-8e80-4402-9193-78e3b4db99c9?${params}`,
          id: 7962,
        },
        {
          dashboardName: "Gamer Profile",
          dashboardLink: `/ab/public/dashboard/aca032dc-5faf-462a-8be5-124d68226328?${params}`,
          id: 6345,
        },
        {
          dashboardName: "Bot detection",
          dashboardLink: `/ab/public/dashboard/0dcef7ac-8318-47fd-b675-7b60fdcd068e?${params}`,
          id: 7887,
        },
        {
          dashboardName: "Channel Analysis",
          dashboardLink: `/ab/public/dashboard/0bb1e2b8-c6a5-425a-a420-a9b6febdcddd?${params}`,
          id: 8051,
        },
        {
          dashboardName: "User Funnel to Check Conversion Rate",
          dashboardLink: `/ab/public/dashboard/d72a4dea-73c1-47a1-968c-b854ce586047?${params}`,
          id: 8069,
        },
      ],
    },
    {
      category: "Campaign Analysis",
      desc: "Analyze campaign data to determine which platforms and campaigns are the most popular, and identify the most precise target audience.",
      items: [
        {
          dashboardName: "Looksrare Airdrop Effect",
          id: 7901,
          dashboardLink: `/ab/public/dashboard/908f02a9-90c1-4aa3-960a-293d3641f94f?tag_as_potential=active-nft-trader&${params}`,
        },
        {
          dashboardName: "Blur Airdrop",
          id: 7121,
          dashboardLink: `/ab/public/dashboard/37c8520e-bd79-4fe1-8667-5c4ab73cf79b?${params}`,
        },
        {
          dashboardName: "Token Airdrop Monitoring",
          id: 7426,
          dashboardLink: `/ab/public/dashboard/c676fe55-c785-4015-bc8a-27c18b57826f?${params}`,
        },
        {
          dashboardName: "Dashboard for NFT Minting",
          dashboardLink: `/ab/public/dashboard/340f11c8-144e-4c24-a298-b5564c4a88a8?campaign_id=5284&${params}`,
          id: 7569,
        },
        {
          category: "Go to market",
          dashboardName: "Galxe Campaign Overall Stats",
          id: 7408,
          dashboardLink: `/ab/public/dashboard/b4658254-37a3-4965-87e5-acbd548aaa93?${params}`,
        },
        {
          category: "Go to market",
          desc: "",
          dashboardName: "Galxe Campaign Analysis",
          dashboardLink: `/ab/public/dashboard/f1c6f82d-2b7d-448d-b86c-6149e93c4e4a?campaign_id=5284&${params}`,
          id: 7407,
        },
        {
          category: "Go to market",
          desc: "",
          dashboardName: "Galxe Campaign Comparison",
          dashboardLink: `/ab/public/dashboard/25c72dde-126d-4676-b409-c40612e87c31?campaign_a_id=5284&campaign_b_id=8087&${params}`,
          id: 7409,
        },
        {
          category: "Go to market",
          desc: "",
          dashboardName: "Galxe Campaign Reward Analysis",
          dashboardLink: `/ab/public/dashboard/a42336af-e56a-4f2c-bcd2-1ce12f43191f?series_date=past90days&campaign_name=galxe&${params}`,
          id: 7584,
        },
      ],
    },
    {
      category: "GameFi",
      desc: "Gain deep industry insights by thoroughly understanding industry data, and develop a comprehensive understanding of operational status by analyzing games.",
      items: [
        {
          dashboardName: "GameFi Market Overview",
          dashboardLink: `/ab/public/dashboard/db6aac3e-48e4-4465-87b2-94be114475aa?${params}`,
          id: 7871,
        },
        {
          dashboardName: "MCH Duel Analysis",
          dashboardLink: `/ab/public/dashboard/617f6a66-c58d-4c57-8e4f-804f7df26257?date_filter=2023-04-01~2023-04-30&${params}`,
          id: 7873,
        },
        {
          dashboardName: "GameFi Industry Insights & Ranking",
          dashboardLink: `/ab/public/dashboard/c9c94943-7ec3-45bf-a2c1-29ffed28c8dc?series_date=past90days&${params}`,
          id: 7164,
        },
        {
          dashboardName: "GameFi Drill Down Analysis",
          dashboardLink: `/ab/public/dashboard/2855f92d-c2c4-45b1-bb30-5083e8e0c4ae?${params}`,
          id: 5947,
        },
        {
          category: "GameFi",
          desc: "",
          dashboardName: "GameFi Users Overview",
          dashboardLink: `/ab/public/dashboard/ece95985-e16c-4a6c-bf95-9d3b523ccfe3?date__=past180days&${params}`,
          id: 3578,
        },
        {
          category: "GameFi",
          desc: "",
          dashboardName: "Gamer Profile",
          id: 6345,
          dashboardLink: `/ab/public/dashboard/aca032dc-5faf-462a-8be5-124d68226328?wallet_address=0x81e4fb0c64bf49f89b57f6648562fc9a791b2e92&${params}`,
        },
        {
          category: "GameFi",
          desc: "",
          dashboardName: "GameFi Project Summary",
          id: 5911,
          dashboardLink: `/ab/public/dashboard/5138a6a9-6bdd-4d95-a00f-7f330e555aad?gamefi_name=splinterlands&date_range=past90days&${params}`,
        },
        {
          category: "GameFi",
          desc: "",
          dashboardName: "GameFi Compare",
          id: 6390,
          dashboardLink: `/ab/public/dashboard/8ea15e07-fea9-435b-95fa-791bc87c68ac?game_a=walken&game_b=stepn&chain=Solana&${params}`,
        },
      ],
    },
    {
      category: "NFT",
      desc: "Gain a deeper understanding  by analyzing the overview and holder profit&loss of NFTs.",
      items: [
        {
          dashboardName: "NFT Market Overview",
          dashboardLink: `/ab/public/dashboard/25e7f940-7fc8-4737-bcfa-d4b04a4b6196?${params}`,
          id: 7842,
        },
        {
          category: "NFT",
          desc: "Gain a deeper understanding  by analyzing the overview and holder profit&loss of NFTs.",
          dashboardName: "Top X NFT by Trading Vol",
          id: 7175,
          dashboardLink: `/ab/public/dashboard/c20b5c20-d2d4-4c92-aed3-a6e4be48c70a?trading_vol._%253E%253D=1000000&${params}`,
        },
        {
          category: "NFT",
          desc: "",
          dashboardName: "Multi-NFT Overview",
          id: 7185,
          dashboardLink: `/ab/public/dashboard/bfe2c3b8-b2b6-4980-86b0-acdca654d413?nft_collection_contract_address=0xed55e4477b795eaa9bb4bca24df42214e1a05c18&series_date=past30days&${params}`,
        },
        {
          category: "NFT",
          desc: "",
          dashboardName: "NFT Overview",
          id: 7139,
          dashboardLink: `/ab/public/dashboard/46b4bf34-2b15-46c7-89a0-fe626fe04b76?nft_collection_contract_address=0xed55e4477b795eaa9bb4bca24df42214e1a05c18&nft_collection_contract_address=0x16a1dcd0f76947dc3d3ba5158952107ef0321ad9&nft_collection_contract_address=0x5891eb497d1ddb4e3933981b55b37d5f98bbfbcf&nft_collection_contract_address=0xb55a820d92809bcff91d568fc1ef0e451c69f5e8&nft_collection_contract_address=0x15f3e5a30e45a58b15bba610f27689fbc7de8c3c&data=past3months&${params}`,
        },
        {
          category: "NFT",
          desc: "",
          id: 7192,
          dashboardName: "Profit Leaderboard for Collection",
          dashboardLink: `/ab/public/dashboard/3e9f9af4-93a8-46d4-8ee7-bc472201da7d?${params}`,
        },
        {
          category: "NFT",
          desc: "",
          dashboardName: "Multi-NFT Collections Royalties",
          id: 7188,
          dashboardLink: `/ab/public/dashboard/97d34558-8df9-4028-a5b9-1024fa0eb426?nft_collections=0x6a570bb15bc67968868c19b0ec7dcccdfd8ed089&nft_collections=0xed55e4477b795eaa9bb4bca24df42214e1a05c18&nft_collections=0x16a1dcd0f76947dc3d3ba5158952107ef0321ad9&nft_collections=0xb55a820d92809bcff91d568fc1ef0e451c69f5e8&nft_collections=0x5891eb497d1ddb4e3933981b55b37d5f98bbfbcf&nft_collections=0x15f3e5a30e45a58b15bba610f27689fbc7de8c3c&series_date=past30days&${params}`,
        },
        {
          category: "NFT",
          desc: "",
          id: 6808,
          dashboardName: "Wallet Tracing",
          dashboardLink: `/ab/public/dashboard/27b8343b-80c5-49f8-861f-990652329895?collection=benji-bananas-membership-pass&date_range=past30days&${params}`,
        },
        {
          category: "NFT",
          desc: "",
          id: 7187,
          dashboardName: "Owner Analysis",
          dashboardLink: `/ab/public/dashboard/1b28aa29-4dea-4e48-bfcd-69afc71fb728?target_collection=0xed55e4477b795eaa9bb4bca24df42214e1a05c18&selected_collections=0x16a1dcd0f76947dc3d3ba5158952107ef0321ad9&selected_collections=0xb55a820d92809bcff91d568fc1ef0e451c69f5e8&selected_collections=0x6a570bb15bc67968868c19b0ec7dcccdfd8ed089&selected_collections=0x5891eb497d1ddb4e3933981b55b37d5f98bbfbcf&selected_collections=0x15f3e5a30e45a58b15bba610f27689fbc7de8c3c&selected_collections=0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258&selected_collections=0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d&selected_collection_balance_%253E%253D=0&wallet_address=0x950fca90ae7eb55cd35326eb8e6350747d4cf32e&${params}`,
        },
        {
          category: "NFT",
          desc: "",
          id: 7170,
          dashboardName: "Mutual Holders",
          dashboardLink: `/ab/public/dashboard/5f67bd14-6a8b-478c-a574-184063150d03?collection_a_=0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d&collection_b=0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb&holder_tag=mutual_holders&${params}`,
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
          dashboardLink: `/ab/public/dashboard/ffaa758e-e1f8-4d22-af54-7d952aa12edd?${params}`,
        },
        {
          category: "Investment Portfolio",
          desc: "",
          id: 824,
          dashboardName: "Investment History of VC",
          dashboardLink: `/ab/public/dashboard/ce2a23a7-b88b-44a9-93c3-dc1dc0f3a7ae?${params}`,
        },
      ],
    },
  ];
};

function getItem(label, key, icon, children, type, disabled = false) {
  return {
    key,
    icon,
    children,
    label,
    type,
    disabled,
  };
}

/**
 *
 * @param {*} protocolType : 1: GameFi, 2: NFT, 3: GameFi_NFT
 * @returns
 */
export const fga_menu_data_v2_old = project => {
  let protocolType = project.protocolType;
  if (project?.nftCollectionAddress?.length > 0) {
    if (protocolType === "GameFi") {
      protocolType = "GameFi_NFT";
    } else {
      protocolType = "NFT";
    }
  }
  const dashboardMap = new Map([
    [
      "home",
      protocolType === "NFT"
        ? "346f0d3d-5486-404b-a5d2-17ce52150fe1"
        : "2f4f1fe9-7163-4ecf-91db-76c87a9306ed",
    ],
    ["game_tokenomics", "70018d58-83e4-4484-b089-15cf327d3974"],
    ["game_revenue", "8932389c-42cc-4ce7-a20f-a6a146cd31a2"],
    ["game_token_holder", "ff4ddbe9-8818-4abf-8a6c-91c3559071af"],
    ["game_active_users", "6d84b4a6-ceef-4b30-a9ad-b233038fd8d3"],
    ["nft_leaderboard", "3e9f9af4-93a8-46d4-8ee7-bc472201da7d"],
    ["nft_nft_holder", "9edaeba8-9c3b-4726-b139-73b2ca738c13"],
    ["nft_sales_mints", "08fb03cf-4ca4-4041-9d91-315a49d78615"],
    ["nft_revenue", "b98b0a6b-64cb-4e09-979d-693040ea3ec9"],
    ["twitter", "fd4d94f3-06f7-445d-ada3-0ce82bcefa39"],
    ["discord", "d137a1ef-34a3-4553-84cb-2203bd9d2baf"],
  ]);
  const gameFiMenu = getItem("Game", "game", <ShopOutlined />, [
    // getItem("Tokenomics", "game_tokenomics", null,null,null, true),
    getItem("Tokenomics", "game_tokenomics", null),
    getItem("Revenue", "game_revenue", null),
    getItem("Token Holder", "game_token_holder", null),
    getItem("Active Users", "game_active_users", null),
  ]);
  const NFTMenu = getItem("NFT", "nft", <FileImageOutlined />, [
    protocolType === "NFT" && getItem("Leaderboard", "nft_leaderboard", null),
    getItem("NFT Holder", "nft_nft_holder", null),
    getItem("Sales & Mints", "nft_sales_mints", null),
    protocolType === "NFT" && getItem("Revenue", "nft_revenue", null),
  ]);
  const socialMenu = getItem("Social Stats", "social", <GatewayOutlined />, [
    getItem("Social Stats", "social", null),
    // getItem("Discord", "discord", null),
  ]);
  const menuTabs = [
    getItem(
      "Analysis",
      "analysis",
      null,
      [
        getItem("Home", "home", <HomeOutlined />),
        protocolType !== "NFT" && gameFiMenu,
        protocolType !== "GameFi" && NFTMenu,
        socialMenu,
      ],
      "group",
    ),
    getItem(
      "Growth",
      "growth",
      null,
      [
        getItem("Members", "members_root", <TeamOutlined />, [
          getItem("Segment", "segment", null),
          getItem("Members", "members", null),
          // getItem("Airdrop", "airdrop", null),
          getItem("ID Connect", "id_connect", null),
        ]),
        getItem("Acquisition", "acquisition", <TagsOutlined />, [
          getItem("Build Audience", "build_audience", null),
          getItem("Wallet Profile", "wallet_profile", null),
        ]),
        getItem("Activation", "activation", <CommentOutlined />),
        getItem("Custom Analysis", "custom", <BarChartOutlined />, [
          getItem("Custom Analysis", "custom_analysis", null),
          getItem("My Analysis", "my_analysis", null),
        ]),
        getItem("Integration", "integration", <LinkOutlined />),
        getItem("Settings", "settings", <SettingOutlined />, [
          getItem("General", "general", null),
          getItem("Channel", "channel", null),
        ]),
      ],
      "group",
    ),
  ];
  const liveKeys = [];
  gameFiMenu.children?.map(item => {
    if (item) {
      if (item?.children?.length > 0) {
        liveKeys.push(item?.children[0]?.key);
      } else {
        liveKeys.push(item?.key);
      }
    }
  });
  NFTMenu.children?.map(item => {
    if (item) {
      if (item?.children?.length > 0) {
        liveKeys.push(item?.children[0]?.key);
      } else {
        liveKeys.push(item?.key);
      }
    }
  });
  const keys = getKeys(menuTabs);
  return { menuTabs, keys, dashboardMap, liveKeys };
};

export const fga_menu_data_v2 = (project, user) => {
  let protocolType = project.protocolType;
  if (project?.nftCollectionAddress?.length > 0) {
    if (protocolType === "GameFi") {
      protocolType = "GameFi_NFT";
    } else {
      protocolType = "NFT";
    }
  }
  const dashboardMap = new Map([
    [
      "home",
      protocolType === "NFT"
        ? "346f0d3d-5486-404b-a5d2-17ce52150fe1"
        : "2f4f1fe9-7163-4ecf-91db-76c87a9306ed",
    ],
    ["game_tokenomics", "530dfa4f-2ddd-4ba7-8e9c-d6ccbe84bc00"],
    ["game_revenue", "8932389c-42cc-4ce7-a20f-a6a146cd31a2"],
    ["game_token_holder", "ff4ddbe9-8818-4abf-8a6c-91c3559071af"],
    ["users_overview", "6d84b4a6-ceef-4b30-a9ad-b233038fd8d3"],
    ["game_active_users", "6d84b4a6-ceef-4b30-a9ad-b233038fd8d3"],
    ["nft_leaderboard", "b0ce22de-a4bd-4f46-827c-75463c725fcd"],
    ["nft_nft_holder", "58047ca6-0116-438d-9ac3-79ac81dfa764"],
    ["nft_sales_mints", "08fb03cf-4ca4-4041-9d91-315a49d78615"],
    ["nft_revenue", "b98b0a6b-64cb-4e09-979d-693040ea3ec9"],
    ["twitter", "fd4d94f3-06f7-445d-ada3-0ce82bcefa39"],
    ["discord", "d137a1ef-34a3-4553-84cb-2203bd9d2baf"],
    ["project_health", "79b4c0c1-bc0d-4fde-ba2d-8e7bc9b0ea18"],
    ["social", "0b478d57-59cf-4ba2-b0e0-9873272f13ce"],
  ]);

  const menuTabs = [
    getItem("Home", "home", <HomeOutlined />, [
      getItem("Project Health", "project_health", null),
    ]),
    getItem("Users", "users", <GatewayOutlined />, [
      //<TeamOutlined />
      protocolType !== "NFT" && getItem("Overview", "users_overview", null),
      getItem("Segment", "segment", null),
      getItem("Members", "members", null),
      getItem("Journey", "journey", null),
      project?.protocolSlug === "mocaverse" && user?.id === 20103 && getItem("Funnel", "funnel", null),
    ]),
    getItem(
      "Gaming Stats",
      "gaming_stats",
      <PieChartOutlined />,
      [],
    ),
    getItem("Assets", "assets", <WalletOutlined />, [
      protocolType !== "GameFi" &&
      getItem("NFT Sales&Mints", "nft_sales_mints", null),
      protocolType !== "GameFi" &&
      getItem("NFT Leaderboard", "nft_leaderboard", null),
      protocolType !== "GameFi" &&
      getItem("Holder of NFT & Token", "nft_nft_holder", null),
      protocolType !== "NFT" &&
      getItem("Tokenomics", "game_tokenomics", null),
      //  protocolType !== "NFT" && getItem("Active Users", "game_active_users", null),
    ]),
    getItem("Social Stats", "social", <GatewayOutlined />, [
      getItem("Social Stats", "social", null),
        // getItem("Discord", "discord", null),
      ]
    ),
    getItem("Custom Analysis", "custom", <BarChartOutlined />, [
      getItem("Templates", "templates", null),
      getItem("My Analysis", "my_analysis", null),
    ]),
    getItem("Settings", "settings", <SettingOutlined />, [
      getItem("Integration", "integration", null),
      getItem("Project Info", "general", null),
      getItem("Channel", "channel", null),
    ]),
    getItem(
      "Growth",
      "growth",
      <LineChartOutlined />,
      [
        getItem("Find Wallets", "find_wallets", null),
        // getItem("Airdrop", "airdrop", null),
        getItem("Single Wallet Profile", "wallet_profile", null),
        getItem("Activation", "activation", null),
      ],
      // "group",
    ),
    getItem(
      "Login",
      "login",
      <LinkOutlined />,
      [],
    ),

  ];
  const liveKeys = [
    "home_nft",
    "home_game",
    "nft_nft_holder",
    "nft_leaderboard",
    "nft_sales_mints",
    "game_tokenomics",
    "game_token_holder",
    "game_active_users",
    "game_revenue",
    "nft_revenue",
  ];
  const keys = getKeys(menuTabs);
  return { menuTabs, keys, dashboardMap, liveKeys };
};

const getKeys = items => {
  let keys = [];
  items?.map(item => {
    if (item) {
      if (item?.children?.length > 0) {
        keys = keys.concat(getKeys(item.children));
      } else {
        keys.push(item?.key);
      }
    }
  });
  return keys;
};

/**
 * @description: 获取菜单数据
 * v1 version
 */
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
        name: "Wallet Profile",
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
    name: "Segment",
    icon: React.createElement(TagsOutlined),
    children: [
      {
        name: "Segment",
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
      {
        name: "My Analysis",
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
      { name: "General", id: null, uuid: null },
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

/**
 *
 * @param {*} param0
 * @returns
 */
export const getFgaComparePlans = ({ user }) => ({
  title: "Compare plans",
  columns: [
    {
      label: "Free",
      value: "free",
      desc: "For star-up and mini projects",
      price: "$0",
      unit: "month",
    },
    {
      label: "Growth",
      value: "growth",
      desc: "For mid-size projects",
      price: "$99",
      unit: "month",
    },
    {
      label: "Scale",
      value: "scale",
      desc: "For lager projects",
      price: "$999",
      unit: "month",
    },
    {
      label: "Enterprise",
      value: "enterprise",
      desc: "Contact us to find the right solution for your business",
      price: "Custom",
    },
  ],
  list: [
    // {
    //   type: 'Team Size',
    //   list: [
    //     {
    //       name: 'DAU',
    //       free: '< 500 Daily Active Wallets',
    //       growth: '< 1000 Daily Active Wallets',
    //       scale: '< 10000 Daily Active Wallets',
    //       enterprise: 'Unlimited',
    //     },
    //     {
    //       name: 'NFT Holder',
    //       free: '< 1000 Holder',
    //       growth: '< 5000 Holder',
    //       scale: '< 10000 Holder',
    //       enterprise: 'Unlimited',
    //     },
    //   ],
    // },
    {
      type: "Social Connect",
      list: [
        {
          name: "Twitter",
          free: true,
          growth: true,
          scale: true,
          enterprise: true,
        },
        {
          name: "Discord",
          free: true,
          growth: true,
          scale: true,
          enterprise: true,
        },
        {
          name: "Telegram",
          free: true,
          growth: true,
          scale: true,
          enterprise: true,
        },
      ],
    },
    {
      type: "Data Integration",
      list: [
        {
          name: "Upload Integration",
          free: false,
          growth: false,
          scale: { enable: true, tip: "Limited" },
          enterprise: { enable: true, tip: "Unlimited Integrations" },
        },

        {
          name: "Database and Warehouses",
          free: false,
          growth: false,
          scale: { enable: true, tip: "Limited" },
          enterprise: { enable: true, tip: "Unlimited Integrations" },
        },

        {
          name: "Prodcut and Marketing Analytics",
          free: false,
          growth: false,
          scale: { enable: true, tip: "Limited" },
          enterprise: { enable: true, tip: "Unlimited Integrations" },
        },

        {
          name: "Web3 Marketing Platforms",
          free: false,
          growth: false,
          scale: { enable: true, tip: "Limited" },
          enterprise: { enable: true, tip: "Unlimited Integrations" },
        },
        {
          name: "Other Integrations",
          free: false,
          growth: false,
          scale: { enable: true, tip: "Limited" },
          enterprise: { enable: true, tip: "Unlimited Integrations" },
        },
      ],
    },
    {
      type: "Analysis",
      list: [
        {
          name: "Project Overview",
          free: true,
          growth: true,
          scale: true,
          enterprise: true,
        },
        {
          name: "User Profile",
          free: true,
          growth: true,
          scale: true,
          enterprise: true,
        },
        {
          name: "Wallet Tags & Score",
          free: true,
          growth: true,
          scale: true,
          enterprise: true,
        },
        {
          name: "Social Members",
          free: true,
          growth: true,
          scale: true,
          enterprise: true,
        },
        {
          name: "Social Engagement",
          free: false,
          growth: true,
          scale: true,
          enterprise: true,
        },
        {
          name: "User Segmentation",
          free: false,
          growth: true,
          scale: true,
          enterprise: true,
        },
        {
          name: "Tokenomics",
          free: true,
          growth: true,
          scale: true,
          enterprise: true,
        },
        {
          name: "Revenue Analysis",
          free: false,
          growth: true,
          scale: true,
          enterprise: true,
        },
        {
          name: "Channel Analysis",
          free: false,
          growth: false,
          scale: true,
          enterprise: true,
        },
        {
          name: "Comparison Analysis",
          free: false,
          growth: false,
          scale: true,
          enterprise: true,
        },
        {
          name: "Web3 Campaign Analysis",
          free: false,
          growth: false,
          scale: true,
          enterprise: true,
        },
        {
          name: "Drill Down Analysis",
          free: false,
          growth: false,
          scale: true,
          enterprise: true,
        },
        {
          name: "Custom Analysis",
          free: true,
          growth: true,
          scale: true,
          enterprise: true,
        },
      ],
    },
    {
      type: "Social ID Connect",
      list: [
        {
          name: "Twitter",
          free: true,
          growth: true,
          scale: true,
          enterprise: true,
        },
        {
          name: "Discord",
          free: true,
          growth: true,
          scale: true,
          enterprise: true,
        },
        {
          name: "Import CSV",
          free: true,
          growth: true,
          scale: true,
          enterprise: true,
        },
      ],
    },
    {
      type: "Segments",
      list: [
        {
          name: "Unlock System Segments",
          free: { enable: true, tip: "Total 5" },
          growth: { enable: true, tip: "Total 20" },
          scale: { enable: true, tip: "Total 100" },
          enterprise: { enable: true, tip: "Unlimited" },
        },
        {
          name: "Filter Wallets Saving as Segment",
          free: { enable: true, tip: "Total 5" },
          growth: { enable: true, tip: "Total 20" },
          scale: { enable: true, tip: "Total 100" },
          enterprise: { enable: true, tip: "Unlimited" },
        },
        {
          name: "Import Wallets as Segment",
          free: { enable: true, tip: "Total 5" },
          growth: { enable: true, tip: "Total 20" },
          scale: { enable: true, tip: "Total 100" },
          enterprise: { enable: true, tip: "Unlimited" },
        },
        {
          name: "Filter Wallets",
          free: "5 Indicatiors",
          growth: "10 Indicatiors",
          scale: "50 Indicatiors",
          enterprise: "Unlimited Indicators",
        },
        {
          name: "Export Wallet Tags & Features",
          free: false,
          growth: true,
          scale: true,
          enterprise: true,
        },
      ],
    },
    {
      type: "Activation Campaigns",
      list: [
        {
          name: "Quest",
          free: { enable: true, tip: "Limited" },
          growth: { enable: true, tip: "Limited" },
          scale: { enable: true, tip: "Limited" },
          enterprise: { enable: true, tip: "Limited" },
        },
        {
          name: "Airdrop",
          free: { enable: true, tip: "Limited" },
          growth: { enable: true, tip: "Limited" },
          scale: { enable: true, tip: "Limited" },
          enterprise: { enable: true, tip: "Limited" },
        },
        {
          name: "Giveaway",
          free: { enable: true, tip: "Limited" },
          growth: { enable: true, tip: "Limited" },
          scale: { enable: true, tip: "Limited" },
          enterprise: { enable: true, tip: "Limited" },
        },
        {
          name: "Notification",
          free: { enable: true, tip: "Limited" },
          growth: { enable: true, tip: "Limited" },
          scale: { enable: true, tip: "Limited" },
          enterprise: { enable: true, tip: "Limited" },
        },
      ],
    },
    {
      type: "Bot Detection",
      list: [
        {
          name: "",
          free: false,
          growth: true,
          scale: true,
          enterprise: true,
        },
      ],
    },
    {
      type: "Team Cooperation",
      list: [
        {
          name: "",
          free: false,
          growth: "2 Seats",
          scale: "5 Seats",
          enterprise: "Customized",
        },
      ],
    },
    {
      type: "Customer Service",
      list: [
        {
          name: "",
          free: "Basic",
          growth: "Standard",
          scale: "Enhanced",
          enterprise: "Premium",
        },
      ],
    },
  ],
});
