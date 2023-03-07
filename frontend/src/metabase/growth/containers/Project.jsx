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
import { fga_menu_data, top_protocols } from "../utils/data";
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
  const tabs_data = fga_menu_data;

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
