import { getOssUrl } from "metabase/lib/image";

const data = {
  dashboardNav: [
    { title: "Which Chain Perform Best", query: ["chain"] },
    { title: "Find the Latest or Hot DApps", query: ["top dapps"] },
    { title: "Evaluate Timing to Invest Token", query: ["token"] },
  ],

  sectionList: [
    {
      title: "We Support",
      subTitle: "Comprehensive Analysis",
      desc: "Footprint helps people and organizations be more data-driven",
      list: [
        {
          title: "Multi-chain Analysis",
          img: getOssUrl("20220606152520.gif"),
        },
        {
          title: "Drill-down Analysis",
          img: getOssUrl("20220606152616.gif"),
        },
      ],
      height: "540px",
    },
    {
      reverse: true,
      subTitle: "Massive template inventory",
      desc:
        "Footprint is home to a global user group that shares insights and drives the platform’s development",
      list: [
        {
          title: "Save as favorite",
          img: getOssUrl("20220606154724.gif"),
        },
        {
          title: "One-click to fork",
          img: getOssUrl("20220606154750.gif"),
        },
        {
          title: "Change filters",
          img: getOssUrl("20220606154806.gif"),
        },
      ],
      height: "455px",
    },
    {
      subTitle: "Drag-and-drop charting interface",
      desc: "Footprint makes blockchain analytics possible for anyone",
      list: [
        {
          title: "No-code visualization",
          img: getOssUrl("20220606154848.gif"),
        },
        {
          title: "26+ types of charts",
          img: getOssUrl("20220606154902.gif"),
        },
        {
          title: "Add text, image & link",
          img: getOssUrl("20220606154919.gif"),
        },
      ],
      height: "455px",
    },
    {
      reverse: true,
      subTitle: "Upload and download data",
      desc: "Footprint bridges on-chain and off-chain world together",
      list: [
        {
          title: "Upload off-chain data",
          img: getOssUrl("20220606155703.gif"),
        },
        {
          title: "Download data",
          img: getOssUrl("20220606155721.gif"),
        },
        {
          title: "Save charts and dashboards",
          img: getOssUrl("20220606155739.gif"),
        },
      ],
      height: "455px",
    },
    {
      subTitle: "Custom metrics and tables",
      desc: "Footprint empowers everyone to customize their analysis",
      list: [
        {
          title: "Custom columns",
          img: getOssUrl("20220606155803.gif"),
        },
        {
          title: "Excel-like experience",
          img: getOssUrl("20220606155903.gif"),
        },
        {
          title: "Supports Python",
          img: getOssUrl("20220608142457.gif"),
        },
      ],
      height: "574px",
      borderless: true,
    },
    // {
    //   reverse: true,
    //   borderless: true,
    //   subTitle: "Build a knowledge library",
    //   desc:
    //     "Footprint lets you stop repeating coding, and start creating knowledge",
    //   list: [
    //     {
    //       title: "Categorize and share",
    //       img: "",
    //     },
    //     {
    //       title: "Allow anyone to discover and use your analyses",
    //       img: "",
    //     },
    //   ],
    //   height: "455px",
    // },
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
    {
      url: "https://twitter.com/thejewforu",
      logo: "img-angel-avi-zurlo.png",
    },
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
};

export default data;
