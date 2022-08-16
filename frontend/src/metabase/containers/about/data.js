import { getOssUrl } from "metabase/lib/image";
import * as Urls from "metabase/lib/urls";

const data = {
  dashboardNav: [
    { title: "Which Chain Perform Best", query: ["chain"] },
    { title: "Find the Latest or Hot DApps", query: ["top dapps"] },
    { title: "Evaluate Timing to Invest Token", query: ["token"] },
  ],

  sectionList: [
    {
      subTitle:
        "Footprint makes accessible blockchain analytics a reality for anyone",
      desc: "",
      list: [
        {
          title: "No-Code Visualization",
          img: getOssUrl("20220606154848.gif"),
        },
        {
          title: "26+ Types of Charts",
          img: getOssUrl("20220606154902.gif"),
        },
        {
          title: "Add Text, Image & Link",
          img: getOssUrl("20220606154919.gif"),
        },
        {
          title: "Upload Off-chain Data",
          img: getOssUrl("20220606155703.gif"),
        },
        {
          title: "Download Data",
          img: getOssUrl("20220606155721.gif"),
        },
        {
          title: "Custom Columns",
          img: getOssUrl("20220606155803.gif"),
        },
        {
          title: "Excel-like Experience",
          img: getOssUrl("20220606155903.gif"),
        },
      ],
      height: "550px",
      exploreButton: {
        title: "+ Create Dashboard",
        url: "/dashboard/new",
        className: "About__btn--blue mx2",
        auth: true,
      },
    },
  ],
  sectionList2: [
    {
      list: [
        {
          title: "NFT Gallery",
          img: getOssUrl("img_about_data_api_2022081611.png?1"),
          subTitle:
            "Suited for: NFT marketplace, NFT data aggregator, NFT tracker",
          desc:
            "Create custom displays for NFT collections from multiple networks.",
        },
        {
          title: "Find Potential NFTs",
          img: getOssUrl("img_about_data_api_2022081612.png?1"),
          subTitle:
            "Suited for: Capital institutions, Investment/trading institution, Research consultant,",
          desc:
            "Discover the latest hot collections and access in-depth analytics for 70K+ projects.",
        },
        {
          title: "Research & Invest",
          img: getOssUrl("img_about_data_api_2022081613.png?1"),
          subTitle:
            "Suited for: Investment/trading institution, Research consultant, Web2 financial entities",
          desc: "Empower your research or investment with advanced indicators",
        },
        {
          title: "Whale Tracking",
          img: getOssUrl("img_about_data_api_2022081614.png?1"),
          subTitle:
            "Suited for: Investment/trading institution, Crypto portfolio management, Exchange, Crypto wallet",
          desc:
            "Follow and track whales' addresses to identify investment opportunities and potential risks.",
        },
        {
          title: "GameFi Portal",
          img: getOssUrl("img_about_data_api_2022081615.png?1"),
          subTitle: "Suited for: GameFi studios, GameFi tracker, GameFi guilds",
          desc: "A one-stop GameFi information aggregation platform",
        },
        {
          title: "Custom",
          img: getOssUrl("img_about_data_api_2022081616.png?!"),
          subTitle: "",
          desc: "",
          hideBoxShadow: true,
        },
      ],
      height: "470px",
      exploreButton: {
        title: "Get a Free Trial",
        url: "mailto:sales@footprint.network",
        target: "_blank",
        className: "About__btn--blue mx2",
      },
    },
  ],

  backedList: [
    {
      url: "https://matrixpartners.com/",
      logo: "img-matrix-partners.png",
    },
    {
      url: "https://iosg.vc",
      logo: "img-iosg.png",
    },
    {
      url: "https://www.ngc.fund",
      logo: "img-ngc.png",
    },
    {
      url: "https://www.youbicapital.com",
      logo: "img-youbi.png",
    },
    {
      url: "http://www.7xvc.com",
      logo: "img-sevenx.png",
    },
    {
      url: "https://arkstream.capital/#/Home",
      logo: "img-ark-stream.png",
    },
    {
      url: "https://www.redpoint.com",
      logo: "img-redpoint.png",
    },
    {
      url: "https://capitalant.com",
      logo: "img-a-and-t-capital.png",
    },
    {
      url: "https://twitter.com/HashGlobal",
      logo: "img-hash-global.png",
    },
    {
      url: "http://www.lancergrp.com",
      logo: "img-lancer-capital.png",
    },
    {
      url: "https://twitter.com/waterdripfund",
      logo: "img-waterdrip-capital.png",
    },

    {
      url: "https://puzzle.ventures",
      logo: "img-puzzle-ventures.png",
    },
    {
      url: "https://twitter.com/0x_nico0",
      logo: "img-dual-epoch-capital.png",
    },
    {
      url: "https://twitter.com/JarylNgan",
      logo: "img-angel-jary-ngan.png",
    },
    /*{
      url: "https://twitter.com/thejewforu",
      logo: "img-angel-avi-zurlo.png",
    },*/
  ],

  partnerList: [
    {
      url: "https://near.org",
      logo: "img-partner-near.png",
    },
    {
      url: "https://www.polygon.com",
      logo: "img-partner-polygon.png",
    },
    {
      url: "https://www.avax.network",
      logo: "img-avalanche.png",
    },
    {
      url: "https://www.harmony.one",
      logo: "img-harmony.png",
    },
    {
      url: "https://www.footprint.network/dashboard/294",
      logo: "img-partner-curve.png",
    },
    {
      url: "https://www.footprint.network/dashboard/422",
      logo: "img-partner-insta-app.png",
    },
    {
      url: "https://www.footprint.network/dashboard/288",
      logo: "img-partner-b-protocol.png",
    },
    {
      url: "https://www.footprint.network/dashboard/456",
      logo: "img-partner-badger.png",
    },
    {
      url: "https://www.footprint.network/dashboard/291",
      logo: "img-partner-dfx.png",
    },
    {
      url: "https://www.footprint.network/dashboard/468",
      logo: "img-partner-definer.png",
    },
    {
      url: "https://www.cointofu.com",
      logo: "img-partner-coinTofu.png",
    },
    {
      url: "https://cryptoslate.com",
      logo: "img-partner-cryptoslate.png",
    },
    {
      url: "https://www.youtube.com/channel/UC42E-54LCmsclJJ2-LZ7RdA",
      logo: "img-partner-zinstitute.png",
    },
    {
      url: "https://www.ftftx.com",
      logo: "img-partner-ftftx.png",
    },
    {
      url: "https://thejourneywest.io",
      logo: "img-partner-joiurney-west.png",
    },
    {
      url: "https://www.ethalend.org",
      logo: "img-partner-ethalend.png",
    },
    {
      url: "https://www.youtube.com/channel/UCRerMNjpRubIDVqhhHqyCeA",
      logo: "img-partner-superc.png",
    },
    {
      url: "https://blockchain101.com",
      logo: "img-partner-blockchain-nyc.png",
    },
    {
      url: "https://d-core.net",
      logo: "img-partner-d-core.png",
    },
    {
      url: "https://gmx.io",
      logo: "img-partner-gmx.png",
    },
    {
      url: "https://gravityfinance.io/swap",
      logo: "img-partner-gravity.png",
    },
    {
      url: " https://mstable.org",
      logo: "img-partner-mstable.png",
    },
    {
      url: "https://zks.org",
      logo: "img-partner-zkspace.png",
    },
    {
      url: "https://bestdas.com",
      logo: "img-bit.png",
    },
    {
      url: "https://twitter.com/doubletop_io",
      logo: "img-double-top.png",
    },
  ],
  socialData: [
    {
      icon: "twitter_oppo",
      label: "Twitter",
      background: "#00A1F4",
      url: "https://twitter.com/Footprint_Data",
    },
    {
      icon: "discord_oppo",
      label: "Discord",
      background: "#4A70F4",
      url: "https://discord.gg/3HYaR6USM7",
    },
    {
      icon: "telegram_oppo",
      label: "Telegram",
      background: "#00A1F4",
      url: "https://t.me/joinchat/4-ocuURAr2thODFh",
    },
  ],
  startButtonData: [
    {
      title: "Create Dashboard",
      className: "About__btn--dark-blue",
      url: Urls.newQuestion(),
      auth: true,
    },
    {
      title: "Discover Games",
      className: "About__btn--white",
      url: "https://www.footprint.network/@Footprint/GameFi-Dashboard",
    },
    {
      title: "Discover NFT Collections",
      className: "About__btn--white",
      url: "https://www.footprint.network/@0xLam/NFT-Collections",
    },
  ],
  basicData: indicator => [
    {
      title: "Chains",
      total: indicator?.chainsParsed,
      img: getOssUrl("img_about_basic_2022081301.png?3"),
    },
    {
      title: "NFT Collections",
      total: indicator?.nftCollections,
      img: getOssUrl("img_about_basic_2022081302.png?3"),
    },
    {
      title: "Games",
      total: indicator?.gamefiParsedProtocols,
      img: getOssUrl("img_about_basic_2022081303.png?3"),
    },
    {
      title: "Marketplaces",
      total: indicator?.nftParsedMarketplaces,
      img: getOssUrl("img_about_basic_2022081304.png?3"),
    },
  ],
  navListDataChain: [
    {
      title: "Chain List",
      active: true,
      query:
        "https://www.footprint.network/public/chart/Chain-fp-90bb9cd4-33b8-402b-bf0e-cbcc45ed3049",
      url: "https://www.footprint.network/@Footprint/Chain",
    },
    {
      title: "Daily Transaction & Avg Gas Fee",
      query:
        "https://www.footprint.network/public/chart/Daily-Transaction-%26-Avg-Gas-Fee-fp-593ea116-2797-4ff8-8d4b-520626743f38",
      url:
        "https://www.footprint.network/@enmai/Avalaunche-Transaction-Dashbord",
    },
    {
      title: "Stargate",
      query:
        "https://www.footprint.network/public/chart/Stargate-fp-08a9e226-6c84-4408-bf2c-3b5fc4318ce8",
      url: "https://www.footprint.network/@NCL/Stargate-Finance",
    },
  ],
  navListDataGameFi: [
    {
      title: "Game Ranking",
      active: true,
      query:
        "https://www.footprint.network/public/chart/Game-Ranking-fp-5bcb75e9-65b6-4c91-8482-0d2bf998eb4b",
      url: "https://www.footprint.network/@Footprint/GameFi-Dashboard",
    },
    {
      title: "Daily Gamers Trend",
      query:
        "https://www.footprint.network/public/chart/Daily-Gamers-Trend-fp-464ea351-eef7-44b4-921a-b8d3f22248fd",
      url: "https://www.footprint.network/@rogerD/GameFi-Users-Overview",
    },
    {
      title: "Number of GameFi Protocols by Chain",
      query:
        "https://www.footprint.network/public/chart/Number-of-GameFi-Protocols-by-Chain-fp-e4bfcede-a346-4355-b7da-10d988887e99",
      url:
        "https://www.footprint.network/@DamonSalvatore/GameFi-in-Bull-Bear-Market",
    },
  ],
  navListDataNft: [
    {
      title: "Top Marketplaces",
      active: true,
      query:
        "https://www.footprint.network/public/chart/Top-Marketplaces-fp-639ed028-73ce-49b0-a3c0-f0ac56839381",
      url: "https://www.footprint.network/@Footprint/NFT",
    },
    {
      title: "Top Collections ",
      query:
        "https://www.footprint.network/public/chart/Top-Collections-(30D)-fp-f87c0c3d-fe87-4faf-9dc7-8b62620b9f40",
      url: "https://www.footprint.network/@Footprint/NFT-Marketplace",
    },
    {
      title: "NFT Volume by Marketplaces",
      query:
        "https://www.footprint.network/public/chart/30D-NFT-Volume-by-Marketplaces-fp-17f1d52d-9ab7-4970-a40e-4c083c260768",
      url:
        "https://www.footprint.network/@0xLam/NFT-Marketplaces-X2Y2-OpenSea-LooksRare",
    },
  ],
};

export default data;
