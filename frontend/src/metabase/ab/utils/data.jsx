import React from "react";
import { SettingOutlined } from "@ant-design/icons";
import { ReactIcons } from "../../nav/containers/FpNavbar/utils/data";
import { getChainDataList } from "../../query_builder/components/question/handle";
//public/dashboard/uuid
export const wallet_profile_link =
  "/fga/public/dashboard/fa040fe5-46b3-483b-b257-aa2373559fab"; //query: wallet_address
export const getWalletProfileLink = (businessType) =>
  `/fga/${businessType}/public/dashboard/dce33214-a079-4eb8-b53f-defaabde2eba`; //query: wallet_address
export const user_profile_link =
  "/fga/public/dashboard/362dd1a3-6c35-4ce6-a4d3-dab2a436e323"; //query: cohort_title
export const getUserProfileLink = (businessType) =>
  `/fga/${businessType}/public/dashboard/362dd1a3-6c35-4ce6-a4d3-dab2a436e323`; //query: cohort_title
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
          dashboardLink: `/fga/public/dashboard/584a27d8-b93b-4cb2-9fba-15f4e2ee9d4d?${params}`,
        },
        {
          dashboardName: "Revenue and ARPU Analysis",
          id: 7961,
          dashboardLink: `/fga/public/dashboard/b9319fd1-c074-43ce-ac07-104c88be4073?${params}`,
        },
        {
          dashboardName: "Moneyflow Monitor to Check Game Health",
          dashboardLink: `/fga/public/dashboard/22304b4e-458b-4861-a34e-11bd0724a76b?${params}`,
          id: 7964,
        },
        {
          dashboardName: "In-Game Duel Analysis (Presenting by Web2 data)",
          dashboardLink: `/fga/public/dashboard/22b77726-f47d-4e0c-995a-bec002c70a0b?${params}`,
          id: 7963,
        },
        {
          dashboardName: "Airdrop: select users by FGA user profiling",
          dashboardLink: `/fga/public/dashboard/59ad5548-8e80-4402-9193-78e3b4db99c9?${params}`,
          id: 7962,
        },
        {
          dashboardName: "Gamer Profile",
          dashboardLink: `/fga/public/dashboard/aca032dc-5faf-462a-8be5-124d68226328?${params}`,
          id: 6345,
        },
        {
          dashboardName: "Bot detection",
          dashboardLink: `/fga/public/dashboard/0dcef7ac-8318-47fd-b675-7b60fdcd068e?${params}`,
          id: 7887,
        },
        {
          dashboardName: "Channel Analysis",
          dashboardLink: `/fga/public/dashboard/0bb1e2b8-c6a5-425a-a420-a9b6febdcddd?${params}`,
          id: 8051,
        },
        {
          dashboardName: "User Funnel to Check Conversion Rate",
          dashboardLink: `/fga/public/dashboard/d72a4dea-73c1-47a1-968c-b854ce586047?${params}`,
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
          dashboardLink: `/fga/public/dashboard/908f02a9-90c1-4aa3-960a-293d3641f94f?tag_as_potential=active-nft-trader&${params}`,
        },
        {
          dashboardName: "Blur Airdrop",
          id: 7121,
          dashboardLink: `/fga/public/dashboard/37c8520e-bd79-4fe1-8667-5c4ab73cf79b?${params}`,
        },
        {
          dashboardName: "Token Airdrop Monitoring",
          id: 7426,
          dashboardLink: `/fga/public/dashboard/c676fe55-c785-4015-bc8a-27c18b57826f?${params}`,
        },
        {
          dashboardName: "Dashboard for NFT Minting",
          dashboardLink: `/fga/public/dashboard/340f11c8-144e-4c24-a298-b5564c4a88a8?campaign_id=5284&${params}`,
          id: 7569,
        },
        {
          category: "Go to market",
          dashboardName: "Galxe Campaign Overall Stats",
          id: 7408,
          dashboardLink: `/fga/public/dashboard/b4658254-37a3-4965-87e5-acbd548aaa93?${params}`,
        },
        {
          category: "Go to market",
          desc: "",
          dashboardName: "Galxe Campaign Analysis",
          dashboardLink: `/fga/public/dashboard/f1c6f82d-2b7d-448d-b86c-6149e93c4e4a?campaign_id=5284&${params}`,
          id: 7407,
        },
        {
          category: "Go to market",
          desc: "",
          dashboardName: "Galxe Campaign Comparison",
          dashboardLink: `/fga/public/dashboard/25c72dde-126d-4676-b409-c40612e87c31?campaign_a_id=5284&campaign_b_id=8087&${params}`,
          id: 7409,
        },
        {
          category: "Go to market",
          desc: "",
          dashboardName: "Galxe Campaign Reward Analysis",
          dashboardLink: `/fga/public/dashboard/a42336af-e56a-4f2c-bcd2-1ce12f43191f?series_date=past90days&campaign_name=galxe&${params}`,
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
          dashboardLink: `/fga/public/dashboard/db6aac3e-48e4-4465-87b2-94be114475aa?${params}`,
          id: 7871,
        },
        {
          dashboardName: "MCH Duel Analysis",
          dashboardLink: `/fga/public/dashboard/617f6a66-c58d-4c57-8e4f-804f7df26257?date_filter=2023-04-01~2023-04-30&${params}`,
          id: 7873,
        },
        {
          dashboardName: "GameFi Industry Insights & Ranking",
          dashboardLink: `/fga/public/dashboard/c9c94943-7ec3-45bf-a2c1-29ffed28c8dc?series_date=past90days&${params}`,
          id: 7164,
        },
        {
          dashboardName: "GameFi Drill Down Analysis",
          dashboardLink: `/fga/public/dashboard/2855f92d-c2c4-45b1-bb30-5083e8e0c4ae?${params}`,
          id: 5947,
        },
        {
          category: "GameFi",
          desc: "",
          dashboardName: "GameFi Users Overview",
          dashboardLink: `/fga/public/dashboard/ece95985-e16c-4a6c-bf95-9d3b523ccfe3?date__=past180days&${params}`,
          id: 3578,
        },
        {
          category: "GameFi",
          desc: "",
          dashboardName: "Gamer Profile",
          id: 6345,
          dashboardLink: `/fga/public/dashboard/aca032dc-5faf-462a-8be5-124d68226328?wallet_address=0x81e4fb0c64bf49f89b57f6648562fc9a791b2e92&${params}`,
        },
        {
          category: "GameFi",
          desc: "",
          dashboardName: "GameFi Project Summary",
          id: 5911,
          dashboardLink: `/fga/public/dashboard/5138a6a9-6bdd-4d95-a00f-7f330e555aad?gamefi_name=splinterlands&date_range=past90days&${params}`,
        },
        {
          category: "GameFi",
          desc: "",
          dashboardName: "GameFi Compare",
          id: 6390,
          dashboardLink: `/fga/public/dashboard/8ea15e07-fea9-435b-95fa-791bc87c68ac?game_a=walken&game_b=stepn&chain=Solana&${params}`,
        },
      ],
    },
    {
      category: "NFT",
      desc: "Gain a deeper understanding  by analyzing the overview and holder profit&loss of NFTs.",
      items: [
        {
          dashboardName: "NFT Market Overview",
          dashboardLink: `/fga/public/dashboard/25e7f940-7fc8-4737-bcfa-d4b04a4b6196?${params}`,
          id: 7842,
        },
        {
          category: "NFT",
          desc: "Gain a deeper understanding  by analyzing the overview and holder profit&loss of NFTs.",
          dashboardName: "Top X NFT by Trading Vol",
          id: 7175,
          dashboardLink: `/fga/public/dashboard/c20b5c20-d2d4-4c92-aed3-a6e4be48c70a?trading_vol._%253E%253D=1000000&${params}`,
        },
        {
          category: "NFT",
          desc: "",
          dashboardName: "Multi-NFT Overview",
          id: 7185,
          dashboardLink: `/fga/public/dashboard/bfe2c3b8-b2b6-4980-86b0-acdca654d413?nft_collection_contract_address=0xed55e4477b795eaa9bb4bca24df42214e1a05c18&series_date=past30days&${params}`,
        },
        {
          category: "NFT",
          desc: "",
          dashboardName: "NFT Overview",
          id: 7139,
          dashboardLink: `/fga/public/dashboard/46b4bf34-2b15-46c7-89a0-fe626fe04b76?nft_collection_contract_address=0xed55e4477b795eaa9bb4bca24df42214e1a05c18&nft_collection_contract_address=0x16a1dcd0f76947dc3d3ba5158952107ef0321ad9&nft_collection_contract_address=0x5891eb497d1ddb4e3933981b55b37d5f98bbfbcf&nft_collection_contract_address=0xb55a820d92809bcff91d568fc1ef0e451c69f5e8&nft_collection_contract_address=0x15f3e5a30e45a58b15bba610f27689fbc7de8c3c&data=past3months&${params}`,
        },
        {
          category: "NFT",
          desc: "",
          id: 7192,
          dashboardName: "Profit Leaderboard for Collection",
          dashboardLink: `/fga/public/dashboard/3e9f9af4-93a8-46d4-8ee7-bc472201da7d?${params}`,
        },
        {
          category: "NFT",
          desc: "",
          dashboardName: "Multi-NFT Collections Royalties",
          id: 7188,
          dashboardLink: `/fga/public/dashboard/97d34558-8df9-4028-a5b9-1024fa0eb426?nft_collections=0x6a570bb15bc67968868c19b0ec7dcccdfd8ed089&nft_collections=0xed55e4477b795eaa9bb4bca24df42214e1a05c18&nft_collections=0x16a1dcd0f76947dc3d3ba5158952107ef0321ad9&nft_collections=0xb55a820d92809bcff91d568fc1ef0e451c69f5e8&nft_collections=0x5891eb497d1ddb4e3933981b55b37d5f98bbfbcf&nft_collections=0x15f3e5a30e45a58b15bba610f27689fbc7de8c3c&series_date=past30days&${params}`,
        },
        {
          category: "NFT",
          desc: "",
          id: 6808,
          dashboardName: "Wallet Tracing",
          dashboardLink: `/fga/public/dashboard/27b8343b-80c5-49f8-861f-990652329895?collection=benji-bananas-membership-pass&date_range=past30days&${params}`,
        },
        {
          category: "NFT",
          desc: "",
          id: 7187,
          dashboardName: "Owner Analysis",
          dashboardLink: `/fga/public/dashboard/1b28aa29-4dea-4e48-bfcd-69afc71fb728?target_collection=0xed55e4477b795eaa9bb4bca24df42214e1a05c18&selected_collections=0x16a1dcd0f76947dc3d3ba5158952107ef0321ad9&selected_collections=0xb55a820d92809bcff91d568fc1ef0e451c69f5e8&selected_collections=0x6a570bb15bc67968868c19b0ec7dcccdfd8ed089&selected_collections=0x5891eb497d1ddb4e3933981b55b37d5f98bbfbcf&selected_collections=0x15f3e5a30e45a58b15bba610f27689fbc7de8c3c&selected_collections=0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258&selected_collections=0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d&selected_collection_balance_%253E%253D=0&wallet_address=0x950fca90ae7eb55cd35326eb8e6350747d4cf32e&${params}`,
        },
        {
          category: "NFT",
          desc: "",
          id: 7170,
          dashboardName: "Mutual Holders",
          dashboardLink: `/fga/public/dashboard/5f67bd14-6a8b-478c-a574-184063150d03?collection_a_=0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d&collection_b=0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb&holder_tag=mutual_holders&${params}`,
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
          dashboardLink: `/fga/public/dashboard/ffaa758e-e1f8-4d22-af54-7d952aa12edd?${params}`,
        },
        {
          category: "Investment Portfolio",
          desc: "",
          id: 824,
          dashboardName: "Investment History of VC",
          dashboardLink: `/fga/public/dashboard/ce2a23a7-b88b-44a9-93c3-dc1dc0f3a7ae?${params}`,
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

export const getDashboardMap = (businessType, project, chain) => {
  let protocolType = project?.protocolType;
  const dashboardMap = new Map([
    ["transaction_monitor", "5448e85b-442e-44b7-9c88-e22a1bd11d11"],
    ["ecosystem_development", "0b6bbe4d-5480-4e1c-8860-ead23619492b"],
    ["ecosystem_projects", "8750f228-16d7-4b40-91de-92dfb4b7e0c6"],
    ["project_directory", "dc9fd9b4-b65b-448d-afea-f72aa9a4f7e0"],
    [
      "home",
      protocolType === "NFT"
        ? "346f0d3d-5486-404b-a5d2-17ce52150fe1"
        : "2f4f1fe9-7163-4ecf-91db-76c87a9306ed",
    ],
    ["game_tokenomics", "20e373cb-cc99-4ab0-9d74-c3c16d17e92a"],
    ["game_revenue", "8932389c-42cc-4ce7-a20f-a6a146cd31a2"],
    ["game_token_holder", "ff4ddbe9-8818-4abf-8a6c-91c3559071af"],
    ["users_overview", "6d84b4a6-ceef-4b30-a9ad-b233038fd8d3"],
    ["game_active_users", "6d84b4a6-ceef-4b30-a9ad-b233038fd8d3"],
    ["nft_leaderboard", "21a0555b-4e8b-45cc-858d-ae41861ba9ee"],
    ["nft_nft_holder", "9edaeba8-9c3b-4726-b139-73b2ca738c13"],
    ["nft_sales_mints", "9d9e9149-1dbc-4e0e-88a4-f9c64d1c10e1"],
    ["nft_revenue", "b98b0a6b-64cb-4e09-979d-693040ea3ec9"],
    ["twitter", "773e9e27-d131-43a6-ba05-518136a52fd3"],
    ["discord", "0d6f82b3-21cf-4b9c-9766-775454b8d7d2"],
    ["project_health", "d14ebd54-b6ab-4111-a877-c9d66e253be8"],
    ["social", "5492ee87-4d65-49e2-878d-8a2aa9d5b745"],
    ["gaming_overview", "878b2412-a464-4286-903f-05a2950a5f6d"],
    ["listing", "dcc2860f-8693-4de3-8123-6c5ba12c0d1c"],
    ["project_overlap", "64f35dd4-89e8-4c27-a2fc-3453ac23254d"],
    ["retention", "73ce13a3-0815-45dd-bc30-59a75ae7e0c0"],
    ["acquisition", "43325414-b798-44cb-ad2d-745d374b22f2"],
    ["gaming_user", "16d26c02-b0f4-4c78-9385-44a9212a826b"],
    ["nft_summary", "25c5de28-0591-4893-a574-cbe913c80043"],
    ["nft_sales_mints", "aefc83f1-ed4b-4dba-a21f-6f85a1de471c"],
    ["listing", "20ae0361-4a39-4b66-bd56-fb9f012bfd3c"],
    ["gaming_spend", "c86f7c43-41fd-4c75-9d8a-3ebc381ae62e"],
    ["gaming_engagement", "b0eee809-7c27-4c86-adf2-5644fa6a7529"],
    ["project_summary", "6fd5b004-29c2-4560-84ab-9894a7567c12"],
    ["project_users", "9d4e9931-5c29-4913-99a4-ec0147712bcb"],
    ["project_transaction", "4a076f7b-4b4f-4060-b36a-8c1b849d3692"],
    ["monetization", "990050e0-3d86-40d8-9aa4-f0fbab381d83"],
    ["platform-protocols_slugs", "1b6fbdbe-dcff-4fe2-8b2a-6fc792173b49"],
    ["game_user_acquisition", "f0e46f09-0f53-4d00-b350-b399ca70133f"],
    ["game_user_engagement", "23a1fc28-dba0-4e17-8270-786632ed161d"],
    ["game_user_retention", "9a19edda-1c4c-4aa5-95fc-921304f8f8fd"],
    ["project-holder-overlap", "82e8500d-87c1-4dca-b2b6-b46e0287f156"],
    ["financials-nft-revenue", "d5142de8-81e9-4682-a4af-0026c058e9d1"],


    ["project_health-platform", "7a275541-580a-4720-8e10-f455335de137"],
    ["users_overview-platform", "6d84b4a6-ceef-4b30-a9ad-b233038fd8d3"],
  ]);
  return dashboardMap;
}

export const fga_menu_data_v2 = (businessType, project, chain) => {
  let protocolType = project?.protocolType;
  const chainConfig = chain ? getChainDataList({ includeAll: false }).find(item => item.label === chain) : getChainDataList({ includeAll: false });
  const dashboardMap = getDashboardMap(businessType, project, chain);

  const standardData = {
    "platformMenuTabs": [
      getItem("Overview", "home-platform", ReactIcons.myAnalysisIcon, [
        getItem("Project List", "platform-protocols_slugs", null),
      ]),
    ],
    "menuTabs": [
      getItem("Project Overview", "project_overview", ReactIcons.myAnalysisIcon, [
        getItem("Project Summary", "project_summary", null),
      ]),
      (project?.nftCollectionAddress?.length > 0 || project?.tokenAddress?.length > 0) &&
        getItem("Assets", "assets", ReactIcons.assetIcon, [
          project?.nftCollectionAddress?.length > 0 &&
            getItem("NFT", "nft", null, [
                getItem("Summary", "nft_summary", null),
                getItem("NFT Sales & Mints", "nft_sales_mints", null),
                getItem("NFT Listing", "listing", null),
                getItem("NFT Holders", "nft_nft_holder", null),
                getItem("Leaderboard", "nft_leaderboard", null),
              ]
            ),
          project?.tokenAddress?.length > 0 &&
            getItem("Token", "game_tokenomics", null),
          // getItem("Momentum", "momentum", null, [
          //     getItem("Retention", "retention", null),
          //     getItem("Acquisition", "acquisition", null),
          //   ]
          // ),
        ]),
      /*getItem("Game", "gaming", ReactIcons.gamingStatIcon, [
        getItem("Game States", "gaming_overview", null),
        getItem("Monetization", "monetization", null),
        getItem("User", "game-user", null, [
          getItem("User Acquisition", "game_user_acquisition", null),
          getItem("User Engagement", "game_user_engagement", null),
          getItem("User Retention", "game_user_retention", null),
        ]),
      ]),
      getItem("Users", "users", ReactIcons.userIcon, [
        getItem("Members", "members", null),
        getItem("Journey Explorer", "journey", null),
        getItem("Segmentation", "segment", null),
      ]),*/
      /*getItem(
        "Growth",
        "growth",
        ReactIcons.growthIcon,
        [
          getItem("Wallets Explorer", "members", null),
          // getItem("Snapshot Tools", "snapshot_tools", null),
          // getItem("Airdrop", "airdrop", null),
          // getItem("Single Wallet Profile", "wallet_profile", null),
          // getItem("Activation", "activation", null),
        ],
        // "group",
      ),*/
      /*getItem("Settings", "settings", <SettingOutlined />, [
        getItem("Integration", "integration", null),
        getItem("Project Info", "general", null),
        // getItem("Channel", "channel", null),
      ]),*/
    ]
  }

  const gameProjectData = {
    "platformMenuTabs": [
        // getItem("Project Holder Overlap", "platform-holder_overlap", null),
    ],
    "menuTabs": [
      getItem("Project Overview", "project_overview", ReactIcons.myAnalysisIcon, [
        getItem("Project Summary", "project_summary", null),
      ]),
      getItem("Financials", "financials", ReactIcons.datasetsIcon, [
        getItem("NFT Revenue", "financials-nft-revenue", null),
      ]),
      (project?.nftCollectionAddress?.length > 0 || project?.tokenAddress?.length > 0) &&
      getItem("Assets", "assets", ReactIcons.assetIcon, [
        project?.nftCollectionAddress?.length > 0 &&
        getItem("NFT", "nft", null, [
            getItem("Summary", "nft_summary", null),
            getItem("NFT Sales & Mints", "nft_sales_mints", null),
            getItem("NFT Holders", "nft_nft_holder", null),
            getItem("NFT Leaderboard", "nft_leaderboard", null),
            // getItem("NFT Listing", "listing", null),
          ]
        ),
        project?.tokenAddress?.length > 0 &&
          getItem("Token", "game_tokenomics", null),
        // getItem("Momentum", "momentum", null, [
        //     getItem("Retention", "retention", null),
        //     getItem("Acquisition", "acquisition", null),
        //   ]
        // ),
      ]),
      getItem("Users", "game_users", ReactIcons.gamingStatIcon, [
        getItem("Acquisition", "game_user_acquisition", null),
        getItem("Engagement", "game_user_engagement", null),
        getItem("Retention", "game_user_retention", null),
      ]),
      getItem("Exploration", "exploration", ReactIcons.userIcon, [
        getItem("Members", "members", null),
        // getItem("Journey Explorer", "journey", null),
        getItem("Segmentation", "segment", null),
      ]),
      /*getItem(
        "Growth",
        "growth",
        ReactIcons.growthIcon,
        [
          getItem("Wallets Explorer", "members", null),
          // getItem("Snapshot Tools", "snapshot_tools", null),
          // getItem("Airdrop", "airdrop", null),
          // getItem("Single Wallet Profile", "wallet_profile", null),
          // getItem("Activation", "activation", null),
        ],
        // "group",
      ),*/
      getItem("Settings", "settings", <SettingOutlined />, [
        getItem("Integration", "integration", null),
        getItem("Project Info", "general", null),
        // getItem("Channel", "channel", null),
      ]),
    ]
  }

  const publicChainData = {
    "platformMenuTabs": [
      getItem("Ecosystem", "ecosystem-home", ReactIcons.myAnalysisIcon, [
        getItem("Transaction Monitor", "transaction_monitor", null),
        chainConfig?.hasDevelopment ? getItem("Development", "ecosystem_development", null) : null,
        getItem("Projects", "ecosystem_projects", null),
        getItem("Project Directory", "project_directory", null),
      ].filter(i => i))
    ],
    "menuTabs": [
      getItem("Project Overview", "project_overview", ReactIcons.myAnalysisIcon, [
        getItem("Project Summary", "project_summary", null),
        getItem("Users", "project_users", null),
        getItem("Transaction", "project_transaction", null),
      ]),
      (project?.nftCollectionAddress?.filter(item => item.chain === chain)?.length > 0 || project?.tokenAddress?.filter(item => item.chain === chain)?.length > 0) &&
        getItem("Assets", "assets", ReactIcons.assetIcon, [
          project?.nftCollectionAddress?.filter(item => item.chain === chain)?.length > 0 &&
            getItem("NFT", "nft", null, [
                getItem("NFT Summary", "nft_summary", null),
                getItem("NFT Sales&Mints", "nft_sales_mints", null),
                getItem("NFT Listing", "listing", null),
                // getItem("NFT Holders", "nft-holders-coming-soon", null),
                getItem("Leaderboard", "nft_leaderboard", null),
              ]
            ),

          project?.tokenAddress?.filter(item => item.chain === chain)?.length > 0 &&
            getItem("Token", "token", null, [
                getItem("Token Summary", "game_tokenomics", null),
                // getItem("Token Holders", "token-holders-coming-soon", null),
              ]
            ),
          //  protocolType !== "NFT" && getItem("Active Users", "game_active_users", null),
        ]),
      /*getItem("Operation Metrics", "operation_metrics", ReactIcons.assetIcon, [
        getItem("User", "User_coming_soon", null),
        getItem("Engagement", "Engagement_coming_soon", null),
        getItem("Spend", "Spend_coming_soon", null),
      ]),*/
     /* getItem("Community", "social_stats", ReactIcons.userIcon, [
          getItem("Twitter", "Twitter_coming_soon", null),
          getItem("Discord", "Discord_coming_soon", null),
        ]
      ),
      protocolType !== "GameFi" &&
        getItem("Holders", "Holders_coming_soon", ReactIcons.userIcon),
        getItem("Momentum", "momentum", ReactIcons.userIcon, [
            getItem("Retention", "Retention_coming_soon", null),
            getItem("Acquisition", "Acquisition_coming_soon", null),
          ]
        ),
      getItem("Users", "users", ReactIcons.userIcon, [
        //<TeamOutlined />
        // protocolType !== "NFT" && getItem("Overview", "users_overview", null),
        getItem("Profiles", "user_profile", null),
        protocolType !== "GameFi" &&
          getItem("Leaderboard", "nft_leaderboard", null),
        getItem("Journey Explorer", "journey", null),
        getItem("Segmentation", "segment", null),
      ]),*/
    ]
  }

  const platformMenuTabsMapping = {
    "public-chain": publicChainData.platformMenuTabs,
    "game-project": gameProjectData.platformMenuTabs,
  }
  const platformMenuTabs = platformMenuTabsMapping[businessType] || standardData.platformMenuTabs;

  const menuTabsMapping = {
    "public-chain": publicChainData.menuTabs,
    "game-project": gameProjectData.menuTabs,
  }
  const menuTabs = menuTabsMapping[businessType] || standardData.menuTabs;

  const platformMenuTitleMapping = {
    "public-chain": "Chain",
  }
  const platformMenuTitle = platformMenuTitleMapping[businessType] || "Portfolio";
  const menuTitle = "Project";

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
  const keys = getKeys([...platformMenuTabs, ...menuTabs]);
  return { menuTabs, platformMenuTabs, keys, dashboardMap, liveKeys, menuTitle, platformMenuTitle, };
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
