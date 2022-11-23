export const getSubscribeOptions = user => {
  const options = [
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
      disabledAuto: true,
    },
  ];

  if (user?.groups.includes("Inner")) {
    options.push({
      title: "$1 for Monthly Subscription (Test)",
      selected: false,
      productId: "6100d04cf2c78d001ee5d494",
    });
  }

  return options;
};

export const getComparePlans = user => ({
  title: "Compare plans",
  columns: [
    {
      label: "Free",
      value: "free",
      desc: "Get access to the most comprehensive \non-chain data",
      price: "$0",
      unit: "month",
      btnText: "Start for Free",
      btnAction: "sign",
      btnDisabled: user?.id,
      features: [
        // "Access to 90-days data",
        "1G data limit per query",
        "CSV upload 5 times",
        // "CSV download 3 times",
      ],
      benefits: {
        title: "Key benefits of Free:",
        list: [
          "Access to 22 chains data",
          "Access to GameFi/NFT/DeFi data",
          "Access to Community data",
          "26 chart types to choose",
          "Unlimited charts/dashboards",
          "Muti-chain & drill-down analysis",
          "Share to social networks",
        ],
      },
      dataApi: {
        title: "Data API (Free)",
        list: [
          "50K calls per month",
          "3 calls per second",
          "Normal performance",
          "Community support",
          "REST API: Easy to access",
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
      btnText: "$29 for 7-day Trial",
      btnAction: "subscribe",
      btnDisabled: user && user.vipInfo?.type !== "free",
      features: [
        // "Access to full history data",
        "10G data limit per query",
        "Unlimited CSV uploads",
        "Unlimited API uploads",
        "Unlimited CSV downloads",
      ],
      benefits: {
        title: "All the benefits of Free, plus:",
        list: [
          "Keep uploaded data private(coming soon)",
          "Keep dashboard private",
          "Remove dashboard watermarks",
        ],
      },
      dataApi: {
        title: "Data API (Growth)",
        list: [
          "300K calls per month",
          "10 calls per second",
          "Quick performance",
          "Community support",
          "REST API: Easy to access",
          "24hrs support response time",
        ],
      },
    },
    {
      label: "Team",
      value: "enterprise",
      desc: "Empower every team with reliable data",
      price: "Let's Talk",
      btnText: "Talk to us",
      btnLink: "https://discord.gg/3HYaR6USM7",
      features: [
        // "Access to full history data",
        "30G data limit per query",
        "Customized data",
        // "Data API (download data)",
        "Unlimited customized alerts",
        "Unlimited customized dashboards",
      ],
      benefits: {
        title: "All the benefits of Business, plus:",
        list: [
          "Customized dashboards",
          "Customized alerts(coming soon)",
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
          name: "22 chains",
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
          name: "Remove dashboard watermarks",
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
          free: false,
          business: "Unlimited",
          enterprise: "Unlimited",
        },
        // {
        //   name: "Data API",
        //   free: false,
        //   business: false,
        //   enterprise: true,
        // },
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
    {
      type: "Data API",
      list: [
        {
          name: "Calls per month",
          free: "50K",
          business: "300K",
          enterprise: "/",
        },
        {
          name: "Calls per second",
          free: "3",
          business: "10",
          enterprise: "/",
        },
        {
          name: "Performance",
          free: "Normal",
          business: "Quick",
          enterprise: "/",
        },
        {
          name: "Community support",
          free: true,
          business: true,
          enterprise: "/",
        },
        {
          name: "REST API: Easy to access",
          free: true,
          business: true,
          enterprise: "/",
        },
        {
          name: "24hrs support response time",
          free: false,
          business: true,
          enterprise: "/",
        },
      ],
    },
  ],
});
