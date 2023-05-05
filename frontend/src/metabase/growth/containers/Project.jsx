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
import { fga_menu_data } from "../utils/data";
import LoadingDashboard from "../components/LoadingDashboard";
import ConnectorList from "./ConnectorList";
import ChannelList from "./ChannelList";
import WalletProfile from "./WalletProfile";
import CampaignDetail from "./CampaignDetail";
import CampaignList from "./CampaignList";
import CustomAnalysis from "./CustomAnalysis";
import CampaignCreate from "./CampaignCreate";
import PotentialUsers from "./PotentialUsers";
import UserTemplate from "./UserTemplate";
import CohortList from "./CohortList";
import Community from "./Community";
import UserProfile from "./UserProfile";
import SocialConnectList from "./SocialConnectList";
import "../css/index.css";

const Project = props => {
  const { router, location, children, user, menu, projectPath, projectObject } =
    props;
  const [currentMenu, setCurrentMenu] = useState(menu);
  const [gaMenuTabs, setGaMenuTabs] = useState(null);

  const showRefreshButton = user?.id === 10 || user?.id === 22278;

  useEffect(() => {
    console.log(
      "Project.jsx useEffect menu => ",
      "current: " + currentMenu,
      ", new: " + menu,
      projectObject,
    );
    if (menu && menu !== currentMenu && projectObject) {
      console.log("Project.jsx useEffect reset menu to => ", menu);
      setCurrentMenu(menu);
    }
  }, [menu]);

  useEffect(() => {
    if (projectObject) {
      const newMenu = getGaMenuTabs(
        fga_menu_data,
        projectObject.protocolType,
        projectObject?.nftCollectionAddress?.length > 0,
        user,
      );
      setGaMenuTabs(newMenu);

      if (
        !currentMenu ||
        (!findMenu(currentMenu, newMenu?.menuTabs) &&
          ["GameFi", "NFT"].includes(currentMenu))
      ) {
        const firstMenu =
          newMenu?.menuTabs[0]?.children?.length > 0
            ? newMenu?.menuTabs[0].children[0].key
            : newMenu?.menuTabs[0]?.key;
        setCurrentMenu(firstMenu);
        router.push({
          pathname: getGrowthProjectPath(
            projectObject?.protocolSlug,
            firstMenu,
          ),
        });
      } else {
        router.replace({
          pathname: getGrowthProjectPath(
            projectObject?.protocolSlug,
            currentMenu,
          ),
        });
      }
    } else {
      setGaMenuTabs(null);
    }
  }, [projectObject, user]);

  function findMenu(targetMenu, menuListData) {
    let subMenu = null;
    for (let i = 0; i < menuListData.length && !subMenu; i++) {
      const item = menuListData[i];
      if (item.children?.length > 0) {
        subMenu = item.children.find(s => s.key === targetMenu);
        if (subMenu) {
          return true; // found the submenu, exit the function and return `true`
        }
      } else if (item.key === targetMenu) {
        return true; // found the menu item, exit the function and return `true`
      }
    }
    return false; // submenu or menu item not found, return `false`
  }

  const getProjectObject = () => {
    return projectObject
      ? {
          ...projectObject,
          twitter_handler: projectObject?.twitter?.handler,
          discord_guild_id: projectObject?.discord?.guildId,
        }
      : null;
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
            {gaMenuTabs?.dashboardMap && currentMenu ? (
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
                // subTitle={`I'm sorry, the content for this ${page} page is not yet ready. You can visit our homepage for now and stay tuned for more high-quality content coming soon. We appreciate your patience.`}
                subTitle="Coming Soon~"
                extra={
                  <Button
                    type="primary"
                    onClick={() => {
                      router.push(
                        getGrowthProjectPath(
                          projectObject?.protocolSlug,
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
    if (!projectObject || !currentMenu || !gaMenuTabs) {
      return <LoadingSpinner message="Loading..." />;
    }
    console.log("Project.jsx getContentPannel current_tab => ", current_tab);
    const WrapPublicDashboard = current_tab =>
      projectObject?.protocolSlug ? (
        <PublicDashboard
          params={{ uuid: gaMenuTabs?.dashboardMap?.get(current_tab) }}
          location={location}
          project={getProjectObject()}
          isFullscreen={false}
          hideTitle={true}
          key={projectObject?.protocolSlug}
          hideFooter
          showRefreshButton={showRefreshButton}
        />
      ) : (
        <LoadingSpinner message="Loading..." />
      );
    if (current_tab === "UserTemplate" || current_tab === "Potential Users") {
      //|| current_tab === "Potential Users"
      return (
        <UserTemplate
          location={location}
          router={router}
          projectId={getLatestGAProjectId()}
          projectPath={projectPath}
        ></UserTemplate>
      );
    }
    if (
      current_tab === "GameFi" &&
      !projectObject?.nftCollectionAddress?.length > 0
    ) {
      // GameFi Project without NFT
      return projectObject?.protocolSlug ? (
        <PublicDashboard
          params={{ uuid: "82cf8827-1962-47d3-a31e-dd72d9262520" }}
          location={location}
          project={getProjectObject()}
          isFullscreen={false}
          hideTitle={true}
          key={projectObject?.protocolSlug}
          hideFooter
          showRefreshButton={showRefreshButton}
        />
      ) : (
        <LoadingSpinner message="Loading..." />
      );
    }
    if (current_tab === "UserProfile") {
      return (
        <UserProfile
          location={location}
          router={router}
          project={getProjectObject()}
        />
      );
    }

    if (["Wallet Profile", "WalletProfile"].includes(current_tab)) {
      return (
        <WalletProfile
          location={location}
          router={router}
          project={getProjectObject()}
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
          project={getProjectObject()}
          projectId={getLatestGAProjectId()}
        ></ConnectorList>
      );
    }
    if (current_tab === "Channel") {
      return (
        <ChannelList
          location={location}
          router={router}
          project={getProjectObject()}
          projectId={getLatestGAProjectId()}
        ></ChannelList>
      );
    }
    if (current_tab === "General") {
      return (
        <ProjectInfo
          location={location}
          router={router}
          project={getProjectObject()}
        ></ProjectInfo>
      );
    }
    if (
      [
        "OptInList",
        "Opt-In",
        "OptIn",
        "Opt-In Tool",
        "Social Connect",
      ].includes(current_tab)
    ) {
      return (
        <SocialConnectList
          location={location}
          router={router}
          project={getProjectObject()}
        ></SocialConnectList>
      );
    }
    if (["Community", "Members"].includes(current_tab)) {
      return (
        <Community
          location={location}
          router={router}
          project={getProjectObject()}
        ></Community>
      );
    }
    if (["Potential Users List", "Potential Users"].includes(current_tab)) {
      return (
        <PotentialUsers
          location={location}
          project={getProjectObject()}
          router={router}
        />
      );
    }
    if (current_tab === "Custom Analysis") {
      return (
        <CustomAnalysis
          project={getProjectObject()}
          location={location}
          router={router}
        ></CustomAnalysis>
      );
    }
    if (current_tab === "CreateCampaign") {
      return (
        <CampaignCreate
          location={location}
          router={router}
          project={getProjectObject()}
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
          projectPath={projectPath}
          project={getProjectObject()}
        ></CampaignDetail>
      );
    }
    if (current_tab === "Cohort") {
      return (
        <CohortList
          router={router}
          location={location}
          project={getProjectObject()}
        ></CohortList>
      );
    }
    if (gaMenuTabs?.dashboardMap?.has(current_tab)) {
      if (current_tab === "Twitter") {
        return (
          <LoadingDashboard
            router={router}
            sourceDefinitionId={projectObject?.twitter?.sourceDefinitionId}
            project={getProjectObject()}
            projectId={parseInt(getLatestGAProjectId())}
            current_tab={current_tab}
          >
            {WrapPublicDashboard(current_tab)}
          </LoadingDashboard>
        );
      }
      if (current_tab === "Discord") {
        return (
          <LoadingDashboard
            router={router}
            sourceDefinitionId={projectObject?.discord?.sourceDefinitionId}
            project={getProjectObject()}
            projectId={parseInt(getLatestGAProjectId())}
            current_tab={current_tab}
          >
            {WrapPublicDashboard(current_tab)}
          </LoadingDashboard>
        );
      }
      if (current_tab === "Funnel") {
        return (
          <LoadingDashboard
            router={router}
            sourceDefinitionId={projectObject?.ga?.sourceDefinitionId}
            project={getProjectObject()}
            projectId={parseInt(getLatestGAProjectId())}
            current_tab={current_tab}
          >
            {WrapPublicDashboard(current_tab)}
          </LoadingDashboard>
        );
      }
      return WrapPublicDashboard(current_tab);
    }
    return comingSoon("");
  };
  return (
    <>
      {projectObject ? (
        <>
          {currentMenu &&
            projectObject &&
            gaMenuTabs &&
            getContentPannel(currentMenu)}
        </>
      ) : (
        <>
          <LoadingSpinner message="Loading..." />
        </>
      )}
    </>
  );
};

const mapStateToProps = (state, props) => {
  // console.log(
  //   "project mapStateToProps => ",
  //   props.params.project,
  //   props.params.menu,
  //   getFgaProject(state),
  // );
  return {
    user: getUser(state),
    projectPath: props.params.project,
    projectObject: getFgaProject(state),
    menu: props.params.menu,
  };
};

export default connect(mapStateToProps)(Project);
