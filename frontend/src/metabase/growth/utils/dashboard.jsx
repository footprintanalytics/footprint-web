/* eslint-disable curly */
import React from "react";
import { notification, Typography } from "antd";
import { orderBy } from "lodash";

export const MENU_LIST = [
  {
    value: "Custom Analysis",
    label: "Custom Analysis",
    children: [
      {
        value: "My Analysis",
        label: "My Analysis",
        type: "mine",
      },
      // {
      //   value: "Community Analysis",
      //   label: "Community Analysis",
      //   type: "explore",
      // },
      // {
      //   value: "Upload Data",
      //   label: "Upload Data",
      //   type: "upload",
      // },
    ],
  },
];

export const DEMO_PROTOCOL_LIST = [
  { protocolName: "Uniswap", userId: "0" },
  { protocolName: "Dodo", userId: "2298" },
];

export const isDemo = () => location.pathname.includes("/defi360/demo");

export const demoTip = () => {
  notification.info({
    key: "demoTip",
    message: "Contact us to upgrade your account",
    description: (
      <>
        <div>
          Telegram:{" "}
          <Typography.Link
            href="https://t.me/joinchat/4-ocuURAr2thODFh"
            target="_blank"
            rel="nofollow"
          >
            @FootprintAnalytics
          </Typography.Link>
        </div>
        <div>
          Email:{" "}
          <Typography.Link href="mailto:partners@footprint.network">
            partners@footprint.network
          </Typography.Link>
        </div>
      </>
    ),
  });
};

export const getMenuPath = levels => {
  const path = levels.join("/");
  return `/defi360/${isDemo() ? "demo" : "protocol-dashboard"}/${path}`;
};

export const getProtocolNameList = list => {
  const res = [];

  list.forEach(item => {
    const existed = res.find(r => r.value === item.protocol_name);
    if (!existed) {
      res.push({ label: item.protocol_name, value: item.protocol_name });
    }
  });

  return orderBy(res, "value", "desc");
};

export const getFirstLevelList = (list, protocolName) => {
  const res = [];

  list.forEach(item => {
    const existed = res.find(r => r.value === item.first_level);
    if (!existed && item.protocol_name === protocolName?.value) {
      res.push({ label: item.first_level, value: item.first_level });
    }
  });

  return orderBy(res, "value", "desc");
};

export const getSecondAndThirdLevelList = (list, protocolName, firstLevel) => {
  const res = [];

  list.forEach(item => {
    if (
      item.protocol_name === protocolName?.value &&
      item.first_level === firstLevel.value
    ) {
      const existed = res.find(r => r.value === item.second_level);
      const secondItem = existed || {
        label: item.second_level,
        value: item.second_level,
        children: [],
      };
      secondItem.children.push({
        label: item.third_level,
        value: item.third_level,
        uuid: item.dashboard_uuid,
        params: item.params,
        sort: item.sort,
      });
      secondItem.children = orderBy(secondItem.children, "sort", "asc");
      if (!existed) res.push(secondItem);
    }
  });

  return orderBy(res, "value", "desc");
};

export const formatUserDashboard = ({
  list,
  protocolNameValue,
  firstLevelValue,
  secondLevelValue,
  thirdLevelValue,
}) => {
  const protocolNameList = getProtocolNameList(list);
  const protocolName = protocolNameValue
    ? protocolNameList.find(item => item.value === protocolNameValue)
    : protocolNameList[0];

  const firstLevelList = getFirstLevelList(list, protocolName);
  const firstLevel = firstLevelValue
    ? firstLevelList.find(item => item.value === firstLevelValue)
    : firstLevelList[0];

  const secondAndThirdLevelList = getSecondAndThirdLevelList(
    list,
    protocolName,
    firstLevel,
  );
  const secondAndThirdLevel =
    secondLevelValue && thirdLevelValue
      ? secondAndThirdLevelList
          .find(item => item.value === secondLevelValue)
          .children.find(item => item.value === thirdLevelValue)
      : secondAndThirdLevelList[0]?.children[0];

  return {
    protocolNameList,
    protocolName,
    firstLevelList,
    firstLevel,
    secondAndThirdLevelList,
    secondAndThirdLevel,
  };
};
