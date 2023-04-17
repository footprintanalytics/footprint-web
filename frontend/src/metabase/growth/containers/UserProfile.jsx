/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Tabs, Breadcrumb } from "antd";
import PublicDashboard from "metabase/public/containers/PublicDashboard";
import "../css/utils.css";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import { getUser } from "metabase/selectors/user";
import { parseHashOptions } from "metabase/lib/browser";
import { getGrowthProjectPath, updateHashValue } from "../utils/utils";

const UserProfile = props => {
  const { location, router, project, projectPath } = props;
  const [currentTab, setCurrentTab] = useState(null);
  const tabs = [
    {
      label: "User Overview",
      key: "user_overview",
      uuid: "b46fc872-c97d-4300-a83e-45fa61760ad2",
    },
    {
      label: "User Actions",
      key: "user_actions",
      uuid: "b46fc872-c97d-4300-a83e-45fa61760ad2",
    },
    {
      label: "User Profile",
      key: "user_profile",
      uuid: "b46fc872-c97d-4300-a83e-45fa61760ad2",
    },
  ];
  const from = parseHashOptions(location.hash).from;

  useEffect(() => {
    console.log("User Profile useEffect  hash", location.hash);
    const querryTab = parseHashOptions(location.hash).tab;
    if (querryTab) {
      const tab = tabs.find(tab => tab.key === querryTab);
      if (tab) {
        setCurrentTab(tab);
      }
    } else {
      setCurrentTab(tabs[0]);
    }
  }, [location.hash]);

  const onChange = key => {
    console.log("User Profile select key = ", key);
    const tab = tabs.find(tab => tab.key === key);
    if (tab) {
      setCurrentTab(tab);
      router.push({
        pathname: getGrowthProjectPath(project?.protocolSlug, "UserProfile"),
        querry: location.querry,
        hash: updateHashValue(location.hash, "tab", key),
      });
    }
  };

  const Header = () => {
    return (
      <>
        {from && (
          <Breadcrumb
            className="pl1 pt2"
            items={[
              {
                title: (
                  <a
                    onClick={() => {
                      router?.goBack();
                    }}
                  >
                    {from}
                  </a>
                ),
              },
              {
                title: "User Profile",
              },
            ]}
          />
        )}
        {/* need a tab select  */}
        {currentTab && (
          <Tabs
            defaultActiveKey={currentTab?.key}
            style={{ marginBottom: -40 }}
            className="p1"
            items={tabs}
            onChange={onChange}
          />
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col" style={{ padding: 20 }}>
      {currentTab ? (
        <PublicDashboard
          params={{ uuid: currentTab?.uuid }}
          // params={{ uuid: "b46fc872-c97d-4300-a83e-45fa61760ad2" }}
          header={Header()}
          hideTitle={true}
          location={location}
          hideAllParams={true}
          project={{ ...project }}
          disableBreadcrumb={true}
          isFullscreen={false}
          // className="ml-250 mt-60"
          key={currentTab?.key}
          hideFooter
        />
      ) : (
        <LoadingSpinner message="Loading..." />
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(UserProfile);
