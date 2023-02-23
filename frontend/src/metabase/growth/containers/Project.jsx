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
import { getLatestGAProject, saveLatestGAProject } from "../utils/utils";
import Connectors from "./Connectors";
import "../css/index.css";

const Project = props => {
  const { router, location, children, user } = props;
  const [tab, setTab] = useState();
  const [project, setProject] = useState();
  useEffect(() => {
    if (location.query.tab) {
      setTab(location.query.tab);
    } else {
      setTab("Overview");
    }
  }, [location.query.tab]);
  useEffect(() => {
    if (location.query.project_name) {
      setProject(location.query.project_name);
      saveLatestGAProject(location.query.project_name);
    } else {
      setProject(getLatestGAProject() ? getLatestGAProject() : "");
    }
  }, [location.query.project_name]);
  const tabs_data = [
    {
      name: "Project Overview",
      icon: React.createElement(ShopOutlined),
      id: null,
      children: null,
    },
    {
      name: "Analytics",
      icon: React.createElement(BarChartOutlined),
      id: null,
      children: [
        { name: "New User", id: 7128 },
        { name: "User Funnel", id: 7118 },
        { name: "User Retention", id: 7119 },
        { name: "User Profile", id: 7123 },
        // { name: "Top Users", id: 7120 },
        // { name: "User List", id: 7122 },
        {
          name: "NFT",
          // icon: React.createElement(FileImageOutlined),
          id: null,
          children: [
            { name: "NFT Overview", id: 7129 },
            { name: "Holder", id: 7133 },
            // { name: "Transaction", id: 7131 },
            { name: "Profit Leadboard", id: null },
          ],
        },
        {
          name: "Competitors",
          // icon: React.createElement(SearchOutlined),
          id: null,
          children: [
            { name: "Industry Insights", id: null },
            { name: "Competitive Comparison", id: null },
            { name: "User Overlap", id: null },
          ],
        },
        {
          name: "Social Media",
          // icon: React.createElement(CommentOutlined),
          id: 7154,
          // children: [
          //   { name: "Social Dashboard", id: null },
          //   { name: "Twitter", id: null },
          //   { name: "Discord", id: null },
          // ],
        },
      ],
    },
    {
      name: "Users",
      icon: React.createElement(TeamOutlined),
      id: null,
      children: [
        { name: "User List", id: 7136 },
        { name: "Potential Users", id: null },
        // { name: "Top Users", id: 7120 },
      ],
    },
    {
      name: "Cohorts",
      icon: React.createElement(TeamOutlined),
      id: null,
      children: [{ name: "Cohort List", id: null }],
    },
    {
      name: "Campaigns",
      icon: React.createElement(CommentOutlined),
      id: null,
      children: [
        { name: "Campaign List", id: null },
        // { name: "Locate Potential User", id: null },
        // { name: "Wallet Radar", id: null },
        // { name: "Snapshot", id: null },
        { name: "Snapshot & Airdrop", id: null },
      ],
    },

    {
      name: "Custom Analysis",
      icon: React.createElement(SearchOutlined),
      id: null,
      children: [{ name: "My Analysis", id: null }],
    },
    {
      name: "Setting",
      icon: React.createElement(SettingOutlined),
      id: null,
      children: [{ name: "Connectors", id: null }],
    },
  ];

  const dashboardMap = new Map();
  const getTabs = tabs_data => {
    const tabs = [];
    tabs_data?.map(item => {
      const children = getTabs(item.children);
      tabs.push({
        key: item.name,
        icon: item.icon,
        children: children.length > 0 ? children : null,
        label: item.name,
      });
      if (item.id) {
        dashboardMap.set(item.name, item.id);
      }

      // if (item.children && item.children.length > 0) {
      //   const children = [];
      //   item.children.map(child => {
      //     children.push({
      //       key: child.name,
      //       icon: child.icon,
      //       children: null,
      //       label: child.name,
      //     });
      //     if (child.id) {
      //       dashboardMap.set(child.name, child.id);
      //     }
      //   });
      //   tabs.push({
      //     key: item.name,
      //     icon: item.icon,
      //     children: children,
      //     label: item.name,
      //   });
      // } else {
      //   tabs.push({
      //     key: item.name,
      //     icon: item.icon,
      //     children: null,
      //     label: item.name,
      //   });
      //   if (item.id) {
      //     dashboardMap.set(item.name, item.id);
      //   }
      // }
    });
    return tabs;
  };
  console.log("getTabs(tabs_data)", getTabs(tabs_data));
  const getContentPannel = current_tab => {
    if (dashboardMap.has(current_tab)) {
      return (
        <PublicDashboard
          params={{ dashboardId: dashboardMap.get(current_tab) }}
          location={location}
          isFullscreen={false}
          className="ml-250"
          hideFooter
        />
      );
    }
    if (current_tab === "Connectors") {
      return <Connectors></Connectors>;
    }
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        {tab} is coming soon~
      </div>
    );
  };
  return (
    <GaLayout router={router} location={location}>
      <Layout hasSider className="h-full">
        <GaSidebar
          router={router}
          location={location}
          items={getTabs(tabs_data)}
          currentProject={project}
        ></GaSidebar>
        <Content
          className="h-full ga-layout__content"
          style={{ marginLeft: 250 }}
        >
          {getContentPannel(tab)}
        </Content>
      </Layout>
    </GaLayout>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(Project);
