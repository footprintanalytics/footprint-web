export const getDataApiSubscribeOptions = (user, mode) => {
  const object = {
    growth: [
      {
        title: "$299 for Monthly Subscription",
        selected: true,
        disabledAuto: true,
        productId: "1",
      },
    ],
    scale: [
      {
        title: "$299 for Monthly Subscription",
        selected: true,
        disabledAuto: true,
        productId: "2",
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
