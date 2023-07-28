import React from "react";
import MyApi from "metabase/containers/myStudio/Component/MyApi";
import * as Urls from "metabase/lib/urls";
import List from "metabase/containers/creator/components/personal/list";

import { MessageOutlined, PicCenterOutlined, SmileOutlined } from "@ant-design/icons/lib/icons";
import ConnectorList from "metabase/growth/containers/ConnectorList";
import ChartCreate from "../Component/ChartCreate";
import { integrationData } from "metabase/components/GlobalContactPanel/data";
import StudioDashboards from "metabase/containers/myStudio/Component/MyAnalysis/StudioDashboards";
import DashboardArea from "metabase/containers/features/components/DashboardArea";
import Icon from "metabase/components/Icon";

const comingSoonDiv = () => {
  return <div className="flex justify-center p4"><h2>Coming soon~</h2></div>;
};

const getMyStudioData = ({ name, params, router, user, onLogout }) => {
  const isOwner = user?.name === name;
  return [
    {
      "label": "Create",
      "value": "create",
      "icon": <Icon name="add" size={14}/>,
      "component": (
        <ChartCreate />
      )
    },
    {
      "label": "Footprint Datasets",
      "value": "footprint-datasets",
      "icon": <Icon name="database" size={14}/>,
      "publicUuid": "5aca24eb-aae3-44ef-8e4b-a275fee42847",
    },
    {
      "label": "My Analysis",
      "value": "my-analysis",
      subMenus: [
        {
          "label": "Dashboards",
          "value": "dashboards",
          "icon": <MessageOutlined />,
          "component": (
            <StudioDashboards title="Dashboards" type="dashboards" router={router} user={user}/>
          ),
        },
        {
          "label": "Charts",
          "value": "charts",
          "icon": <MessageOutlined />,
          "component": (
            <StudioDashboards title="Charts" type="charts" router={router} user={user}/>
          ),
        },
        {
          "label": "Favorites",
          "value": "favorites",
          "icon": <MessageOutlined />,
          "component": (
            <StudioDashboards title="Favorites" type="favorites" router={router} user={user}/>
          ),
        },
      ].filter(Boolean),
    },
    {
      "label": "My Datasets",
      "value": "my-datasets",
      "icon": <Icon name="database" size={14}/>,
      subMenus: [{
        "label": "Datasets",
        "value": "datasets",
        "component": (
          <StudioDashboards title="Datasets" type="datasets" router={router} user={user}/>
        ),
      }, {
        "label": "Integration",
        "value": "integration",
        "component": (
          <ConnectorList
            key="integration"
            demoData={integrationData}
            projectId="demo"
            width="100%"
            padding="20px 40px"
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
    /*{
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
    },*/
  ].filter(Boolean);
};

const data = {
  getMyStudioData,
};


export default data;
