export const getSubscribeOptions = () => [
  {
    title: "$2,868 for Yearly Subscription",
    yearlyPrice: "$239",
    yearlySaving: "20%",
    selected: true,
    productId: "6100d2153ad9a2001e40b607",
  },
  {
    title: "$299 for Monthly Subscription",
    selected: false,
    productId: "6100d209444d4f0017c1008e",
  },
  {
    title: "$29 for 7-day Trial",
    selected: false,
    productId: "61013c30e0276a0010950ff9",
  },
];

export const getComparePlans = user => ({
  title: "Compare plans",
  columns: [
    {
      label: "Free",
      value: "free",
      desc: "Get access to the most comprehensive on-chain data",
      price: "$0",
      unit: "month",
      btnText: "Start for Free",
      btnAction: "sign",
      btnDisabled: user?.id,
      features: [
        "Access to 90-days data",
        "1G data limit per query",
        "CSV upload 5 times",
      ],
      benefits: {
        title: "Key benefits of Free:",
        list: [
          "Access to 17 chains data",
          "Access to GameFi/NFT/DeFi data",
          "Access to Community data",
          "26 chart types to choose",
          "Unlimited charts/dashboards",
          "Muti-chain & drill-down analysis",
          "Share to social networks",
        ],
      },
    },
    {
      label: "Business",
      value: "business",
      desc: "Build Advanced on-chain & off-chain analytics",
      price: "$299",
      unit: "month",
      yearlyPrice: "$239",
      yearlySaving: "20%",
      btnText: "Subscribe Now",
      btnAction: "subscribe",
      btnDisabled: user && user.vipInfo?.type !== "free",
      features: [
        "Access to full history data",
        "10G data limit per query",
        "Unlimited CSV uploads",
        "Unlimited API uploads",
        "Unlimited CSV downloads",
      ],
      benefits: {
        title: "All the benefits of Free, plus:",
        list: [
          "Keep uploaded data private",
          "Keep dashboard private",
          "Remove watermarks",
        ],
      },
    },
    {
      label: "Enterprise",
      value: "enterprise",
      desc: "Empower every team with reliable data",
      price: "Let's Talk",
      btnText: "Talk to us",
      btnLink: "https://discord.gg/3HYaR6USM7",
      features: [
        "Access to full history data",
        "30G data limit per query",
        "Customized data",
        "Data API (download data)",
        "Unlimited customized alerts",
        "Unlimited customized dashboards",
      ],
      benefits: {
        title: "All the benefits of Business, plus:",
        list: [
          "Customized dashboards",
          "Customized alerts",
          "Team cooperation(coming soon)",
        ],
      },
    },
  ],
  list: [
    {
      type: "Data",
      list: [
        {
          name: "17 chains",
          free: true,
          business: true,
          enterprise: true,
        },
        {
          name: "GameFi/NFT/DeFi data",
          free: true,
          business: true,
          enterprise: true,
        },
        {
          name: "Silver tables/indicators",
          free: true,
          business: true,
          enterprise: true,
        },
        {
          name: "Gold tables/indicators",
          free: true,
          business: true,
          enterprise: true,
        },
        {
          name: "Community data",
          free: true,
          business: true,
          enterprise: true,
        },
        {
          name: "Data limit per query",
          free: "1G",
          business: "10G",
          enterprise: "30G",
        },
      ],
    },
    {
      type: "Access",
      list: [
        {
          name: "No code to create chart",
          free: true,
          business: true,
          enterprise: true,
        },
        {
          name: "SQL query",
          free: true,
          business: true,
          enterprise: true,
        },
        {
          name: "Python (Jupyter notebook)",
          free: true,
          business: true,
          enterprise: true,
        },
      ],
    },
    {
      type: "Visualization",
      list: [
        {
          name: "Number of charts",
          free: "Unlimited",
          business: "Unlimited",
          enterprise: "Unlimited",
        },
        {
          name: "Number of dashboards",
          free: "Unlimited",
          business: "Unlimited",
          enterprise: "Unlimited",
        },
        {
          name: "26 chart types",
          free: true,
          business: true,
          enterprise: true,
        },
        {
          name: "Fork chart/dashboards",
          free: true,
          business: true,
          enterprise: true,
        },
        {
          name: "Chart labelling",
          free: true,
          business: true,
          enterprise: true,
        },
      ],
    },
    {
      type: "Sharing",
      list: [
        {
          name: "Save as image",
          free: true,
          business: true,
          enterprise: true,
        },
        {
          name: "Embed live dashboards",
          free: true,
          business: true,
          enterprise: true,
        },
        {
          name: "Share to social networks",
          free: true,
          business: true,
          enterprise: true,
        },
      ],
    },
    {
      type: "Advanced",
      list: [
        {
          name: "Customer support",
          free: "Regular",
          business: "Priority",
          enterprise: "First Priority",
        },
        {
          name: "Keep uploaded data private",
          free: false,
          business: "Coming soon",
          enterprise: "Coming soon",
        },
        {
          name: "Keep dashboard private",
          free: false,
          business: true,
          enterprise: true,
        },
        {
          name: "Remove watermarks",
          free: false,
          business: true,
          enterprise: true,
        },
        {
          name: "Upload CSV",
          free: "5 times",
          business: "Unlimited",
          enterprise: "Unlimited",
        },
        {
          name: "Upload  API",
          free: false,
          business: "Unlimited",
          enterprise: "Unlimited",
        },
        {
          name: "Download data to CSV",
          free: "5 times",
          business: "Unlimited",
          enterprise: "Unlimited",
        },
        {
          name: "Data API",
          free: false,
          business: false,
          enterprise: true,
        },
        {
          name: "Customized data",
          free: false,
          business: false,
          enterprise: true,
        },
        {
          name: "Customized dashboards",
          free: false,
          business: false,
          enterprise: true,
        },
        {
          name: "Customized alert",
          free: false,
          business: false,
          enterprise: "Coming soon",
        },
        {
          name: "Team cooperation",
          free: false,
          business: false,
          enterprise: "Coming soon",
        },
      ],
    },
  ],
});
