import React from "react";
import Creator from "metabase/containers/creator";
import MyAnalysisList from "metabase/growth/containers/MyAnalysisList";
import MyApi from "metabase/containers/myStudio/Component/MyApi";
import MyAnalysis from "metabase/containers/myStudio/Component/MyAnalysis";
import * as Urls from "metabase/lib/urls";

const comingSoonDiv = () => {
  return <div className="flex justify-center p4"><h2>Coming soon~</h2></div>;
};

const getMyStudioData = ({ name, params, router, user, onLogout }) => {
  const isOwner = user?.name === name;
  return [
    {
      "label": "My Analysis",
      "value": "my-analysis",
      "icon": true,
      "component": (
        <MyAnalysis
          key="vvv"
          router={router}
          name={name}
        />
      ),
    },
    isOwner ? {
      "label": "My Datasets",
      "value": "my-datasets",
      "icon": true,
      "component": (
        <MyAnalysisList
          key="my-datasets"
          location={router.location}
          router={router}
          defaultModel="table"
          showTabs={
            {
              all: true,
              dashboard: true,
              card: false,
              favorite: false,
              table: true,
            }
          }
        />
      ),
    } : null,
    isOwner ? {
      "label": "My API",
      "value": "my-api",
      "icon": true,
      "component": (
        <MyApi
          location={location}
        />
      ),
    } : null,
    isOwner ? {
      "label": "My Apps",
      "value": "my-apps",
      "icon": true,
      "component": comingSoonDiv(),
    } : null,
    isOwner ? {
      "label": "App Store",
      "value": "app-store",
      "icon": true,
      "component": comingSoonDiv(),
    } : null,
    isOwner ? {
      "label": "Publish App",
      "value": "publish-app",
      "icon": true,
      "component": comingSoonDiv(),
    } : null,
    isOwner && {
      "label": "Setting",
      "value": "setting",
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
        user?.is_superuser ? {
          "label": "Admin settings",
          "value": "admin-settings",
          "url": "/admin",
        } : null,
        user?.is_superuser || user?.isMarket ? {
          "label": "Upgrade Vip",
          "value": "upgrade-vip",
          "url": "/market/upgrade",
        } : null,
        user ? {
          "label": "Sign out",
          "value": "sign-out",
          "action": () => onLogout(),
        } : null,
      ].filter(Boolean),
    },
    {
      "label": "Submit contract",
      "value": "submit-contract",
      "url": "/submit/contract",
      "icon": true,
    },
    {
      "label": "New Dashboard",
      "value": "new-dashboard",
      "url": "/dashboard/new",
      "icon": true,
    },
  ].filter(Boolean);
};

const data = {
  getMyStudioData,
};


export default data;
