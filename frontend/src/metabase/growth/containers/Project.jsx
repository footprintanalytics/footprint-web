/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Image, Layout, Result } from "antd";
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
  getGaMenuTabs,
  getGrowthProjectPath,
  getLatestGAMenuTag,
  getLatestGAProject,
  getLatestGAProjectId,
  saveLatestGAProject,
} from "../utils/utils";
import { fga_menu_data, top_protocols } from "../utils/data";
import LoadingDashboard from "../components/LoadingDashboard";
import ConnectorList from "./ConnectorList";
import ChannelList from "./ChannelList";
import CampaignDetail from "./CampaignDetail";
import CampaignList from "./CampaignList";
import CustomAnalysis from "./CustomAnalysis";
import CampaignCreate from "./CampaignCreate";
import PotentialUsers from "./PotentialUsers";
import CohortList from "./CohortList";
import "../css/index.css";

const Project = props => {
  const { router, location, children, user, menu, projectPath } = props;
  const tabs_data = fga_menu_data;
  const [tab, setTab] = useState(menu);
  const [project, setProject] = useState(projectPath);
  const [projectId, setProjectId] = useState(getLatestGAProjectId());
  const demoProjectData = top_protocols[0];
  const [gaMenuTabs, setGaMenuTabs] = useState();
  const isDemo = location?.hash?.includes("demo");

  useEffect(() => {
    setProjectId(getLatestGAProjectId());
    setTab(
      menu ??
        (gaMenuTabs?.menuTabs?.[0].children.length > 0
          ? gaMenuTabs?.menuTabs?.[0].children[0].key
          : gaMenuTabs?.menuTabs?.[0].key),
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
    if (!isLoadingProject) {
      menu = getGaMenuTabs(
        tabs_data,
        (data ?? demoProjectData).protocolType,
        (data ?? demoProjectData).nftCollectionAddress?.length > 0,
        user,
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
      ...(data ?? demoProjectData),
      twitter_handler: data?.twitter?.handler,
      discord_guild_id: data?.discord?.guildId,
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
        <ConnectorList
          refetchProject={refetch}
          location={location}
          router={router}
          project={getProjectObject(project)}
          projectId={getLatestGAProjectId()}
        ></ConnectorList>
      );
    }
    if (current_tab === "Channel") {
      return (
        <ChannelList
          location={location}
          router={router}
          project={getProjectObject(project)}
          projectId={getLatestGAProjectId()}
        ></ChannelList>
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
    if (current_tab === "Custom Analysis") {
      return (
        <CustomAnalysis location={location} router={router}></CustomAnalysis>
      );
    }
    if (current_tab === "CreateCampaign") {
      return (
        <CampaignCreate
          location={location}
          router={router}
          project={getProjectObject(project)}
          projectId={getLatestGAProjectId()}
        ></CampaignCreate>
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
      return <CohortList router={router} location={location}></CohortList>;
    }
    if (gaMenuTabs?.dashboardMap?.has(current_tab)) {
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
      if (current_tab === "Potential Users" && isDemo) {
        return (
          <PotentialUsers project={getProjectObject(project)}/>
        )
      }
      return WrapPublicDashboard;
    }
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <div
          style={{
            display: "flex",
            padding: 0,
            justifyContent: "center",
          }}
        >
          <Result
            style={{ margin: 0, width: "50%", minWidth: 400, maxWidth: 600 }}
            icon={
              <Image
                preview={false}
                style={{
                  height: "50%",
                  width: "50%",
                  minHeight: 30,
                  minWidth: 50,
                  maxHeight: 500,
                  maxWidth: 550,
                }}
                src={
                  "https://footprint-imgs.oss-us-east-1.aliyuncs.com/no-data01.svg"
                }
              />
            }
            // title="There is currently no data available for this project."
            subTitle="I'm sorry, the content for this page is not yet ready. You can visit our homepage for now and stay tuned for more high-quality content coming soon. We appreciate your patience."
            extra={
              <Button
                type="primary"
                onClick={() => {
                  router.push(
                    getGrowthProjectPath(
                      project,
                      gaMenuTabs?.menuTabs?.[0].children?.length > 0
                        ? gaMenuTabs?.menuTabs?.[0].children[0].key
                        : gaMenuTabs?.menuTabs?.[0].key,
                    ),
                  );
                }}
              >
                Goto Homepage
              </Button>
            }
          />
        </div>
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
