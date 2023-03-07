/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import {
  BarChartOutlined,
  FileImageOutlined,
  ShopOutlined,
  TeamOutlined,
  SettingOutlined,
  FundProjectionScreenOutlined,
  SearchOutlined,
  ConsoleSqlOutlined,
  ProjectOutlined,
  CodeOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import PublicDashboard from "metabase/public/containers/PublicDashboard";
import { getUser } from "metabase/selectors/user";
import GaLayout from "../components/GaLayout";
import GaSidebar from "../components/GaSidebar";
import ProjectInfo from "../components/ProjectInfo";
import {
  getLatestGAProject,
  saveLatestGAProject,
  getLatestGAMenuTag,
  getLatestGAProjectId,
} from "../utils/utils";
import { top_protocols } from "../utils/data";
import Connectors from "./Connectors";
import TemplateGallery from "./TemplateGallery";
import MyFavoriteTemplate from "./MyFavoriteTemplate";
import Campaigns from "./Campaigns";
import "../css/index.css";

const Project = props => {
  const { router, location, children, user } = props;
  const [tab, setTab] = useState();
  const [project, setProject] = useState();
  // const [projectId, setProjectId] = useState();
  useEffect(() => {
    if (location.query.tab) {
      setTab(location.query.tab);
    } else {
      setTab(getLatestGAMenuTag() ? getLatestGAMenuTag() : "");
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
      id: "7179",
      uuid: "fb62e629-9dea-4da7-9cdf-b013d9c17e3c",
      children: null,
    },
    {
      name: "Users",
      icon: React.createElement(BarChartOutlined),
      id: null,
      children: [
        {
          name: "New User",
          id: 7128,
          uuid: "181c3a01-6271-473d-a9dc-fe574c7e4691",
        },
        {
          name: "User Funnel",
          id: 7118,
          uuid: "b1682d12-bddd-4b10-99a3-a403a3a6a78c",
        },
        {
          name: "User Retention",
          id: 7119,
          uuid: "92c8f6c4-0c56-45ee-b3c1-399a23cfba33",
        },
        {
          name: "User Profile",
          id: null,
          uuid: null,
        },
        // { name: "Top Users", id: 7120 ,uuid:''},
        // { name: "User List", id: 7122 ,uuid:''},

        {
          name: "Social Media",
          // icon: React.createElement(CommentOutlined),
          id: 7154,
          uuid: "49bc72c9-8a7e-4b78-8275-9d473e633392",
          // children: [
          //   { name: "Social Dashboard", id: null },
          //   { name: "Twitter", id: null },
          //   { name: "Discord", id: null },
          // ],
        },
      ],
    },
    {
      name: "NFT",
      icon: React.createElement(FileImageOutlined),
      id: null,
      children: [
        {
          name: "NFT Overview",
          id: 7129,
          uuid: "dbf29773-5afa-4396-84c0-49b3909496ff",
        },
        {
          name: "Holder",
          id: 7133,
          uuid: "f519b7db-ef8e-4c94-9e39-001b5deb51e0",
        },
        // { name: "Transaction", id: null },
        {
          name: "Profit Leadboard",
          id: 7131,
          uuid: "eeff10d7-a0d3-48dc-9aa4-e564e861be4a",
        },
      ],
    },

    {
      name: "Cohorts",
      icon: React.createElement(TeamOutlined),
      id: null,
      children: [
        {
          name: "Cohort List",
          id: 7210,
          uuid: "4454f1ce-202b-45eb-8f83-3d78beff6756",
          // children: [
          //   {
          //     name: "User List",
          //     id: 7136,
          //     uuid: "9de520df-ccd9-467f-b2dd-82c6a2a44f5f",
          //   },
          // ],
        },
        {
          name: "Potential Users",
          id: 7180,
          uuid: "b46fc872-c97d-4300-a83e-45fa61760ad2",
        },
        // { name: "Top Users", id: 7120 },
      ],
    },
    {
      name: "Campaigns",
      icon: React.createElement(CommentOutlined),
      id: null,
      children: [
        { name: "Campaign List", id: null, uuid: null },
        // { name: "User List", id: 7136 },
        // { name: "User Group", id: null },
        // { name: "Wallet Radar", id: null },
        { name: "Snapshot & Airdrop", id: null, uuid: null },
      ],
    },
    {
      name: "Competitors",
      icon: React.createElement(ProjectOutlined),
      id: null,
      children: [
        {
          name: "Industry Ranking",
          id: 7271,
          uuid: "859c1295-89f4-4d2b-a8dd-b48914a6bbd3",
        },
        {
          name: "Competitors Comparison",
          id: 7248,
          uuid: "63114b7c-094c-402c-8fe8-a9bf1db1369d",
        },
        {
          name: "User Overlap",
          id: 7171,
          uuid: "cc8953e2-86c0-492f-85bf-1043eb9589c0",
        },
      ],
    },
    {
      name: "Industry",
      icon: React.createElement(FundProjectionScreenOutlined),
      id: null,
      children: [
        {
          name: "Overview",
          id: 7284,
          uuid: "7edf6b30-83e5-4fca-a1d5-7c3002560ea5",
        },
        {
          name: "Chain Analysis",
          id: 7285,
          uuid: "4eea9a6d-932b-49cf-acfa-6724c3887cc6",
        },
      ],
    },
    {
      name: "Custom Analysis",
      icon: React.createElement(CodeOutlined),
      id: null,
      children: [
        { name: "My Analysis", id: null, uuid: null },
        { name: "Template Gallery", id: null, uuid: null },
      ],
    },
    {
      name: "Setting",
      icon: React.createElement(SettingOutlined),
      id: null,
      children: [
        { name: "Connectors", id: null, uuid: null },
        { name: "Project Info", id: null, uuid: null },
      ],
    },
  ];

  const dashboardMap = new Map();
  const getTabs = tabs_data => {
    const tabs = [];
    tabs_data?.map(item => {
      const children = getTabs(item.children);
      const disabled =
        children.length <= 0 &&
        !item.uuid &&
        [
          "Connectors",
          "Campaign List",
          "Project Info",
          "Template Gallery",
          "My Analysis",
        ].findIndex(i => i === item.name) === -1
          ? true
          : false;
      tabs.push({
        key: item.name,
        icon: item.icon,
        children: children.length > 0 ? children : null,
        disabled: disabled,
        label: item.name,
      });
      if (item.uuid) {
        dashboardMap.set(item.name, item.uuid);
      }
    });
    return tabs;
  };
  const getProjectObject = project => {
    return {
      projectName: project,
      collection_contract_address: top_protocols.find(
        i => i.protocol_slug === project,
      )?.collections_list?.[0],
    };
  };
  const getContentPannel = current_tab => {
    if (dashboardMap.has(current_tab)) {
      // TODO: fix this project object
      return (
        <PublicDashboard
          params={{ uuid: dashboardMap.get(current_tab) }}
          location={location}
          project={getProjectObject(project)}
          isFullscreen={false}
          className="ml-250"
          key={project}
          hideFooter
        />
      );
    }
    if (current_tab === "Connectors") {
      return (
        <Connectors
          location={location}
          router={router}
          projectId={getLatestGAProjectId()}
        ></Connectors>
      );
    }
    if (current_tab === "Project Info") {
      return (
        <ProjectInfo
          location={location}
          router={router}
          project={project}
        ></ProjectInfo>
      );
    }
    if (current_tab === "Template Gallery") {
      return (
        <TemplateGallery location={location} router={router}></TemplateGallery>
      );
    }
    if (current_tab === "My Analysis") {
      return (
        <MyFavoriteTemplate
          location={location}
          router={router}
        ></MyFavoriteTemplate>
      );
    }
    if (current_tab === "Campaign List") {
      return <Campaigns router={router} location={location}></Campaigns>;
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
