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
import LoadingDashboard from "../components/LoadingDashboard";
import Connectors from "./Connectors";
import Activators from "./Activators";
import CustomAnalysis from "./CustomAnalysis";
import TemplateGallery from "./TemplateGallery";
import MyFavoriteTemplate from "./MyFavoriteTemplate";
import CampaignDetail from "./CampaignDetail";
import CampaignList from "./CampaignList";
import CreateCampaignPage from "./CreateCampaignPage";
import CreateCampaignPage2 from "./CreateCampaignPage2";
import Cohort from "./Cohort";
import "../css/index.css";

const Project = props => {
  const { router, location, children, user, menu, projectPath } = props;
  const tabs_data = fga_menu_data;
  const [tab, setTab] = useState(menu);
  const [project, setProject] = useState(projectPath);
  const [projectId, setProjectId] = useState(getLatestGAProjectId());
  const demoProjectData = top_protocols[0];
  const [gaMenuTabs, setGaMenuTabs] = useState();

  useEffect(() => {
    setProjectId(getLatestGAProjectId());
    setTab(
      menu ??
        getLatestGAMenuTag() ??
        (gaMenuTabs?.menuTabs?.[0].children.length > 0
          ? gaMenuTabs?.menuTabs?.[0].children[0].name
          : gaMenuTabs?.menuTabs?.[0].name),
    );
  }, [menu, gaMenuTabs]);

  const { isLoadingProject, data, refetch } = useQuery(
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
    let menu = null;
    if (!isLoadingProject && data) {
      menu = getGaMenuTabs(
        tabs_data,
        data?.protocolType,
        data?.nftCollectionAddress?.length > 0,
      );
    } else {
      // demo project menu
      menu = getGaMenuTabs(
        tabs_data,
        demoProjectData.protocolType,
        demoProjectData?.nftCollectionAddress?.length > 0,
      );
    }
    setGaMenuTabs(menu);
  }, [isLoadingProject, data]);

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

  const getProjectObject = project => {
    return {
      projectName: data?.protocolSlug ?? project,
      collection_contract_address:
        data?.nftCollectionAddress ?? demoProjectData?.nftCollectionAddress,
      project: data ?? demoProjectData,
      twitter_handler: data?.twitter?.handler,
      discord_guild_id: data?.discord?.guildId,
      protocolName: data?.protocolName,
    };
  };
  const getContentPannel = current_tab => {
    const WrapPublicDashboard = (
      <PublicDashboard
        params={{ uuid: gaMenuTabs?.dashboardMap?.get(current_tab) }}
        location={location}
        project={getProjectObject(project)}
        isFullscreen={false}
        className="ml-250"
        key={project}
        hideFooter
      />
    );
    if (current_tab === "Connector") {
      return (
        <Connectors
          refetchProject={refetch}
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
          project={getProjectObject(project)}
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
    if (current_tab === "CreateCampaign") {
      return (
        <CreateCampaignPage2
          location={location}
          router={router}
          project={getProjectObject(project)}
          projectId={getLatestGAProjectId()}
        ></CreateCampaignPage2>
      );
    }
    if (current_tab === "Campaign") {
      return <CampaignList router={router} location={location}></CampaignList>;
    }
    if (current_tab === "CampaignDetail") {
      return (
        <CampaignDetail
          router={router}
          location={location}
          project={getProjectObject(project)}
        ></CampaignDetail>
      );
    }
    if (current_tab === "Cohort") {
      return <Cohort router={router} location={location}></Cohort>;
    }
    if (gaMenuTabs?.dashboardMap?.has(current_tab)) {
      // TODO: fix this project object
      if (current_tab === "Twitter") {
        return (
          <LoadingDashboard
            router={router}
            sourceDefinitionId={data?.twitter?.sourceDefinitionId}
            project={getProjectObject(project)}
            projectId={parseInt(getLatestGAProjectId())}
            current_tab={current_tab}
          >
            {WrapPublicDashboard}
          </LoadingDashboard>
        );
      }
      if (current_tab === "Discord") {
        return (
          <LoadingDashboard
            router={router}
            sourceDefinitionId={data?.discord?.sourceDefinitionId}
            project={getProjectObject(project)}
            projectId={parseInt(getLatestGAProjectId())}
            current_tab={current_tab}
          >
            {WrapPublicDashboard}
          </LoadingDashboard>
        );
      }
      if (current_tab === "User Funnel") {
        return (
          <LoadingDashboard
            router={router}
            sourceDefinitionId={data?.ga?.sourceDefinitionId}
            project={getProjectObject(project)}
            projectId={parseInt(getLatestGAProjectId())}
            current_tab={current_tab}
          >
            {WrapPublicDashboard}
          </LoadingDashboard>
        );
      }
      return WrapPublicDashboard;
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
          items={gaMenuTabs?.menuTabs}
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
