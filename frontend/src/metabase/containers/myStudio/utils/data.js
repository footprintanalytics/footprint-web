import React from "react";
import MyApi from "metabase/containers/myStudio/Component/MyApi";
import * as Urls from "metabase/lib/urls";
import List from "metabase/containers/creator/components/personal/list";

import { MessageOutlined, PicCenterOutlined, SmileOutlined } from "@ant-design/icons/lib/icons";
import ConnectorList from "metabase/growth/containers/ConnectorList";

const comingSoonDiv = () => {
  return <div className="flex justify-center p4"><h2>Coming soon~</h2></div>;
};

const getMyStudioData = ({ name, params, router, user, onLogout }) => {
  const isOwner = user?.name === name;
  return [
    {
      "label": "My Analysis",
      "value": "my-analysis",
      subMenus: [
        {
          "label": "Dashboards",
          "value": "dashboards",
          "icon": <MessageOutlined />,
          "component": (
            <List
              key="dashboards"
              user={user}
              name={name}
              location={router.location}
              router={router}
              defaultModel="dashboard"
              hideToggleView
              showTabs={
                {
                  all: false,
                  dashboard: true,
                  card: false,
                  favorite: false,
                  table: false,
                }
              }
            />
          ),
        },
        {
          "label": "Charts",
          "value": "charts",
          "icon": <MessageOutlined />,
          "component": (
            <List
              key="charts"
              user={user}
              name={name}
              location={router.location}
              router={router}
              defaultModel="card"
              hideToggleView
              showTabs={
                {
                  all: false,
                  dashboard: false,
                  card: true,
                  favorite: false,
                  table: false,
                }
              }
            />
          ),
        },
        {
          "label": "Favorites",
          "value": "favorites",
          "icon": <MessageOutlined />,
          "component": (
            <List
              key="favorites"
              user={user}
              name={name}
              location={router.location}
              router={router}
              defaultModel="favorite"
              hideToggleView
              showTabs={
                {
                  all: false,
                  dashboard: false,
                  card: false,
                  favorite: true,
                  table: false,
                }
              }
            />
          ),
        },
      ].filter(Boolean),
    },
    {
      "label": "My Datasets",
      "value": "my-datasets",
      "icon": <PicCenterOutlined />,
      subMenus: [{
        "label": "Datasets",
        "value": "datasets",
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
      }, {
        "label": "Integration",
        "value": "integration",
        "component": (
          <ConnectorList
            key="integration"
          />
        ),
      }],
    },
    {
      "label": "Data API",
      "value": "data-api",
      subMenus: [
        {
          "label": "Usage Dashboard",
          "value": "usage-dashboard",
          "component": (
            <MyApi
              location={location}
              showUsage={true}
            />
          ),
        },
        {
          "label": "API Key",
          "value": "api-key",
          "component": (
            <MyApi
              location={location}
              showApiKey={true}
            />
          ),
        },
      ]
    },
    {
      "label": "Apps",
      "value": "apps",
      subMenus: [
        {
          "label": "My apps",
          "value": "my-apps",
          "component": comingSoonDiv(),
        },
        {
          "label": "App Store",
          "value": "app-store",
          "component": comingSoonDiv(),
        },
        {
          "label": "Publish app",
          "value": "publish-app",
          "component": comingSoonDiv(),
        },
      ]
    },
    {
      "label": "Setting",
      "value": "setting",
      "icon": <SmileOutlined />,
      "subMenus": [
        {
          "label": "Account settings",
          "value": "account-settings",
          "url": Urls.accountSettings(),
        },
        // {
        //   "label": "Moon men",
        //   "value": "moon-men",
        //   "url": "/moon-men",
        // },
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
  ].filter(Boolean);
};

const data = {
  getMyStudioData,
};


export default data;
