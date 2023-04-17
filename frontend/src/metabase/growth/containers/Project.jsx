/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Image, Result } from "antd";
import PublicDashboard from "metabase/public/containers/PublicDashboard";
import { getUser, getFgaProject } from "metabase/selectors/user";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import { loadCurrentFgaProject } from "metabase/redux/user";
import ProjectInfo from "../components/ProjectInfo";
import {
  getGaMenuTabs,
  getGrowthProjectPath,
  getLatestGAProjectId,
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
import UserTemplate from "./UserTemplate";
import CohortList from "./CohortList";
import Community from "./Community";
import UserProfile from "./UserProfile";
import "../css/index.css";

const Project = props => {
  const { router, location, children, user, menu, projectPath, projectObject } =
    props;
  const tabs_data = fga_menu_data;
  const [tab, setTab] = useState(menu);
  const [project, setProject] = useState(projectPath);
  const demoProjectData = top_protocols[0];
  const [gaMenuTabs, setGaMenuTabs] = useState();
  const isDemo = location?.hash?.includes("demo");

  useEffect(() => {
    if (!project) {
      return;
    }
    if (menu) {
      setTab(menu);
    } else {
      const tempMenu =
        gaMenuTabs?.menuTabs[0]?.children?.length > 0
          ? gaMenuTabs?.menuTabs[0].children[0].key
          : gaMenuTabs?.menuTabs[0]?.key;
      setTab(tempMenu);
      console.log(
        "project useEffect router.push",
        getGrowthProjectPath(project, tempMenu),
      );
      router.push(getGrowthProjectPath(project, tempMenu));
    }
  }, [gaMenuTabs, menu, project, router]);

  useEffect(() => {
    setGaMenuTabs(
      getGaMenuTabs(
        tabs_data,
        (projectObject ?? demoProjectData).protocolType,
        (projectObject ?? demoProjectData).nftCollectionAddress?.length > 0,
        user,
      ),
    );
  }, [demoProjectData, projectObject, tabs_data, user]);

  useEffect(() => {
    if (projectPath) {
      setProject(projectPath);
    }
  }, [projectPath]);

  const getProjectObject = () => {
    return {
      ...(projectObject ?? demoProjectData),
      twitter_handler: projectObject?.twitter?.handler,
      discord_guild_id: projectObject?.discord?.guildId,
    };
  };

  const comingSoon = page => {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <div
          style={{
            display: "flex",
            padding: 0,
            justifyContent: "center",
          }}
        >
          <>
            {gaMenuTabs?.dashboardMap && tab ? (
              <Result
                style={{
                  margin: 0,
                  width: "50%",
                  minWidth: 400,
                  maxWidth: 600,
                }}
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
                subTitle={`I'm sorry, the content for this ${page} page is not yet ready. You can visit our homepage for now and stay tuned for more high-quality content coming soon. We appreciate your patience.`}
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
            ) : (
              <LoadingSpinner message="Loading..." />
            )}
          </>
        </div>
      </div>
    );
  };

  const getContentPannel = current_tab => {
    const WrapPublicDashboard = projectObject?.protocolSlug ? (
      <PublicDashboard
        params={{ uuid: gaMenuTabs?.dashboardMap?.get(current_tab) }}
        location={location}
        project={getProjectObject()}
        isFullscreen={false}
        hideTitle={true}
        key={projectObject?.protocolSlug}
        hideFooter
      />
    ) : (
      <LoadingSpinner message="Loading..." />
    );
    if (current_tab === "UserTemplate") {
      //|| current_tab === "Potential Users"
      return (
        <UserTemplate
          location={location}
          router={router}
          projectId={getLatestGAProjectId()}
        ></UserTemplate>
      );
    }
    if (current_tab === "Potential Users2") {
      return <PotentialUsers project={getProjectObject(project)} />;
    }
    if (current_tab === "UserProfile") {
      return (
        <UserProfile
          location={location}
          router={router}
          project={getProjectObject(project)}
        />
      );
    }
    if (current_tab === "Connector") {
      return (
        <ConnectorList
          refetchProject={() =>
            props.dispatch(loadCurrentFgaProject(projectObject?.id, true))
          }
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
    if (current_tab === "Community") {
      return (
        <Community
          location={location}
          router={router}
          project={getProjectObject(project)}
        ></Community>
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
      // return comingSoon("Campaign");
      return <CampaignList router={router} location={location}></CampaignList>;
    }
    if (current_tab === "CampaignDetail") {
      return (
        <CampaignDetail
          router={router}
          location={location}
          projectPath={projectPath}
          project={getProjectObject(project)}
        ></CampaignDetail>
      );
    }
    if (current_tab === "Cohort") {
      return (
        <CohortList
          router={router}
          location={location}
          project={getProjectObject(project)}
        ></CohortList>
      );
    }
    if (current_tab === "Potential Users" && isDemo) {
      return <PotentialUsers project={getProjectObject(project)} />;
    }
    if (gaMenuTabs?.dashboardMap?.has(current_tab)) {
      if (current_tab === "Twitter") {
        return (
          <LoadingDashboard
            router={router}
            sourceDefinitionId={projectObject?.twitter?.sourceDefinitionId}
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
            sourceDefinitionId={projectObject?.discord?.sourceDefinitionId}
            project={getProjectObject(project)}
            projectId={parseInt(getLatestGAProjectId())}
            current_tab={current_tab}
          >
            {WrapPublicDashboard}
          </LoadingDashboard>
        );
      }
      if (current_tab === "Lifecycle") {
        return (
          <LoadingDashboard
            router={router}
            sourceDefinitionId={projectObject?.ga?.sourceDefinitionId}
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
    return comingSoon("");
  };
  return <>{getContentPannel(tab)}</>;
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectPath: props.params.project,
    projectObject: getFgaProject(state),
    menu: props.params.menu,
  };
};

export default connect(mapStateToProps)(Project);
