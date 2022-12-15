export const getDataApiSubscribeOptions = (user, mode) => {
  const object = {
    growth: [
      {
        title: "$79 for Monthly Subscription",
        selected: true,
        disabledAuto: true,
        productId: "6399860233fc530014d2f348",
      },
    ],
    scale: [
      {
        title: "$360 for Monthly Subscription",
        selected: true,
        disabledAuto: true,
        productId: "63998f8e33fc530014d2f37d",
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
