import React from "react";
import MyApi from "metabase/containers/myStudio/Component/MyApi";
import MyAnalysis from "metabase/containers/myStudio/Component/MyAnalysis";
import * as Urls from "metabase/lib/urls";
import List from "metabase/containers/creator/components/personal/list";

import {
  MessageOutlined,
  PicCenterOutlined,
  PropertySafetyOutlined,
  ScheduleOutlined,
  SmileOutlined,
  TagOutlined,
  TrademarkCircleOutlined,
} from "@ant-design/icons/lib/icons";

const comingSoonDiv = () => {
  return <div className="flex justify-center p4"><h2>Coming soon~</h2></div>;
};

const getMyStudioData = ({ name, params, router, user, onLogout }) => {
  const isOwner = user?.name === name;
  return [
    {
      "label": "",
      "value": "my-group",
      "itemType": "group",
      subMenus: [
        {
          "label": "My Analysis",
          "value": "my-analysis",
          "icon": <MessageOutlined />,
          "component": (
            <MyAnalysis
              key="my-analysis"
              router={router}
              name={name}
              user={user}
            />
          ),
        },
        isOwner && {
          "label": "My Datasets",
          "value": "my-datasets",
          "icon": <PicCenterOutlined />,
          "component": (
            <List
              key="my-datasets"
              user={user}
              name={name}
              location={router.location}
              router={router}
              defaultModel="table"
              hideTabsBar={true}
              showTabs={
                {
                  all: false,
                  dashboard: false,
                  card: false,
                  favorite: false,
                  table: true,
                }
              }
            />
          ),
        },
        isOwner && {
          "label": "My API",
          "value": "my-api",
          "icon": <PropertySafetyOutlined />,
          "component": (
            <MyApi
              location={location}
            />
          ),
        },
        isOwner && {
          "label": "My Apps",
          "value": "my-apps",
          "icon": <ScheduleOutlined />,
          "component": comingSoonDiv(),
        },
        isOwner && {
          "label": "Setting",
          "value": "setting",
          "icon": <SmileOutlined />,
          "subMenus": [
            {
              "label": "Account settings",
              "value": "account-settings",
              "url": Urls.accountSettings(),
            },
            {
              "label": "Moon men",
              "value": "moon-men",
              "url": "/moon-men",
            },
            user?.is_superuser && {
              "label": "Admin settings",
              "value": "admin-settings",
              "url": "/admin",
            },
            (user?.is_superuser || user?.isMarket) && {
              "label": "Upgrade Vip",
              "value": "upgrade-vip",
              "url": "/market/upgrade",
            },
            user && {
              "label": "Sign out",
              "value": "sign-out",
              "action": () => onLogout(),
            },
          ].filter(Boolean),
        },
      ].filter(Boolean),
    },
    {
      "label": "",
      "value": "apps-group",
      "itemType": "group",
      subMenus: [
        isOwner && {
          "label": "App Store",
          "value": "app-store",
          "icon": <SmileOutlined />,
          "component": comingSoonDiv(),
        },
        isOwner && {
          "label": "Publish App",
          "value": "publish-app",
          "icon": <TagOutlined />,
          "component": comingSoonDiv(),
        },
        {
          "label": "Submit contract",
          "value": "submit-contract",
          "url": "/submit/contract",
          "icon": <TrademarkCircleOutlined />,
        },
      ].filter(Boolean),
    },
    {
      "label": "",
      "value": "new-dashboard-group",
      "itemType": "group",
      subMenus: [{
        "label": "New Dashboard",
        "value": "new-dashboard",
        "url": "/dashboard/new",
        "icon": <MessageOutlined />,
      }].filter(Boolean),
    },

  ].filter(Boolean);
};

const data = {
  getMyStudioData,
};


export default data;
