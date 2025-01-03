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
      },
      /*{
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
      },*/
      {
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
  /*{
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
  },*/
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
      },
      {
        "label": "Marketplaces",
        "value": "marketplaces",
        "publicUuid": "80872681-40b2-4344-8c8b-c4b68826c184",
      },
      {
        "label": "Single Chain",
        "value": "single-chain",
        "publicUuid": "ee0dbd21-8f80-49a1-a02c-686ec1c6eb3d",
      },
      /*{
        "label": "Collections",
        "value": "collections",
        "publicUuid": "2538542f-efcf-4399-bc3d-d0bfe97e33a8",
      }, */
      {
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
      /*{
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
      },*/
    ],
  },
  /*{
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
  },*/
  {
    "label": "Themetic analysis",
    "value": "themetic-analysis",
    "subMenus": [
      {
        "label": "Blur Airdrop",
        "value": "blur-airdrop",
        "publicUuid": "37c8520e-bd79-4fe1-8667-5c4ab73cf79b",
      },
      /*{
        "label": "NFT Airdrop Monitoring",
        "value": "nft-airdrop-monitoring",
        "publicUuid": "d277320d-bd8c-4261-a15d-f1230e0acc40",
      },*/
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
        "label": "Games Token Leaderboard",
        "value": "gamefi-market-leaderboard",
        "publicUuid": "9c2cf0ca-de0a-4699-9a6c-cd24ffd6252c",
      },
      /*{
        "label": "Hot Games on Polygon",
        "value": "hot-games-on-polygon",
        "publicUuid": "b61310f5-7775-4415-b604-6e8b74d44256",
        "search": "?chain=Polygon",
      },
      {
        "label": "Hot Games on BNB",
        "value": "hot-games-on-bnb",
        "publicUuid": "b61310f5-7775-4415-b604-6e8b74d44256",
        "search": "?chain=BNB%20Chain",
      },
      {
        "label": "Hot Games on Ronin",
        "value": "hot-games-on-ronin",
        "publicUuid": "b61310f5-7775-4415-b604-6e8b74d44256",
        "search": "?chain=Ronin",
      },
      {
        "label": "Hot Games on Ethereum",
        "value": "hot-games-on-ethereum",
        "publicUuid": "b61310f5-7775-4415-b604-6e8b74d44256",
        "search": "",
      },
      {
        "label": "Hot Games on Arbitrum",
        "value": "hot-games-on-arbitrum",
        "publicUuid": "b61310f5-7775-4415-b604-6e8b74d44256",
        "search": "?chain=Arbitrum",
      },*/
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
  /*{
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
  },*/
  /*{
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
  },*/
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
      {
        "label": "Matr1X Dashboard",
        "value": "matr1x-dashboard",
        "publicUuid": "776a8b27-e444-4bac-9545-2d90c6b1cb84",
      },
      {
        "label": "Pixels",
        "value": "pixels",
        "publicUuid": "58aac148-93d3-4c03-b870-c38cd58a22dd",
      },
      {
        "label": "Pixels-Token",
        "value": "pixels-token",
        "publicUuid": "f574f7f2-07cd-4cd7-91b7-4b95e29f523f",
      },
      {
        "label": "Axie Infinity",
        "value": "axie-infinity",
        "publicUuid": "93405c28-9073-430a-ac9f-6a038752d866",
      },
      /*{
        "label": "Walken Data Overview",
        "value": "walken-data-overview",
        "publicUuid": "0bc7f1b3-feb1-430a-9596-5a513c3fd216",
      },*/
      /*{
        "label": "Era7 Key Metrics",
        "value": "era7-key-metrics",
        "publicUuid": "879d17b3-fa17-477a-a7f4-b21b9381f3c3",
      },*/
      /*{
        "label": "Solana GameFi Overview",
        "value": "solana-gamefi-overview",
        "publicUuid": "022aa15f-40c7-4dc2-95be-bc498c9114fd",
      },*/
      /*{
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
      },*/
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
    "label": "Chain Ecosystem",
    "value": "chain-ecosystem",
    "subMenus": [
      {
        "label": "Chain Overview",
        "value": "chain-overview",
        "publicUuid": "9e0a1aa1-eeae-4608-b77d-cf23271d92a1",
      },
      {
        "label": "Cross Chains",
        "value": "cross-chains",
        "publicUuid": "514f0b14-dac6-4cb1-88aa-f74c3423e531",
      },
      {
        "label": "Ethereum L2 Bridge Stats",
        "value": "layer-2-overview",
        "publicUuid": "79d8dc98-884b-448f-8d90-7baf3fa91e11",
      },
      {
        "label": "Bitcoin Sidechains",
        "value": "bitcoin-sidechains",
        "publicUuid": "5564237c-e6be-4293-b18b-acc28c11891d",
      },
      {
        "label": "Bitcoin Bridge Overview",
        "value": "bitcoin-bridge-overview",
        "publicUuid": "c1a9c758-013b-4935-8209-89d14719289b",
      },
      {
        "label": "Ordinals Inscriptions",
        "value": "ordinals-inscriptions",
        "publicUuid": "a68d736b-10f1-4dc5-9353-abf725b4f853",
      },
      {
        "label": "Bitcoin Runes",
        "value": "bitcoin-runes",
        "publicUuid": "d7759176-6d7b-4bae-b875-cc1307162bfd",
      },
    ],
  },
  {
    "label": "BTC Ecosystem Stats",
    "value": "btc-ecosystem-stats",
    "subMenus": [
      {
        "label": "Bitcoin Overview",
        "value": "bitcoin-overview",
        "publicUuid": "27a3407e-97f0-4e2e-9ad8-2953281246e9",
      },
      {
        "label": "Rootstock Overview",
        "value": "rootstock-overview",
        "publicUuid": "5ce34ecd-e67c-49cb-8d1d-e84b0028a592",
      },
      {
        "label": "Merlin Overview",
        "value": "merlin-overview",
        "publicUuid": "61025077-2037-465f-900e-2032eb446f30",
      },
      {
        "label": "Core Chain Overview",
        "value": "core-chain-overview",
        "publicUuid": "94c0e936-0ce5-4260-a337-c303221aa2e3",
      },
    ],
  },
  {
    "label": "EVM Chain Stats",
    "value": "evm-chain-stats",
    "subMenus": [
      {
        "label": "Ronin Overview",
        "value": "ronin-overview",
        "publicUuid": "a903e63d-f71c-4ea1-87b1-827d1faccb46",
      },
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
        "label": "Merlin Overview",
        "value": "merlin-overview",
        "publicUuid": "61025077-2037-465f-900e-2032eb446f30",
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
      /*{
        "label": "IoTex Overview",
        "value": "iotex-overview",
        "publicUuid": "1a1e160e-4414-417a-a04a-54646f86e42d",
      },*/
      {
        "label": "Oasys Overview",
        "value": "oasys-overview",
        "publicUuid": "8feb911d-0055-4dae-9d12-e0e05860df07",
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

      {
        "label": "Taiko Overview",
        "value": "taiko-overview",
        "publicUuid": "6e219d31-0601-43c0-90ca-b570f6c90584",
      },
      {
        "label": "Arbitrum One Overview",
        "value": "arbitrum-overview",
        "publicUuid": "7b26e0e3-969e-4bbf-93e2-fb470295017b",
      },
      {
        "label": "Arbitrum Nova Overview",
        "value": "arbitrum-nova-overview",
        "publicUuid": "b3797059-015a-4d9b-89b2-26802736355c",
      },
      {
        "label": "Core Chain Overview",
        "value": "core-chain-overview",
        "publicUuid": "94c0e936-0ce5-4260-a337-c303221aa2e3",
      },


      {
        "label": "Fantom Overview",
        "value": "fantom-overview",
        "publicUuid": "3117dbba-0872-448a-bce5-7dd3454046c6",
      },
      {
        "label": "Boba Overview",
        "value": "boba-network-overview",
        "publicUuid": "f46cb011-db68-4228-9f3d-ce8f20e6819b",
      },
      // {
      //   "label": "Harmony Overview",
      //   "value": "harmony-overview",
      //   "publicUuid": "f58fcef6-b8f4-4b60-9a38-41ea0d9d38d4",
      // },
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
        "label": "MCH Verse GameFi Overview",
        "value": "mch-verse-gamefi-overview",
        "publicUuid": "f0b59b4a-9b38-4745-9a15-1e1c47052d2d",
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
      // {
      //   "label": "Nautilus Overview",
      //   "value": "nautilus-overview",
      //   "publicUuid": "62908ce3-43e2-450f-89c1-a1066ba1e7fe",
      // },
      {
        "label": "Home Verse Overview",
        "value": "home-verse-overview",
        "publicUuid": "c79ec4ee-74c3-47ba-942c-5e351f3c2ff3",
      },
      {
        "label": "Combo Overview",
        "value": "combo-overview",
        "publicUuid": "be8e0a03-96c3-4f6f-8e3b-871561ba6139",
      },
      {
        "label": "Gravity Overview",
        "value": "gravity-overview",
        "publicUuid": "93139f09-c242-43d2-a7a7-db5608db3cc9",
      },
      {
        "label": "Viction Overview",
        "value": "viction-overview",
        "publicUuid": "c69708db-158a-479f-95dc-71ec40700456",
      },
    ],
  },
  {
    "label": "Non-EVM Stats",
    "value": "non-evm-stats",
    "subMenus": [
      {
        "label": "Sui Overview",
        "value": "sui-overview",
        "publicUuid": "e569cb10-4132-46db-a391-3803feb3a203",
      },
      {
        "label": "Starknet Overview",
        "value": "starknet-overview",
        "publicUuid": "d3e53215-fa4f-4264-a012-71952b5ecb6c",
      },
      {
        "label": "Rootstock Overview",
        "value": "rootstock-overview",
        "publicUuid": "5ce34ecd-e67c-49cb-8d1d-e84b0028a592",
      },
      {
        "label": "GalaChain Overview",
        "value": "gala-chain-overview",
        "publicUuid": "6bb33916-a512-42ad-9d90-8c834e29e9cf",
      },
      {
        "label": "Solana Overview",
        "value": "solana-overview",
        "publicUuid": "f45e8d8d-8b51-42d8-9d6c-4dd8396f7987",
      },
      {
        "label": "Tron Overview",
        "value": "tron-overview",
        "publicUuid": "8b795c6b-9034-45eb-87d1-1c3b59dce2fc",
      },
    ],
  },
  /*{
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
  },*/
  {
    "label": "Featured Dashboards",
    "value": "featured-dashboards",
    "subMenus": [
      /*{
        "label": "Harmony Stats",
        "value": "harmony-stats",
        "publicUuid": "280fd659-a3bf-4183-97bf-e6d9be075870",
      },
      {
        "label": "Solana GameFi Overview",
        "value": "solana-gamefi-overview",
        "publicUuid": "022aa15f-40c7-4dc2-95be-bc498c9114fd",
      },
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
      },*/
      {
        "label": "Chain Comparison",
        "value": "chain-comparison",
        "publicUuid": "79eaf62d-95ac-4838-b34d-3cfdbdf3fa18",
      },
    ],
  },
]

const tokenData = [
  {
    "label": "Rankings",
    "value": "rankings",
    "subMenus": [
      {
        "label": "Top Tokens by Market Cap",
        "value": "top-tokens-by-market-cap",
        "chain": "ethereum",
        "publicUuid": "d76afe6f-0405-4aea-942e-32debdf83461",
      },
      {
        "label": "Token Exchange Net Flow",
        "value": "token-exchange-net-flow",
        "chain": "ethereum",
        "publicUuid": "04dca6c5-272c-4e7f-994d-53127866a9c1",
      },
      {
        "label": "Top Tokens Traded on DEX",
        "value": "top-tokens-traded-on-dex",
        "chain": "ethereum",
        "publicUuid": "42412c92-c181-4cac-8c41-e8a1180a9220",
      },
      {
        "label": "Top Tokens by Volume",
        "value": "top-tokens-by-volume",
        "chain": "ethereum",
        "publicUuid": "bd12acce-a17a-4c3a-9508-c753140985f6",
      },
      {
        "label": "Top Tokens by Market Cap",
        "value": "top-tokens-by-market-cap-bsc",
        "chain": "bsc",
        "type": "chart",
        "publicUuid": "52fc7568-36ff-4b1f-a53e-e356bd10ed3d",
      },
      {
        "label": "Top Tokens Traded on DEX",
        "value": "top-tokens-traded-on-dex-bsc",
        "chain": "bsc",
        "publicUuid": "ef67311a-38fc-4134-9c67-b721c19d7bdc",
      },
    ],
  },
  {
    "label": "Token",
    "value": "token",
    "subMenus": [
      {
        "label": "Single Token",
        "value": "single-token",
        "chain": "ethereum",
        "publicUuid": "e12085c8-a2e4-455d-b9bf-51df33bf78dc",
      },
      {
        "label": "Token Explorer",
        "value": "token explorer",
        "chain": "bsc",
        "publicUuid": "7a9f997a-77f0-4a5e-9cb1-7d148ef91f3a",
      },
    ],
  },
]

const walletData = [
  {
    "label": "Wallet",
    "value": "wallet",
    "subMenus": [
      {
        "label": "Ethereum Wallet Profile",
        "value": "ethereum-wallet-profile",
        "publicUuid": "bff3c209-9d4c-4e75-96dd-9676b184bbfa",
      },
      {
        "label": "BNB Chain Wallet Profile",
        "value": "bnb-chain-wallet-profile",
        "publicUuid": "346980c4-84ea-42a0-8c0b-cf689aba72bb",
      },
      {
        "label": "Polygon Wallet Profile",
        "value": "polygon-wallet-profile",
        "publicUuid": "13e8e383-4912-4ead-8ae8-926ddba7e89b",
      },
      {
        "label": "Arbitrum Wallet Profile",
        "value": "arbitrum-wallet-profile",
        "publicUuid": "fc2ad6e1-b4bd-40b7-bd01-e3f50eb40686",
      },
      {
        "label": "Arbitrum Nova Wallet Profile",
        "value": "arbitrum-nova-wallet-profile",
        "publicUuid": "ae5dc07f-2c39-49b5-8fe9-73a22cc54f53",
      },
      {
        "label": "Core Wallet Profile",
        "value": "core-wallet-profile",
        "publicUuid": "83e787a8-47e3-4411-898a-973ee3ef575d",
      },
      {
        "label": "Rootstock Wallet Profile",
        "value": "rootstock-wallet-profile",
        "publicUuid": "dcffd5a2-4eea-4c5d-9ea6-a2b83aadc620",
      },
      {
        "label": "Ronin Wallet Profile",
        "value": "ronin-wallet-profile",
        "publicUuid": "0057d3c9-1286-40a3-8f56-43fecfb67793",
      },
      {
        "label": "Starknet Wallet Profile",
        "value": "starknet-wallet-profile",
        "publicUuid": "ceec92e6-79b7-4048-a840-b82766aac48d",
      },
    ],
  },
  {
    "label": "Wallet Name Service",
    "value": "wallet-name-service",
    "subMenus": [
      {
        "label": ".bnb Name Service",
        "value": "bnb-name-service",
        "publicUuid": "ffa180e2-c6dd-4eee-8af2-6417bbe0e78c",
      },
      {
        "label": ".arb Name Service",
        "value": "arb-name-service",
        "publicUuid": "8793a007-adde-4395-a36f-9b777170ee3f",
      },
    ],
  },
  /*{
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
  },*/
]

const defiData = [
  {
    "label": "Dex Protocol",
    "value": "dex-protocol",
    "subMenus": [
      {
        "label": "Single DEX Protocol",
        "value": "single-dex-protocol",
        "publicUuid": "b10579d9-8bf0-4502-87e5-51daf839d837",
      },
      {
        "label": "Dex Pool",
        "value": "dex-pool",
        "publicUuid": "9b70e1f1-981d-4f8d-b81c-a725dc517f27",
      }
    ]
  },
  {
    "label": "DEX Metrics by Chain",
    "value": "dex-metrics-by-chain",
    "subMenus": [
      {
        "label": "DEXes on Merlin",
        "value": "dexes-on-merlin",
        "publicUuid": "ff96c810-28c0-40a0-87bc-75f6335b9807",
        "search": "?chain=Merlin",
      },
      {
        "label": "DEXes on Rootstock",
        "value": "dexes-on-rootstock",
        "publicUuid": "ff96c810-28c0-40a0-87bc-75f6335b9807",
        "search": "?chain=Rootstock",
      }
    ]
  },
  {
    "label": "DEX Overview",
    "value": "dex-overview",
    "subMenus": [
      {
        "label": "DEX Metrics",
        "value": "dex-metrics",
        "publicUuid": "ff96c810-28c0-40a0-87bc-75f6335b9807",
      }
    ]
  },
  {
    "label": "Featured Dashboards",
    "value": "featured-dashboards",
    "subMenus": [
      {
        "label": "Top Meme Tokens",
        "value": "top-meme-tokens",
        "publicUuid": "252bb774-f072-4e1f-8f05-d2f0a235e8e9",
      },
      {
        "label": "BNB Chain Memes Pools Dashboard",
        "value": "bnb-chain-memes-pools-dashboard",
        "publicUuid": "43fe95da-474d-4b2d-b3e8-52a1aea03421",
      }
    ]
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
  "token": {
    title: "Token Research | Stay on top of cryptocurrencies",
    description: "Discover and track high-potential growth tokens with intuitive data and stay ahead in the cryptocurrency market.",
    keywords: "cryptocurrency, Token Money Flow, stablecoin, token tracker",
  },
  "wallet": {
    title: "Wallet Research | Built by researcher for researchers",
    description: "Covers all the wallets data you need from industry overview to individual wallets with insightful metrics, such as money flow",
    keywords: "NFT Trades of Wallet, Gamer Profile of Wallet, Money Flow of Wallet",
  },
  "defi": {
    title: "DeFi Research | Unleash the power of decentralized finance",
    description: "Provides comprehensive DeFi data from industry overviews to individual protocols with insightful metrics, such as Total Value Locked (TVL), Yield Farming, Staking, Liquidity Pools, and more.",
    keywords: "DeFi Research, DeFi data, Total Value Locked, Yield Farming, DeFi Staking, Liquidity Pools, DeFi Protocols, DeFi Analytics, DeFi Markets, DeFi Tokens",
  },
}

const needRefreshDashboard = [
  "5ce34ecd-e67c-49cb-8d1d-e84b0028a592",
  "dd3c5b87-3685-4551-b11e-8a5dc5a00693",
  "e569cb10-4132-46db-a391-3803feb3a203",
  "f37919b4-977b-4a35-9b43-ff29c02e6ba9",
  "d8e8ac13-bc3f-4cc6-9368-4168d52beeb5",
  "7d946d4e-15c6-41da-ad5c-82ffed7b8a30",
  "ee0dbd21-8f80-49a1-a02c-686ec1c6eb3d",
  "f464b6dd-83b5-4f94-a659-737de62b0599",
  "959b833b-d6a3-4191-bf92-c1a15d785de1",
  "be8e0a03-96c3-4f6f-8e3b-871561ba6139",
  "1f882ec5-0fa7-4d9b-aafd-4ba21458e3fb",
  "5aca24eb-aae3-44ef-8e4b-a275fee42847",
  "05628958-0cb8-413c-862e-50b26ffacd6f",
]

const data = {
  "nft": nftData,
  "gamefi": gamefiData,
  "chain": chainData,
  "wallet": walletData,
  "token": tokenData,
  "defi": defiData,
  "custom": customData,
  "metaObject": metaObject,
  "needRefreshDashboard": needRefreshDashboard,
}

export default data;
