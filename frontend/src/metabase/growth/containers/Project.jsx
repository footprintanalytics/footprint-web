/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useQuery } from "react-query";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import PublicDashboard from "metabase/public/containers/PublicDashboard";
import { getUser } from "metabase/selectors/user";
import { GetFgaProjectDetail } from "metabase/new-service";
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
import Activators from "./Activators";
import CustomAnalysis from "./CustomAnalysis";
import TemplateGallery from "./TemplateGallery";
import MyFavoriteTemplate from "./MyFavoriteTemplate";
import CampaignDetail from "./CampaignDetail";
import CampaignList from "./CampaignList";
import CreateCampaignPage from "./CreateCampaignPage";
import Cohort from "./Cohort";
import "../css/index.css";

const Project = props => {
  const { router, location, children, user, menu, projectPath } = props;
  const [tab, setTab] = useState(menu);
  const [project, setProject] = useState(projectPath);
  const [projectId, setProjectId] = useState(getLatestGAProjectId());

  useEffect(() => {
    setProjectId(getLatestGAProjectId());
    setTab(
      menu ??
        getLatestGAMenuTag() ??
        (tabs_data[0].children.length > 0
          ? tabs_data[0].children[0].name
          : tabs_data[0].name),
    );
  }, [menu, tabs_data]);

  const { isLoadingProject, data } = useQuery(
    ["GetFgaProjectDetail", user, projectPath, getLatestGAProjectId()],
    async () => {
      if (getLatestGAProjectId()) {
        return await GetFgaProjectDetail({
          projectId: parseInt(getLatestGAProjectId()),
        });
      } else {
        return;
      }
    },
    QUERY_OPTIONS,
  );

  useEffect(() => {
    setProjectId(getLatestGAProjectId());
    if (projectPath) {
      setProject(projectPath);
      saveLatestGAProject(projectPath);
    } else {
      const recommendOptions = [];
      top_protocols.map((i, index) => {
        if (i.isDemo) {
          recommendOptions.push({
            ...i,
            value: i.protocol_slug,
            key: i.protocol_slug + "-recommend",
            label: i.protocol_name,
          });
        }
      });
      setProject(
        getLatestGAProject() ?? recommendOptions?.[0]?.value ?? "the-sandbox",
      );
    }
  }, [projectPath]);
  const tabs_data = fga_menu_data;
  const { menuTabs, dashboardMap } = getGaMenuTabs(tabs_data);
  //TODO 这里要换成从数据源api 读取 project 数据
  const getProjectObject = project => {
    const p = top_protocols.find(i => i.protocol_slug === project);
    return {
      projectName: project,
      collection_contract_address: p?.collections_list,
      project: p,
      twitter_handler: data?.twitter?.handler,
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
    if (current_tab === "CreateCampaign") {
      return (
        <CreateCampaignPage
          location={location}
          router={router}
          project={getProjectObject(project)}
          projectId={getLatestGAProjectId()}
        ></CreateCampaignPage>
      );
    }
    if (current_tab === "Connector") {
      return (
        <Connectors
          location={location}
          router={router}
          project={getProjectObject(project)}
          projectId={getLatestGAProjectId()}
        ></Connectors>
      );
    }
    if (current_tab === "Channel") {
      return (
        <Activators
          location={location}
          router={router}
          project={getProjectObject(project)}
          projectId={getLatestGAProjectId()}
        ></Activators>
      );
    }
    if (current_tab === "General") {
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
    if (current_tab === "Custom Analysis") {
      return (
        <CustomAnalysis location={location} router={router}></CustomAnalysis>
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
      // return <Campaigns router={router} location={location}></Campaigns>;
      return <CampaignList router={router} location={location}></CampaignList>;
    }
    if (current_tab === "CampaignDetail") {
      // return <Campaigns router={router} location={location}></Campaigns>;
      return (
        <CampaignDetail router={router} location={location}></CampaignDetail>
      );
    }
    if (current_tab === "Cohort") {
      return <Cohort router={router} location={location}></Cohort>;
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

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectPath: props.params.project,
    menu: props.params.menu,
  };
};

export default connect(mapStateToProps)(Project);
