export const getDataApiSubscribeOptions = (user, mode) => {
  const object = {
    growth: [
      {
        title: "$79 for Monthly Subscription",
        selected: true,
        disabledAuto: true,
        productId: "639b10f33ea85c0060da062b",
      },
    ],
    scale: [
      {
        title: "$360 for Monthly Subscription",
        selected: true,
        disabledAuto: true,
        productId: "639b10c17fd425004aee4629",
      },
    ],
  };

  /*if (user?.groups.includes("Inner")) {
    options.push({
      title: "$1 for Monthly Subscription (Test)",
      selected: false,
      productId: "6100d04cf2c78d001ee5d494",
    });
  }*/

  return object[mode];
};
