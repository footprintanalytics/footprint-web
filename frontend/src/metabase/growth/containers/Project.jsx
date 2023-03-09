/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
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
  getGaMenuTabs,
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
      setTab(getLatestGAMenuTag() ? getLatestGAMenuTag() : tabs_data[0].name);
    }
  }, [location.query.tab, tabs_data]);
  useEffect(() => {
    if (location.query.project_name) {
      setProject(location.query.project_name);
      saveLatestGAProject(location.query.project_name);
    } else {
      setProject(getLatestGAProject() ? getLatestGAProject() : "");
    }
  }, [location.query.project_name]);
  const tabs_data = fga_menu_data;
  console.log("getGaMenuTabs(tabs_data)");
  const { menuTabs, dashboardMap } = getGaMenuTabs(tabs_data);
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
    if (current_tab === "Connector") {
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
    if (current_tab === "Campaign") {
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
          currentTab={tab}
          items={menuTabs}
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
