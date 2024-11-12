import React from "react";
import { SettingOutlined, ShrinkOutlined, FireOutlined } from "@ant-design/icons";
import { ReactIcons } from "../../nav/containers/FpNavbar/utils/data";
import Icon from "metabase/components/Icon";
import { getChainDataList } from "../../query_builder/components/question/handle";
import { Tooltip } from "antd";
import GAIcon from "metabase/ab/utils/GAIcon";
//public/dashboard/uuid
export const wallet_profile_link =
  "/fga/public/dashboard/fdcf253d-24b4-4f6e-839e-3880242041a8"; //query: wallet_address
export const getWalletProfileLink = (businessType) =>
  `/fga/${businessType}/public/dashboard/dce33214-a079-4eb8-b53f-defaabde2eba`; //query: wallet_address
export const user_profile_link =
  "/fga/public/dashboard/362dd1a3-6c35-4ce6-a4d3-dab2a436e323"; //query: cohort_title
export const getUserProfileLink = (businessType) =>
  `/fga/${businessType}/public/dashboard/fdcf253d-24b4-4f6e-839e-3880242041a8`; //query: cohort_title
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
    ["game_tokenomics", "20e373cb-cc99-4ab0-9d74-c3c16d17e92a"],
    ["token_trading", "a0947a33-694a-4471-9918-9f464e75233a"],
    ["token_holders", "055dae12-eae5-4368-9f2d-633d40e45e14"],
    ["game_revenue", "8932389c-42cc-4ce7-a20f-a6a146cd31a2"],
    ["game_token_holder", "ff4ddbe9-8818-4abf-8a6c-91c3559071af"],
    ["users_overview", "6d84b4a6-ceef-4b30-a9ad-b233038fd8d3"],
    ["game_active_users", "6d84b4a6-ceef-4b30-a9ad-b233038fd8d3"],
    ["nft_leaderboard", "21a0555b-4e8b-45cc-858d-ae41861ba9ee"],
    ["nft_nft_holder", "9edaeba8-9c3b-4726-b139-73b2ca738c13"],
    ["nft_revenue", "b98b0a6b-64cb-4e09-979d-693040ea3ec9"],
    ["twitter", "773e9e27-d131-43a6-ba05-518136a52fd3"],
    ["discord", "0d6f82b3-21cf-4b9c-9766-775454b8d7d2"],
    ["project_health", "d14ebd54-b6ab-4111-a877-c9d66e253be8"],
    ["social", "5492ee87-4d65-49e2-878d-8a2aa9d5b745"],
    ["gaming_overview", "878b2412-a464-4286-903f-05a2950a5f6d"],
    ["listing", "dcc2860f-8693-4de3-8123-6c5ba12c0d1c"],
    ["nft_listing", "dcc2860f-8693-4de3-8123-6c5ba12c0d1c"],
    ["project_overlap", "64f35dd4-89e8-4c27-a2fc-3453ac23254d"],
    ["retention", "73ce13a3-0815-45dd-bc30-59a75ae7e0c0"],
    ["acquisition", "43325414-b798-44cb-ad2d-745d374b22f2"],
    ["gaming_user", "16d26c02-b0f4-4c78-9385-44a9212a826b"],
    ["nft_summary", "25c5de28-0591-4893-a574-cbe913c80043"],
    ["nft_sales", project?.protocolSlug !== "Demo Project" ? "354b9c63-8904-4cc9-acea-3fb399748ff8": "aefc83f1-ed4b-4dba-a21f-6f85a1de471c"],
    ["nft_mints", "0934a0a9-29a5-4e44-9fc2-98b0ae5afd83"],
    ["listing", "20ae0361-4a39-4b66-bd56-fb9f012bfd3c"],
    ["gaming_spend", "c86f7c43-41fd-4c75-9d8a-3ebc381ae62e"],
    ["gaming_engagement", "b0eee809-7c27-4c86-adf2-5644fa6a7529"],
    ["project_summary", "6fd5b004-29c2-4560-84ab-9894a7567c12"],
    ["project_users", "9d4e9931-5c29-4913-99a4-ec0147712bcb"],
    ["project_transaction", "4a076f7b-4b4f-4060-b36a-8c1b849d3692"],
    ["monetization", "990050e0-3d86-40d8-9aa4-f0fbab381d83"],
    ["platform-protocols_slugs", "1b6fbdbe-dcff-4fe2-8b2a-6fc792173b49"],
    ["project-holder-overlap", "82e8500d-87c1-4dca-b2b6-b46e0287f156"],
    ["revenue-web3-revenue", project?.protocolSlug !== "Demo Project" ? "3a295288-1101-4483-92ea-6dda71b9a5a9": "d5142de8-81e9-4682-a4af-0026c058e9d1"],
    ["revenue-web2-revenue", "2882cb24-1bf2-4c03-80e7-5fd184acc846"],
    ["revenue-total-revenue", "72b80a56-81c8-4c6b-9661-54bfa77e812f"],
    ["acquisition_wallet", "f0e46f09-0f53-4d00-b350-b399ca70133f"],
    ["acquisition_users", "e1f2b298-4230-4a25-98ca-cabcd4e2b262"],
    ["wallet_engagement", "23a1fc28-dba0-4e17-8270-786632ed161d"],
    ["gaming_engagement", "e2695683-3c8c-4462-92db-e32bc6f50050"],
    ["wallet_retention", "9a19edda-1c4c-4aa5-95fc-921304f8f8fd"],
    ["user_retention", "320e0a60-107c-44cb-83e3-7c8301354968"],
    ["wallet_profile2", "bff3c209-9d4c-4e75-96dd-9676b184bbfa"],
    ["token_leaderboard", "f36c338b-d213-4071-9d92-66c7d575f7cb"],
    ["telegram", "5aa8809b-296f-4ac9-b7c1-4a713abed1df"],
    ["ecosystem_wallet", "9f96361e-d423-4239-9f97-7e6277793829"],
    ["asset_overview", "4ae6d57f-1c69-4a86-bc78-9b4d5dde69ee"],

    ["project_key_metrics", "159d8c0e-f1b9-4449-a6b1-7ee51de47563"],
    ["project_holder_overlap", "994ab322-671c-479a-a835-2e28d16b326e"],

    ["project_health-platform", "7a275541-580a-4720-8e10-f455335de137"],
    ["users_overview-platform", "6d84b4a6-ceef-4b30-a9ad-b233038fd8d3"],
    ["wallet_profile", "fdcf253d-24b4-4f6e-839e-3880242041a8"],
    ["quest_dashboard", "12d8d743-8622-440a-90af-99efd6c5281a"],
    ["nft_snapshot_tool", "266211dd-94b7-42a7-afea-ae1ffacc699b"],
    ["token_city_map", "c66a90d6-7224-4086-8fcb-bdb9035fe491"],
    ["token_snapshot_tool", "5e989c99-40f7-47c5-9d25-1bf0dd20827a"],
    ["wallet_feature", "973bfa70-4495-4556-9405-6ba439b594d2"],
    ["community_sentiment", "b02274aa-dddf-4dec-a865-639338500d38"],
  ]);
  return dashboardMap;
}

const getLabel = ({label, tip}) => {
  return <div className="flex align-center">{label}{tip && <Tooltip title={tip}><Icon className="ml1" name={"info"} size={12}/></Tooltip>}</div>
}

// eslint-disable-next-line react/prop-types
const GaIconLayout = ({children}) => {
  return (
    <div className="flex align-center" style={{gap: 6}}>
      {children}
      <GAIcon />
    </div>
  )
}

export const fga_menu_data_v2 = (businessType, project, chain, user) => {
  const isProFgaBeta = businessType === "pro_beta"
  if (businessType === "pro" || businessType === "pro_beta") {
    const menuTabs = [
      getItem("Project Overview", "asset_overview_pro", null),
      getItem("User Acquisition", "user_acquisition_parent", ReactIcons.trendingIcon14, [
        getItem("User Acquisition", "acquisition_users_pro", null),
        getItem("User Retention", "Retention_users_pro", null),
        // getItem("Wallet Retention", "wallet_retention", null),
      ]),
      getItem("User Engagement", "user_engagement_parent", ReactIcons.growthIcon, [
        getItem("User Engagement", "engagement_users_pro", null),
        // getItem("Wallet Engagement", "wallet_engagement", null),
      ]),
      getItem("Assets", "assets", ReactIcons.assetIcon, [
        getItem("Token", "token", null, [
          // getItem("Summary", "game_tokenomics", null),
          getItem("Trading", "token_trading", null),
          getItem("Holders", "token_holders", null),
          getItem("Leaderboard", "token_leaderboard", null),
          // getItem("Token City Map", "token_city_map", null),
          // getItem("Token Snapshot Tool", "token_snapshot_tool", null),
        ]),
        getItem("NFT", "nft", null, [
            // getItem("Summary", "nft_summary", null),
            // getItem("NFT Mints", "nft_mints", null),
            getItem("Sales", "nft_sales", null),
            getItem("Holders", "nft_nft_holder", null),
            getItem("Leaderboard", "nft_leaderboard", null),
            getItem("Listing", "nft_listing", null),
            // getItem("NFT Snapshot Tool", "nft_snapshot_tool", null),
          ]
        ),
      ]),
      getItem("Settings", "settings", <SettingOutlined />, [
        getItem("Project Info", "general", null),
        getItem("Account Info", "account", null),
      ]),
    ]
    const keys = getKeys([...menuTabs]);
    return {
      dashboardMap: new Map([
          ["asset_overview_pro", "72e6366d-1586-4c72-9c4b-d9a0c67a9bde"],
          ["acquisition_users_pro", "e7e9eaee-676a-4c4e-94a0-4828c7cc8f2a"],
          ["Retention_users_pro", "31bae1fb-5eee-4f05-8c30-d049a68765dc"],
          ["engagement_users_pro", "7d97d9d7-d75e-44ea-b1c7-4cfcf68f6ce1"],
          ["token_trading", "87efcdde-b574-48b4-a7ea-ff62a6ff3d78"],
          ["token_holders", "5a8acaed-c1b7-4995-9560-11b716ec6dff"],
          ["token_leaderboard", "f36c338b-d213-4071-9d92-66c7d575f7cb"],
          ["nft_sales", "f402d300-7a8b-46bd-8a39-5d0eb2066c3e"],
          ["nft_listing", "c09a2a49-a90b-4bd2-94b7-fbe192ad0eb7"],
          ["nft_nft_holder", "f4346e62-3191-4e08-b201-2abcc8d5956c"],
          ["nft_leaderboard", "21a0555b-4e8b-45cc-858d-ae41861ba9ee"],
          ["wallet_retention", "19eb5c44-8c3f-4172-b3e1-115268e116f3"],
          ["wallet_engagement", "6116808a-ba87-482f-b47f-5e9b79a4b700"],
          ["token_city_map", "9293ce58-0836-41ec-b6d5-9b017e00fca9"],
        ]
      ),
      menuTabs: menuTabs,
      keys,
      menuTitle: "Project",
    }
  }
  if (businessType === "vc") {
    return {
      dashboardMap: new Map([
        ["defi_ranking", "1188d812-d694-4351-890b-96ca1f3cbca9"],
        ["single-defi-project", "ca452892-cbe6-4db9-8e0d-e44d808ee7ab"],
        ["gamefi-ranking", "55ddecea-1340-42ef-a9ef-b58e0fbcd72a"],
        ["single-gamefi-project", "3ffa94a9-f511-41e7-966a-028fdb50c1ee"],
        ["discord", "0d6f82b3-21cf-4b9c-9766-775454b8d7d2"],
        ["telegram", "5aa8809b-296f-4ac9-b7c1-4a713abed1df"],
        ["twitter", "2ed49a96-9786-4027-9b51-c807d69f993b"],
        ["news", "6a14842a-e8c3-4401-8373-080d7c90c15d"],
        ["news-feeds-keyword", "6a14842a-e8c3-4401-8373-080d7c90c15d"],
        ["new-fundraising-announcement", "34f216ff-4a2a-443f-9225-8ff91a8e4b75"],
        ["alert", "442f3e03-48a5-4477-b1db-8dd71cd4c0cc"],
        ]
      ),
      menuTabs: [
        getItem("DeFi", "defi", ReactIcons.assetIcon, [
          // project?.nftCollectionAddress?.length > 0 &&
          getItem("Ranking", "defi_ranking", null),
          getItem("Single Project", "single-defi-project", null),
        ]),
        getItem("Gaming", "gaming", ReactIcons.myAnalysisIcon, [
          getItem("Ranking", "gamefi-ranking", null),
          getItem("Single Project", "single-gamefi-project", null),
        ]),
        getItem("Community", "community", ReactIcons.userIcon, [
          getItem("Discord", "discord", null),
          getItem("Telegram", "telegram", null),
          getItem("Twitter", "twitter", null),
          getItem("Community Keyword Alert", "alert", null),
        ]),
        getItem("Funding", "funding", ReactIcons.growthIcon, [
          getItem("Announcement", "new-fundraising-announcement", null),
        ]),
        getItem("News Feed", "news-feed", ReactIcons.trendingIcon14, [
          getItem("Announcement", "news-feeds-keyword", null),
          getItem("CEXs Listing", "cexs-listing", null),
        ]),
      ],
      menuTitle: "Portfolio",
    }
  }
  if (businessType === "growth") {
    return {
      dashboardMap: new Map([
        ["my-quests", "/admin/quest/list"],
        ["my-community", "/admin/community/create"],
        ["c-detail", "/community/duke"],
        ["communities", "/community"],
        ["q-create", "/admin/quest/create"],
        ["q-detail", "/app/quest/lucky_money?id=66a7743358394c0011e69ce9"],
        ["my-profile", "/profile"],
        ["p-deposit", "/profile/deposit"],
        ["p-withdraw", "/profile/withdraw"],
        ["p-wallet", "/profile/wallet"],
        ['quest-analytics', "26880a05-26bf-4e97-9902-9054df2c4a44"],
        ['referral-analytics', "8a2f0679-bc33-406c-b5cc-34357d8e2c02"],
        ['user-feature', ""],
        ['community-analysis', ""],
        ]
      ),
      menuTabs: [
        getItem("Community", "community", <FireOutlined />, [
          // project?.nftCollectionAddress?.length > 0 &&
          getItem("Communities", "communities", null),
          getItem("My Community", "my-community", null),
          getItem("My Quests", "my-quests", null),
          // getItem("detail", "c-detail", null),
        ]),
        // getItem("Quest", "quest", ReactIcons.userIcon, [
        //   // getItem("Create", "q-create", null),
        //   // getItem("Detail", "q-detail", null),
        // ]),
        getItem("Analytics", "analytics", ReactIcons.growthIcon, [
          getItem("Quest", "quest-analytics", null),
          getItem("Referral", "referral-analytics", null),
          getItem("Community", "community-analytics", null),
          // getItem("Deposit", "p-deposit", null),
          // getItem("Withdraw", "p-withdraw", null),
          // getItem("Wallet", "p-wallet", null),
        ]),
        getItem("Segment", "segment", ReactIcons.assetIcon, [
          getItem("User/Wallet Features", "user-feature", null),
        ]),
        getItem("Points", "points", ReactIcons.academyIcon14, [
          getItem("Points Setting", "point-setting", null),
        ]),
        getItem("Setting", "profile", <SettingOutlined />, [
          getItem("My Profile", "my-profile", null),
          // getItem("Deposit", "p-deposit", null),
          // getItem("Withdraw", "p-withdraw", null),
          // getItem("Wallet", "p-wallet", null),
        ]),
      ],
      menuTitle: "",
    }
  }
  const dashboardMap = getDashboardMap("", project, chain);

  const gameProjectData = {
    "platformMenuTabs": [
        // getItem("All Projects", "all-projects", null),
        getItem(getLabel({label: "Wallet", tip: "Here shows wallet metrics of selected project, derived from contracts associated with each project."}), "ecosystem_wallet", ReactIcons.assetIcon, ),
        getItem(getLabel({label: "Setting"}), "project_key_metrics22", <SettingOutlined />, [
          getItem("Project Setting", "contact_us", null),
          getItem("Authorization", "authorization", null),
        ]),
        // getItem(getLabel({label: "Project Key Metrics", tip: "Here shows key metrics of selected project, derived from contracts associated with each project."}), "project_key_metrics", null),
        // getItem(getLabel({label: "Holder Overlap", tip: "Here shows key metrics of selected project, derived from contracts associated with each project."}), "project_holder_overlap", null),
    ],
    "menuTabs": [
      /*getItem("Project Overview", "project_overview", ReactIcons.myAnalysisIcon, [
        getItem("Project Summary", "project_summary", null),
      ]),*/
      // (project?.nftCollectionAddress?.length > 0 || project?.tokenAddress?.length > 0) &&
      getItem("Project Overview", "asset_overview", null),
      getItem(getLabel({label: "Users", tip: "Presented here are the statistics using Web3 wallets that have interacted with the project's on-chain contracts, as well as Web2 users involved in off-chain activities."}), "users", ReactIcons.userIcon, [
        getItem("User Acquisition", "acquisition_users", null),
        getItem("User Engagement", "gaming_engagement", null),
        getItem("User Retention", "user_retention", null),
        getItem("Wallet Engagement", "wallet_engagement", null),
        getItem("Wallet Retention", "wallet_retention", null),
        getItem("Wallet Profile", "wallet_profile2", null),
        // getItem("Wallet Feature", "wallet_feature", null),
        // getItem(getLabel({label: "Journey Explorer", tip: "Here you can create and view your Project user journey from web2 and web3 events."}), "journey", null),
      ]),
      getItem(getLabel({label: "Assets", tip: "Here showcases the web3 assets associated with the chosen Project, based on the gathered addresses of NFTs and Token contracts."}), "assets", ReactIcons.assetIcon, [
        // project?.nftCollectionAddress?.length > 0 &&
        project?.tokenAddress?.length > 0 &&
        getItem("Token", "token", null, [
          // getItem("Summary", "game_tokenomics", null),
          getItem("Trading", "token_trading", null),
          getItem("Holders", "token_holders", null),
          getItem("Leaderboard", "token_leaderboard", null),
          getItem("Token City Map", "token_city_map", null),
          // getItem("Token Snapshot Tool", "token_snapshot_tool", null),
        ]),
        getItem("NFT", "nft", null, [
            // getItem("Summary", "nft_summary", null),
            // getItem("NFT Mints", "nft_mints", null),
            getItem("Sales", "nft_sales", null),
            getItem("Listing", "nft_listing", null),
            getItem("Holders", "nft_nft_holder", null),
            getItem("Leaderboard", "nft_leaderboard", null),
            // getItem("NFT Snapshot Tool", "nft_snapshot_tool", null),
          ]
        ),
      ]),
      getItem(getLabel({label: "Monetization", tip: "Here demonstrates the Web3 and Web2 Revenue generated by the selected Project. Web3 Revenue primarily consists of royalties obtained from the NFT collection. Web2 Revenue encompasses the netflow of fiat cash into the Project. This data is provided from the protocol internal connectors."}), "revenue", ReactIcons.datasetsIcon, [
        getItem("Revenue", "revenue-total-revenue", null),
      ]),
      /*getItem(getLabel({label: "Acquisition", tip: "Here illustrates the acquisition of Web3 wallets that have interacted with the project's on-chain contracts, as well as Web2 users involved in off-chain activities."}), "acquisition", ReactIcons.onBoardIcon14, [
        // getItem("Wallets", "acquisition_wallet", null),
        getItem("Users", "acquisition_users", null),
      ]),
      getItem(getLabel({label: "Engagement", tip: "Presented here are the engagement statistics encompassing Web3 wallets that have interacted with the project's on-chain contracts, as well as Web2 users engaged in off-chain in-game activities."}), "engagement", ReactIcons.gamingStatIcon, [
        getItem("Wallets", "wallet_engagement", null),
        getItem("Users", "gaming_engagement", null),
      ]),
      getItem(getLabel({label: "Retention", tip: "Displayed here are the retention statistics pertaining to Web3 wallets that have interacted with the project's on-chain contracts, along with Web2 users who have not connected their wallets."}), "retention", ReactIcons.trendingIcon14, [
        // getItem("Wallets", "wallet_retention", null),
        getItem("Users", "user_retention", null),
      ]),*/
      getItem(getLabel({label: "Community", tip: "Presented below are the metrics illustrating the growth of the Project community on both the Telegram and Discord platforms.\n"}), "social_stats", <ShrinkOutlined />, [
          getItem("Community Sentiment", "community_sentiment", null),
          getItem("Telegram", "telegram", null),
          getItem("Discord", "discord", null),
        ]
      ),
      getItem("Growth", "campaign", <FireOutlined />, [
          getItem("Campaign", "quest", null),
          getItem("Segmentation", "members", null),
        ]
      ),
      getItem(getLabel({label: "Custom Analysis", tip: "Users can create their own metrics in FGA and easily find their personalized dashboard and charts."}), "exploration", ReactIcons.academyIcon14, [
        getItem("Create", "chart_create", null),
        getItem("My Analysis", "my_analysis", null),
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
        // project?.protocolSlug !== "Demo Project" && getItem("Keys & IDs", "keys-ids", null),
        // getItem("Channel", "channel", null),
      ]),
    ]
  }


  const platformMenuTabs = gameProjectData.platformMenuTabs;

  const menuTabs = gameProjectData.menuTabs;

  const platformMenuTitle = "Ecosystem";
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
  const keys = getKeys([...menuTabs, ...platformMenuTabs]);
  // const keys = getKeys([...platformMenuTabs, ...menuTabs]);
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

