const nftData = [
  {
    "label": "NFT Rankings",
    "value": "nft-rankings",
    "subMenus": [
      {
        "label": "Top Collections",
        "value": "top-collections",
        "publicUuid": "a516bea0-325f-4b6d-83a9-383c969eb94c",
      }, {
        "label": "Top Marketplaces",
        "value": "top-marketplaces",
        "publicUuid": "4566e4ff-636d-4e9b-b479-e330eb0bec01",
      }, {
        "label": "Top Chains",
        "value": "top-chains",
        "publicUuid": "694e6a3d-7b4c-4863-8b0a-87f517f1c48b",
      }, {
        "label": "Newly Added",
        "value": "newly-added",
        "publicUuid": "a3faa3d4-b306-4105-b653-35b74f9011cd",
        "type": "chart",
      }, {
        "label": "Top Collections by Royalty",
        "value": "top-collections-by-royalty",
        "publicUuid": "f3bbc1b3-cbaa-4f85-8b7b-7be25ac48ec3",
        "type": "chart",
      }, {
        "label": "Top Wallet Address by Trading Value",
        "value": "top-wallet-address-by-trading-value",
        "publicUuid": "0d409482-14df-4de0-a3be-862aca1021c2",
        "type": "chart",
        "search": "block_timestamp=past7days",
      }, {
        "label": "Top Buyers List",
        "value": "top-buyers-list",
        "publicUuid": "341c99ec-f226-4fc9-8f4f-3ab54bda92e7",
        "type": "chart",
      }, {
        "label": "Top Sellers List",
        "value": "top-sellers-list",
        "publicUuid": "9e9f179e-6748-424a-a2d2-de3639377fb5",
        "type": "chart",
      },
    ],
  },
  {
    "label": "NFT Signals",
    "value": "nft-signals",
    "subMenus": [
      {
        "label": "Trending",
        "value": "trending",
        "publicUuid": "c4bc6cf6-ba29-4c3c-af18-8ea224d1740e",
      }, {
        "label": "Hot Mints",
        "value": "hot-mints",
        "publicUuid": "f2d99351-3a14-40df-923c-f3877639c4bc",
      }, {
        "label": "Sweeps",
        "value": "sweeps",
        "publicUuid": "46f89c33-a9f1-42ac-896d-ffa8d21d74a5",
      }, {
        "label": "Top Sales",
        "value": "top-sales",
        "publicUuid": "41f7fb51-cc98-48ef-b481-ec5675eeb1d2",
      },
    ],
  },
  {
    "label": "NFT Market",
    "value": "nft-market",
    "subMenus": [
      {
        "label": "Market Overview",
        "value": "market-overview",
        "publicUuid": "25e7f940-7fc8-4737-bcfa-d4b04a4b6196",
      }, {
        "label": "Chains Stats",
        "value": "chains-stats",
        "publicUuid": "abdf77b3-c267-4ef8-917d-29eba13f5832",
      }, {
        "label": "Single Chain",
        "value": "single-chain",
        "publicUuid": "ee0dbd21-8f80-49a1-a02c-686ec1c6eb3d",
      }, {
        "label": "Marketplaces",
        "value": "marketplaces",
        "publicUuid": "80872681-40b2-4344-8c8b-c4b68826c184",
      }, {
        "label": "Collections",
        "value": "collections",
        "publicUuid": "2538542f-efcf-4399-bc3d-d0bfe97e33a8",
      }, {
        "label": "Royalty",
        "value": "royalty",
        "publicUuid": "c485c035-5688-4371-9943-0752d1152bce",
      },
      /*{
        "label": "Aggregators Overview",
        "value": "aggregators-overview",
        "publicUuid": "b79c6adb-a387-474b-973d-921a8022ebc9",
      }, {
        "label": "Aggregators",
        "value": "aggregators",
        "publicUuid": "52b5f658-5a06-4de3-9242-8470c87bdde5",
      },*/
    ],
  }, {
    "label": "NFT Collections",
    "value": "nft-collections",
    "subMenus": [
      {
        "label": "Single Collection",
        "value": "single-collection",
        "publicUuid": "4f2c0f87-57ff-4f0f-b63e-5e7addb93da7",
      },
    ],
  },
  {
    "label": "NFT Marketplace",
    "value": "nft-marketplace",
    "subMenus": [
      {
        "label": "Single Marketplace",
        "value": "single-marketplace",
        "publicUuid": "f464b6dd-83b5-4f94-a659-737de62b0599",
      },
    ],
  },
  {
    "label": "NFT Wash Trading Stats",
    "value": "nft-wash-trade-stats",
    "subMenus": [
      {
        "label": "Wash Trading Overview",
        "value": "wash-trade-overview",
        "publicUuid": "723ace6e-f7de-4f70-86a5-4788a6c0a18a",
      },
      {
        "label": "Top Most Wash Trading Collections",
        "value": "top-most-wash-trading-collections",
        "publicUuid": "d922939c-c451-41eb-8d29-b94e7109c9dd",
      },
      {
        "label": "Top Most Wash Trading Bluechip Collections",
        "value": "top-most-wash-trading-bluechip-collections",
        "publicUuid": "b9167f1e-c391-473d-a1d8-23a1b8691ff7",
      },
      {
        "label": "Top Wash Trading Wallet Addresses",
        "value": "top-wash-trading-wallet-addresses",
        "publicUuid": "3e83bba9-6b4f-4ac3-b8ab-01d07467c89d",
      },
      {
        "label": "Wash Trading on Marketplaces",
        "value": "wash-trading-on-marketplaces",
        "resources": [
          {
            "publicUuid": "b99c103e-8a85-497f-b5cb-8434567260d0",
            "label": "Wash Trading on OpenSea",
            "value": "opensea",
            "image": "dashboard/7205.png",
          },
          {
            "publicUuid": "bf226577-5119-4fc4-8244-43e5b73b8994",
            "label": "Wash Trading on Looksrare",
            "value": "looksrare",
            "image": "dashboard/7207.png",
          },
          {
            "publicUuid": "ee17bfb9-47bb-4d49-8671-e46134475713",
            "label": "Wash Trading on X2Y2",
            "value": "x2y2",
            "image": "dashboard/7206.png",
          },
        ],
      },
    ],
  }, {
    "label": "Fundraising",
    "value": "fundraising",
    "subMenus": [
      {
        "label": "Fundraising Overview",
        "value": "fundraising-overview",
        "publicUuid": "dd43842b-224d-415b-a021-a4f07166368c",
      },
      {
        "label": "Fundraising List",
        "value": "fundraising-list",
        "publicUuid": "117c717a-acff-458b-b285-fbfd7bf015d4",
        "type": "chart",
      },
    ],
  },
  {
    "label": "Themetic analysis",
    "value": "themetic-analysis",
    "subMenus": [
      {
        "label": "Blur Airdrop",
        "value": "blur-airdrop",
        "publicUuid": "37c8520e-bd79-4fe1-8667-5c4ab73cf79b",
      },
      {
        "label": "NFT Airdrop Monitoring",
        "value": "nft-airdrop-monitoring",
        "publicUuid": "d277320d-bd8c-4261-a15d-f1230e0acc40",
      },
    ],
  },
];

const gamefiData = [
  {
    "label": "Game Rankings",
    "value": "game-rankings",
    "subMenus": [
      {
        "label": "Top Games",
        "value": "top-games",
        "publicUuid": "d8e8ac13-bc3f-4cc6-9368-4168d52beeb5",
      },
      {
        "label": "Game Tokens",
        "value": "game-tokens",
        "publicUuid": "db808eeb-3709-4a75-8a9b-418236b5b707",
      },
      {
        "label": "GameFi Market Leaderboard",
        "value": "gamefi-market-leaderboard",
        "publicUuid": "9c2cf0ca-de0a-4699-9a6c-cd24ffd6252c",
      },
      {
        "label": "Hot Games on Ethereum",
        "value": "hot-games-on-ethereum",
        "publicUuid": "b61310f5-7775-4415-b604-6e8b74d44256",
        "search": "?date=past7days",
      },
      {
        "label": "Hot Games on Polygon",
        "value": "hot-games-on-polygon",
        "publicUuid": "b61310f5-7775-4415-b604-6e8b74d44256",
        "search": "?chain=Polygon&date=past7days",
      },
      {
        "label": "Hot Games on BNB",
        "value": "hot-games-on-bnb",
        "publicUuid": "b61310f5-7775-4415-b604-6e8b74d44256",
        "search": "?chain=BNB%20Chain&date=past7days",
      },
      {
        "label": "Hot Games on Arbitrum",
        "value": "hot-games-on-arbitrum",
        "publicUuid": "b61310f5-7775-4415-b604-6e8b74d44256",
        "search": "?chain=Arbitrum&date=past7days",
      },
    ],
  },
  {
    "label": "In-Game NFT Rankings",
    "value": "in-game-nft-rankings",
    "subMenus": [
      {
        "label": "Top In-Game NFT on Ethereum",
        "value": "top-in-game-nft-on-ethereum",
        "publicUuid": "50b5948d-de7f-4161-843a-f497f9fbe575",
      },
      {
        "label": "Top In-Game NFT on Polygon",
        "value": "top-in-game-nft-on-polygon",
        "publicUuid": "0e4c60f0-b91f-40cf-b6e1-d59409cde609",
      },
      {
        "label": "Top In-Game NFT on BNB",
        "value": "top-in-game-nft-on-bnb",
        "publicUuid": "019b3291-5514-4dcf-98f5-ad45ed4c935d",
      },
    ],
  },
  {
    "label": "Game Overview",
    "value": "game-overview",
    "subMenus": [
      {
        "label": "Game Market",
        "value": "game-market",
        "publicUuid": "deba0706-064b-478b-b34b-86d8a7350df2",
      },
      {
        "label": "Chain Stats",
        "value": "chain-stats",
        "publicUuid": "fe3ddee1-1f8f-41bf-9a79-9241077d904b",
      },
      {
        "label": "Single Chain",
        "value": "single-chain",
        "publicUuid": "f37919b4-977b-4a35-9b43-ff29c02e6ba9",
      },
    ],
  },
  {
    "label": "Game Protocols",
    "value": "game-protocols",
    "subMenus": [
      {
        "label": "Single Game Stats",
        "value": "single-game-stats",
        "publicUuid": "1f882ec5-0fa7-4d9b-aafd-4ba21458e3fb",
      },
    ],
  },
  {
    "label": "Fundraising",
    "value": "fundraising",
    "subMenus": [
      {
        "label": "Fundraising Overview",
        "value": "fundraising-overview",
        "publicUuid": "3b7a049d-c3c2-4101-9bca-7b6f0e09cc14",
      },
      {
        "label": "Fundraising List",
        "value": "fundraising-list",
        "publicUuid": "fc2068cc-7b8c-4781-a1f7-c491626d876a",
        "type": "chart",
      },
    ],
  },
  {
    "label": "Themetic analysis",
    "value": "themetic-analysis",
    "subMenus": [
      {
        "label": "Gamer Profile",
        "value": "gamer-profile",
        "publicUuid": "aca032dc-5faf-462a-8be5-124d68226328",
      },
      {
        "label": "GameFi NFT Stats",
        "value": "gamefi-nft-stats",
        "publicUuid": "eb7d6ff7-6c76-4160-ba88-62a42232f86b",
      },
    ],
  },
  {
    "label": "Featured Dashboards",
    "value": "featured-dashboards",
    "subMenus": [
      {
        "label": "PlanetIX Data Overview",
        "value": "planetix-data-overview",
        "publicUuid": "ec71fc42-2db4-43c6-9b9b-c06fc789758e",
      },
      {
        "label": "PlanetIX Assets Tracker",
        "value": "planetix-assets-tracker",
        "publicUuid": "be1e7872-0c20-4188-b683-dbe429fc961d",
      },
      /*{
        "label": "Walken Data Overview",
        "value": "walken-data-overview",
        "publicUuid": "0bc7f1b3-feb1-430a-9596-5a513c3fd216",
      },*/
      {
        "label": "Era7 Key Metrics",
        "value": "era7-key-metrics",
        "publicUuid": "879d17b3-fa17-477a-a7f4-b21b9381f3c3",
      },
      /*{
        "label": "Solana GameFi Overview",
        "value": "solana-gamefi-overview",
        "publicUuid": "022aa15f-40c7-4dc2-95be-bc498c9114fd",
      },*/
      {
        "label": "GAMEE Health",
        "value": "gamee-health",
        "publicUuid": "83cb8c4e-6755-4e9a-9dc1-2c96979f8e95",
      },
      {
        "label": "Stats about GameFi from 2022",
        "value": "stats-about-gamefi-from-2022",
        "publicUuid": "9642de24-1795-40cc-ab47-24418690b727",
      },
      {
        "label": "GameFi Weekly Dashboard",
        "value": "gamefi-weekly-dashboard",
        "publicUuid": "5e7798d2-be24-428b-8792-a926b4822012",
      },
      {
        "label": "GameFi Metrics",
        "value": "gamefi-metrics",
        "publicUuid": "e4a95701-0f0b-4593-bd6e-2a441660c555",
      },
    ],
  },
]

const chainData = [
  {
    "label": "Chain Rankings",
    "value": "chain-rankings",
    "subMenus": [
      {
        "label": "Top Chains",
        "value": "top-chains",
        "publicUuid": "83af3336-a4d4-4ba6-8d83-c7080a27de2a",
        "type": "chart",
      },
    ],
  },
  {
    "label": "Chain Stats",
    "value": "chain-stats",
    "subMenus": [
      {
        "label": "Ethereum Overview",
        "value": "ethereum-overview",
        "publicUuid": "9996a833-d601-4cab-9685-283ae1f7ea3c",
      },
      {
        "label": "BNB Chain Overview",
        "value": "bnb-chain-overview",
        "publicUuid": "f0ab345a-e86c-45c9-ae5f-6be93e717012",
      },
      {
        "label": "Avalanche Overview",
        "value": "avalanche-overview",
        "publicUuid": "02224360-662d-43ac-9633-b89cf2b8c59d",
      },
      {
        "label": "Polygon Overview",
        "value": "polygon-overview",
        "publicUuid": "36d92106-55be-4c4a-bb23-9da368d8e7d4",
      },
      {
        "label": "Optimism Overview",
        "value": "optimism-overview",
        "publicUuid": "075e8eab-bc83-4b46-9051-08acdd65a91d",
      },
      {
        "label": "Starknet Overview",
        "value": "starknet-overview",
        "publicUuid": "d3e53215-fa4f-4264-a012-71952b5ecb6c",
      },
      {
        "label": "Fantom Overview",
        "value": "fantom-overview",
        "publicUuid": "3117dbba-0872-448a-bce5-7dd3454046c6",
      },
      {
        "label": "Boba Network Overview",
        "value": "boba-network-overview",
        "publicUuid": "f46cb011-db68-4228-9f3d-ce8f20e6819b",
      },
      {
        "label": "Harmony Overview",
        "value": "harmony-overview",
        "publicUuid": "f58fcef6-b8f4-4b60-9a38-41ea0d9d38d4",
      },
      {
        "label": "Moonriver Overview",
        "value": "moonriver-overview",
        "publicUuid": "5b9678ea-477c-4615-aaac-a01504d5da68",
      },
      {
        "label": "Moonbeam Overview",
        "value": "moonbeam-overview",
        "publicUuid": "473805df-49ee-4ec4-a8b4-e483f5108664",
      },
      {
        "label": "Celo Overview",
        "value": "celo-overview",
        "publicUuid": "320b1212-214a-484c-a445-595d54e3e663",
      },
      {
        "label": "DFK Overview",
        "value": "dfk-overview",
        "publicUuid": "cce7e0b7-2d7e-4454-8f2a-64afe9e99ade",
      },
      {
        "label": "Ronin Overview",
        "value": "ronin-overview",
        "publicUuid": "a903e63d-f71c-4ea1-87b1-827d1faccb46",
      },
      {
        "label": "MCH Verse GameFi Overview",
        "value": "mch-verse-gamefi-overview",
        "publicUuid": "f0b59b4a-9b38-4745-9a15-1e1c47052d2d",
      },
      /*{
        "label": "IoTex Overview",
        "value": "iotex-overview",
        "publicUuid": "1a1e160e-4414-417a-a04a-54646f86e42d",
      },*/
      {
        "label": "Arbitrum Overview",
        "value": "arbitrum-overview",
        "publicUuid": "1a3b2077-06c7-41a8-9ba3-4598ff5e3b30",
      },
      {
        "label": "Cronos Overview",
        "value": "cronos-overview",
        "publicUuid": "70849eb6-aa3d-475f-8f76-acd85320f6f9",
      },
      {
        "label": "Thundercore Overview",
        "value": "thundercore-overview",
        "publicUuid": "912bb075-9468-49f9-8c04-542c84cc20ef",
      },
      {
        "label": "Oasys Overview",
        "value": "oasys-overview",
        "publicUuid": "e7547583-dacc-4794-9c09-deab7364c9fb",
      },
      /*{
        "label": "Hive Overview",
        "value": "hive-overview",
        "publicUuid": "3cf8c067-c63b-4a88-a74e-cc34096d0af5",
      },*/
      {
        "label": "zkSync Era Overview",
        "value": "zksync-era-overview",
        "publicUuid": "89b91903-fcfc-4122-978b-62c7a3ba3f41",
      },
    ],
  },
  {
    "label": "Chain Ecosystem",
    "value": "chain-ecosystem",
    "subMenus": [
      {
        "label": "Chain Overview",
        "value": "chain-overview",
        "publicUuid": "9e0a1aa1-eeae-4608-b77d-cf23271d92a1",
      },
      {
        "label": "Chain Comparison",
        "value": "chain-comparison",
        "publicUuid": "79eaf62d-95ac-4838-b34d-3cfdbdf3fa18",
      },
    ],
  },
  {
    "label": "Bridge Stats",
    "value": "bridge-stats",
    "subMenus": [
      {
        "label": "Bridge Overview",
        "value": "bridge-overview",
        "publicUuid": "5e10b775-d392-4ec3-b449-6758456f005c",
      },
      {
        "label": "Bridge by Chain",
        "value": "bridge-by-chain",
        "publicUuid": "154f7853-646a-4e3f-95a7-6239e9ba7d8b",
      },
      {
        "label": "Bridge Key Stats",
        "value": "bridge-key-stats",
        "publicUuid": "e35d6071-5f1d-4c62-8ba9-6c2e41c67c52",
      },
    ],
  },
  {
    "label": "Featured Dashboards",
    "value": "featured-dashboards",
    "subMenus": [
      {
        "label": "Bitcoin Chain Stats",
        "value": "bitcoin-chain-stats",
        "publicUuid": "3211cede-f9d4-4f59-8e4e-393561d38340",
      },
      {
        "label": "Harmony Stats",
        "value": "harmony-stats",
        "publicUuid": "280fd659-a3bf-4183-97bf-e6d9be075870",
      },
      /*{
        "label": "Solana GameFi Overview",
        "value": "solana-gamefi-overview",
        "publicUuid": "022aa15f-40c7-4dc2-95be-bc498c9114fd",
      },*/
      {
        "label": "Polygon Deep Dive",
        "value": "polygon-deep-dive",
        "publicUuid": "5e0b0446-4395-4974-8079-b3341e5954bc",
      },
      {
        "label": "LayerZero Key Stats",
        "value": "layerzero-key-stats",
        "publicUuid": "9f3987d5-ea2a-4447-9b9b-89f5efdb6e86",
      },
      {
        "label": "zkSync Bridge Stats",
        "value": "zksync-bridge-stats",
        "publicUuid": "e6d450d4-1571-4261-8f4b-ca4e87fe81bc",
      },
      {
        "label": "zkSync Address Checker",
        "value": "zksync-address-checker",
        "publicUuid": "375354e5-8fc0-4858-b075-6a1defa0093f",
      },
      {
        "label": "StarkNet Bridge Stats",
        "value": "starknet-bridge-stats",
        "publicUuid": "d3e53215-fa4f-4264-a012-71952b5ecb6c",
      },
      {
        "label": "StarkNet Address Checker",
        "value": "starknet-address-checker",
        "publicUuid": "74dc2c6f-b2f7-4445-bfb9-968e5adbc3b4",
      },
      {
        "label": "OASYS Stats",
        "value": "oasys-stats",
        "publicUuid": "b9554960-7f9a-4052-ac12-ccb026ff823d",
      },
    ],
  },
]

const walletData = [
  {
    "label": "Wallet Tracker",
    "value": "wallet-tracker",
    "subMenus": [
      {
        "label": "NFT Trades of Wallet",
        "value": "nft-trades-of-wallet",
        "publicUuid": "050bea21-f999-44c5-b6aa-be7ac68274ff",
      },
      {
        "label": "Gamer Profile of Wallet",
        "value": "gamer-profile-of-wallet",
        "publicUuid": "69b1113b-8bfa-451d-a2f4-d540942a6279",
      },
      {
        "label": "Money Flow of Wallet",
        "value": "money-flow-of-wallet",
        "publicUuid": "3ed912f6-4c65-464e-93a1-4ad86c656689",
      },
    ],
  },
]

const customData = {
  partner: [
    {
      "label": "GameFi Market",
      "value": "gamefi-market",
      "subMenus": [
        {
          "label": "Market Overview",
          "value": "market-overview",
          "publicUuid": "db6aac3e-48e4-4465-87b2-94be114475aa",
        },
        {
          "label": "Chain Stats",
          "value": "chain-stats",
          "publicUuid": "fe3ddee1-1f8f-41bf-9a79-9241077d904b",
        },
        {
          "label": "Single Chain",
          "value": "single-chain",
          "publicUuid": "f37919b4-977b-4a35-9b43-ff29c02e6ba9",
        },
      ],
    },
    {
      "label": "Top Games",
      "value": "top-games",
      "publicUuid": "d8e8ac13-bc3f-4cc6-9368-4168d52beeb5",
    },
    {
      "label": "Trending Marketplaces",
      "value": "trending-marketplaces",
      "publicUuid": "253fee18-97da-496b-833b-3d2a46516ec8",
    }
  ]
}

const metaObject = {
  "nft": {
    title: "NFT Research | Unlock the power of data",
    description: "Covers all the NFT data you need from industry overview to individual NFTs with insightful metrics, such as NFT \n" +
      "Wash Trading, Blue Chip, Royalty Fee, Floor Price and more.",
    keywords: "NFT Research, NFT data, NFT Wash Trading, NFT Blue Chip, NFT Royalty, NFT Floor Price, Top Buyers, Top Sellers, Top Sales, NFT Fundraising",
  },
  "gamefi": {
    title: "GameFi Research | All in one research tool",
    description: "Covers all the GameFi data you need from industry overview to individual games with insightful metrics, such as gamers, in-game nft holders, Gamer Profile and more ",
    keywords: "GameFi Research, GameFi data, Web3 Gaming, In-game NFT, Gamer profile, GameFi Fundraising, Game Chain, GameFi report, Game tokenomics",
  },
  "chain": {
    title: "Chain Research | Built by researcher for researchers",
    description: "Covering most chains and support from real-time raw data to analytic metrics",
    keywords: "Chain Ecosystem, Chain Research, Blockchain industry, chain transaction data, chain token transfer data, chain events, chain log, Chain Gas Fee",
  },
  "wallet": {
    title: "Wallet Research | Built by researcher for researchers",
    description: "Covers all the wallets data you need from industry overview to individual wallets with insightful metrics, such as money flow",
    keywords: "NFT Trades of Wallet, Gamer Profile of Wallet, Money Flow of Wallet",
  },
}

const data = {
  "nft": nftData,
  "gamefi": gamefiData,
  "chain": chainData,
  "wallet": walletData,
  "custom": customData,
  "metaObject": metaObject,
}


export default data;
