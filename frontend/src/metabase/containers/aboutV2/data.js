import { getOssUrl } from "metabase/lib/image";
import * as Urls from "metabase/lib/urls";

const data = {
  backedList: [
    {
      url: "https://iosg.vc",
      logo: "home-v2/img_best_1.png",
      title: "IOSG Ventures",
    },
    {
      url: "https://matrixpartners.com/",
      logo: "home-v2/img_best_2.png",
      title: "Matrix Partners",
    },
    {
      url: "https://www.ngc.fund",
      logo: "home-v2/img_best_3.png",
      title: "NGC Ventures",
    },
    {
      url: "https://www.youbicapital.com",
      logo: "home-v2/img_best_4.png",
      title: "YouBi Capital",
    },
    {
      url: "https://www.7xvc.com",
      logo: "home-v2/img_best_5.png",
      title: "7X Ventures",
    },
    {
      url: "https://arkstream.capital/#/Home",
      logo: "home-v2/img_best_6.png",
      title: "Arkstream Capital",
    },
    /*{
      url: "https://www.redpoint.com",
      logo: "home-v2/img_best_7.png",
    },*/
    {
      url: "https://capitalant.com",
      logo: "home-v2/img_best_8.png",
      title: "Capital Ant",
    },
    {
      url: "https://twitter.com/HashGlobal",
      logo: "home-v2/img_best_9.png",
      title: "Hash Global",
    },
    {
      url: "http://www.lancergrp.com",
      logo: "home-v2/img_best_10.png",
      title: "Lancer Group",
    },
    {
      url: "https://twitter.com/waterdripfund",
      logo: "home-v2/img_best_11.png",
      title: "Waterdrip Capital",
    },

    {
      url: "https://puzzle.ventures",
      logo: "home-v2/img_best_12.png",
      title: "Puzzle Ventures",
    },
    {
      url: "https://twitter.com/0x_nico0",
      logo: "home-v2/img_best_13.png",
      title: "Nico",
    },
    {
      url: "https://twitter.com/JarylNgan",
      logo: "home-v2/img_best_14.png",
      title: "Jaryl Ngan",
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
      url: "https://polygon.technology",
      logo: "img-partner-polygon-v2.png",
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
      url: "https://getblock.io",
      logo: "img-partner-getblock.png?2=2",
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
    {
      url: "http://www.abga.asia",
      logo: "img-partner-abga.png",
    },
    {
      url: "https://gopluslabs.io",
      logo: "img-partner-gopluslabs.png",
    },
    {
      url: "https://www.grenade.tw",
      logo: "img_partner_grenade.png",
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
      title: "Discover GameFi",
      className: "About__btn--white",
      url: "https://www.footprint.network/@Footprint/GameFi",
    },
    {
      title: "Discover NFTs",
      className: "About__btn--white",
      url: "https://www.footprint.network/@Footprint/NFT",
    },
    {
      title: "Create a Dashboard",
      className: "About__btn--white",
      url: Urls.newQuestion(),
      auth: true,
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
      title: "Top Chains",
      active: true,
      query:
        "https://www.footprint.network/public/chart/Chain-fp-90bb9cd4-33b8-402b-bf0e-cbcc45ed3049",
      url: "https://www.footprint.network/@Footprint/Chain",
    },
    {
      title: "Transactions & Gas Fees",
      query:
        "https://www.footprint.network/public/chart/Ethereum-Daily-Transaction-%26-Avg-Gas-Fee-fp-926953a0-1abe-473a-8cd5-77adab73752e",
      url: "https://www.footprint.network/@Kkai/Ethereum",
    },
    {
      title: "Protocol in Multi-chain",
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
      url: "https://www.footprint.network/@Footprint/GameFi",
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
      title: "NFT Volume by Marketplace",
      query:
        "https://www.footprint.network/public/chart/30D-NFT-Volume-by-Marketplaces-fp-17f1d52d-9ab7-4970-a40e-4c083c260768",
      url:
        "https://www.footprint.network/@0xLam/NFT-Marketplaces-X2Y2-OpenSea-LooksRare",
    },
  ],
};

export default data;
