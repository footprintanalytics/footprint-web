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
import { ReactIcons } from "metabase/nav/containers/FpNavbar/utils/data";
import ComingSoonView from "metabase/containers/myStudio/Component/ComingSoonView";

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
      "icon": ReactIcons.myAnalysisIcon,
      subMenus: [
        {
          "label": "Dashboards",
          "value": "dashboards",
          "component": (
            <StudioDashboards title="Dashboards" type="dashboards" router={router} user={user}/>
          ),
        },
        {
          "label": "Charts",
          "value": "charts",
          "component": (
            <StudioDashboards title="Charts" type="charts" router={router} user={user}/>
          ),
        },
        {
          "label": "Favorites",
          "value": "favorites",
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
            hideComingSoon
            showContactUs
            padding="20px 40px"
          />
        ),
      }, {
        "label": "Submit contract",
        "value": "submit-contract",
        "url": "submit/contract/add",
      }
      ],
    },
    {
      "label": "Data API",
      "value": "data-api",
      "icon": ReactIcons.dataApiIcon,
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
      "icon": ReactIcons.appsIcon,
      subMenus: [
        {
          "label": "My apps",
          "value": "my-apps",
          "component": <ComingSoonView title="My apps"/>,
        },
        {
          "label": "App Store",
          "value": "app-store",
          "component": <ComingSoonView title="App Store"/>,
        },
        {
          "label": "Publish app",
          "value": "publish-app",
          "component": <ComingSoonView title="Publish app"/>,
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
