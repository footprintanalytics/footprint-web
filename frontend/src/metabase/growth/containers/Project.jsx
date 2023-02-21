/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import {
  BarChartOutlined,
  ShopOutlined,
  TeamOutlined,
  SettingOutlined,
  CustomerServiceOutlined,
  SearchOutlined,
  CommentOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import PublicDashboard from "metabase/public/containers/PublicDashboard";
import { getUser } from "metabase/selectors/user";
import GaLayout from "../components/GaLayout";
import GaSidebar from "../components/GaSidebar";

const Project = props => {
  const { router, location, children, user } = props;
  const [tab, setTab] = useState();
  const [project, setProject] = useState();
  useEffect(() => {
    if (location.query.tab) {
      setTab(location.query.tab);
    } else {
      setTab("project");
    }
  }, [location.query.tab]);
  useEffect(() => {
    if (location.query.project_name) {
      setProject(location.query.project_name);
    } else {
      setProject(projects[0].value);
    }
  }, [location.query.project_name]);
  function getItem(label, icon, children, type) {
    return {
      key: label,
      icon,
      children,
      label,
      type,
    };
  }
  const tabs = [
    getItem("Overview", React.createElement(ShopOutlined)),
    getItem("Users", React.createElement(TeamOutlined), [
      getItem("New User"),
      getItem("Top Users"),
      getItem("User Funnel"),
      getItem("User Retention"),
      getItem("User Profile"),
      getItem("User List"),
      // getItem("Churning Users"),
    ]),
    getItem("NFT", React.createElement(FileImageOutlined), [
      getItem("NFT Overview"),
      getItem("Holder"),
      getItem("Transaction"),
    ]),
    getItem("Campaign Managemant", React.createElement(BarChartOutlined), [
      getItem("Campaign List"),
      getItem("Locate Potential User"),
      getItem("Wallet Radar"),
      getItem("Snapshot"),
      getItem("Airdrop"),
    ]),
    getItem("Social Media", React.createElement(CommentOutlined), [
      getItem("Social Dashboard"),
      getItem("Twitter"),
      getItem("Discord"),
    ]),
    getItem("Competitive Research", React.createElement(SearchOutlined), [
      getItem("Industry Insights"),
      getItem("Competitive Comparison"),
      // getItem("Competitive Tracking"),
      getItem("User Overlap"),
    ]),
    getItem("Custom Analysis", React.createElement(CustomerServiceOutlined), [
      getItem("My Analysis"),
    ]),
    getItem("Setting", React.createElement(SettingOutlined), [
      getItem("Connector"),
    ]),
  ];

  const projects = [
    { value: "Mocaverse", label: "Mocaverse" },
    { value: "BenjiBanana", label: "BenjiBanana" },
  ];
  const dashboardMap = new Map();
  dashboardMap.set("Overview", 4696);
  dashboardMap.set("Top Users", 7120);
  dashboardMap.set("User Funnel", 7118);
  dashboardMap.set("User Retention", 7119);
  dashboardMap.set("User List", 7122);
  dashboardMap.set("NFT Overview", 6831);
  dashboardMap.set("Holder", 6831);
  const getDashboardId = current_tab => {
    if (dashboardMap.has(current_tab)) {
      return dashboardMap.get(current_tab);
    }
  };
  return (
    <div>
      <GaLayout router={router} location={location}>
        <Layout hasSider>
          <GaSidebar
            router={router}
            location={location}
            items={tabs}
            currentProject={project}
            projects={projects}
          ></GaSidebar>
          <Content style={{ marginLeft: 250 }}>
            {/* {project}-{tab} */}
            {getDashboardId(tab) && (
              <PublicDashboard
                params={{ dashboardId: getDashboardId(tab) }}
                location={location}
                isFullscreen={false}
                className="ml-250"
                hideFooter
              />
            )}
            {!getDashboardId(tab) && (
              <div style={{ textAlign: "center", padding: "50px" }}>
                {tab} is coming soon~
              </div>
            )}
          </Content>
        </Layout>
      </GaLayout>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(Project);
