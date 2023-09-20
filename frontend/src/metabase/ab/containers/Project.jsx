/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Image, Result } from "antd";
import PublicDashboard from "metabase/public/containers/PublicDashboard";
import { getFgaProject, getUser } from "metabase/selectors/user";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import { loadCurrentFgaProject } from "metabase/redux/user";
import ProjectInfo from "../components/ProjectInfo";
import { checkVipMenuPermisson, getGrowthProjectPath, getLatestGAProjectId } from "../utils/utils";
import { fga_menu_data_v2 } from "../utils/data";
import LoadingDashboard from "../components/LoadingDashboard";
import DashboardMask from "../components/DashboardMask";
import ConnectorList from "./ConnectorList";
import ChannelList from "./ChannelList";
import WalletProfile from "./WalletProfile";
import MyAnalysis from "./MyAnalysis";
import Airdrop from "./Airdrop";
import CampaignDetail from "./CampaignDetail";
import CampaignListNew from "./CampaignListNew";
import CustomAnalysis from "./CustomAnalysis";
import CampaignCreate from "./CampaignCreate";
import PotentialUsers from "./PotentialUsers";
import FindWallets from "./FindWallets";
import Journey from "./Journey";
import JourneyEdit from "./Journey/component/edit";
import JourneyList from "./Journey/component/list";
import CohortList from "./CohortList";
import Community from "./Community";
import UserProfile from "./UserProfile";
import MyAnalysisList from "./MyAnalysisList";
import SocialConnectList from "./SocialConnectList";
import "../css/index.css";
import GameList from "./gameList";

const Project = props => {
  const { router, location, children, user, menu, projectPath, projectObject } =
    props;
  const [currentMenu, setCurrentMenu] = useState(menu);
  const [gaMenuTabs, setGaMenuTabs] = useState(null);
  console.log("projectPath", projectPath, menu, projectObject)
  useEffect(() => {
    if (menu && menu !== currentMenu && projectObject) {
      if (menu === "funnel") {
        router.replace("/fga/dashboard/@0xABS/User-Journey-of-Mocaverse-FGA?series_date=past30days#type=dashboard&hide_edit");
        return;
      }
      setCurrentMenu(menu);
    }
  }, [menu]);

  useEffect(() => {
    if (projectObject) {
      const menuData = fga_menu_data_v2(projectObject, user);
      const menuKeys = menuData.keys;
      const liveKeys = menuData.liveKeys;
      setGaMenuTabs(menuData);
      console.log("ppppp1", !currentMenu, (liveKeys.includes(currentMenu), !menuKeys.includes(currentMenu)))
      if (
        !currentMenu ||
        (liveKeys.includes(currentMenu) && !menuKeys.includes(currentMenu))
      ) {
        const firstMenu = menuKeys[0];
        console.log("useEffect, firstMenu", firstMenu)
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
          query: { ...location.query },
        });
      }
    } else {
      console.log("ppppp2")
      setGaMenuTabs(null);
    }
  }, [projectObject, user]);

  const getProjectObject = () => {
    return projectObject
      ? projectObject.protocolSlug !== "default"
        ? {
          ...projectObject,
          origin_protocol_slug: projectObject?.protocolSlug,
          twitter_handler: projectObject?.twitter?.handler,
          discord_guild_id: projectObject?.discord?.guildId,
        }
        : {
          // if no protocolSlug, use sandbox as default
          id: projectObject?.id,
          isDemo: projectObject?.isDemo,
          origin_protocol_slug: projectObject?.protocolSlug,
          protocolName: "Demo",
          protocolSlug: "the-sandbox",
          protocolType: "GameFi",
          logo: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/logo_images/the-sandbox.jpg",
          nftCollectionAddress: [
            {
              address: "0xa342f5d851e866e18ff98f351f2c6637f4478db5",
              chain: "Ethereum",
            },
          ],
          tokenAddress: [
            {
              address: "0x3845badade8e6dff049820680d1f14bd3903a5d0",
              chain: "Ethereum",
            },
          ],
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
    console.log("current_tab", current_tab)
    if (!projectObject || !currentMenu || !gaMenuTabs) {
      return <LoadingSpinner message="Loading..." />;
    }
    const WrapPublicDashboard = current_tab =>
      getProjectObject()?.protocolSlug ? (
        <>
          <PublicDashboard
            params={{ uuid: gaMenuTabs?.dashboardMap?.get(current_tab) }}
            location={location}
            project={getProjectObject()}
            isFullscreen={false}
            hideTitle={true}
            key={projectObject?.protocolSlug}
            hideFooter
          />
          {/* all dashboart except twitter and discord , need a mask when no protocol */}
          {getProjectObject()?.origin_protocol_slug === "default" &&
          !["twitter", "discord"].includes(currentMenu) && (
            <DashboardMask currentMenu={"set_protocol"} router={router} />
          )}
        </>
      ) : (
        <LoadingSpinner message="Loading..." />
      );
    if (
      current_tab === "UserTemplate" ||
      current_tab === "build_audience" ||
      current_tab === "find_wallets" ||
      current_tab === "Potential Users"
    ) {
      return (
        <FindWallets
          location={location}
          router={router}
          projectId={getLatestGAProjectId()}
          projectPath={projectPath}
        ></FindWallets>
      );
    }
    if (["games-manage"].includes(current_tab)) {
      return (
        <GameList
          location={location}
          router={router}
          // project={getProjectObject()}
        />
      );
    }
    if (
      current_tab === "journey" || current_tab === "journey-platform"
    ) {
      return (
        <Journey
          location={location}
          router={router}
          projectId={getLatestGAProjectId()}
          projectPath={projectPath}
        ></Journey>
      );
    }
    if (
      current_tab === "journey-edit"
    ) {
      return (
        <JourneyEdit
          location={location}
          router={router}
          projectId={getLatestGAProjectId()}
          projectPath={projectPath}
        />
      );
    }
    if (
      current_tab === "journey-list"
    ) {
      return (
        <JourneyList
          location={location}
          router={router}
          projectId={getLatestGAProjectId()}
          projectPath={projectPath}
        />
      );
    }
    /*if (
      current_tab === "project_health"
    ) {
      return (
        <ProjectHealth
          location={location}
          router={router}
          projectId={getLatestGAProjectId()}
          projectPath={projectPath}
        ></ProjectHealth>
      );
    }*/
    if (["airdrop"].includes(current_tab)) {
      return (
        <Airdrop
          location={location}
          router={router}
          project={getProjectObject()}
        />
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

    if (
      ["Wallet Profile", "WalletProfile", "wallet_profile"].includes(
        current_tab,
      )
    ) {
      return (
        <WalletProfile
          location={location}
          router={router}
          project={getProjectObject()}
        />
      );
    }
    if (
      ["My Analysis", "MyAnalysis", "my_analysis", "my_analytics"].includes(
        current_tab,
      )
    ) {
      return (
        // <MyAnalysis
        //   location={location}
        //   router={router}
        //   project={getProjectObject()}
        // />
        <MyAnalysisList
          location={location}
          router={router}
          project={getProjectObject()}
        />
      );
    }
    if (["Connector", "integration"].includes(current_tab)) {
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
    if (["Channel", "channel"].includes(current_tab)) {
      return (
        <ChannelList
          location={location}
          router={router}
          project={getProjectObject()}
          projectId={getLatestGAProjectId()}
        ></ChannelList>
      );
    }
    if (["general", "General"].includes(current_tab)) {
      return (
        <ProjectInfo
          location={location}
          router={router}
          // project={getProjectObject()}
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
        "id_connect",
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
    if (["Community", "Members", "members-platform", "members"].includes(current_tab)) {
      return (
        <Community
          location={location}
          router={router}
          project={getProjectObject()}
        ></Community>
      );
    }
    if (["Potential Users List", "Potential Users", "find_potential_wallets"].includes(current_tab)) {
      return (
        <PotentialUsers
          location={location}
          project={getProjectObject()}
          router={router}
        />
      );
    }
    if (
      ["Custom Analysis", "custom_analysis", "custom_analytics", "templates"].includes(
        current_tab,
      )
    ) {
      return (
        <CustomAnalysis
          project={getProjectObject()}
          location={location}
          router={router}
        ></CustomAnalysis>
      );
    }
    if (["CreateCampaign", "CreateActivation"].includes(current_tab)) {
      return (
        <CampaignCreate
          location={location}
          router={router}
          project={getProjectObject()}
          projectId={getLatestGAProjectId()}
        ></CampaignCreate>
      );
    }
    if (["Campaign", "activation", "campaign_list"].includes(current_tab)) {
      // return <CampaignList router={router} location={location}></CampaignList>;
      return (
        <CampaignListNew
          router={router}
          location={location}
          project={getProjectObject()}
        ></CampaignListNew>
      );
    }
    if (["CampaignDetail", "ActivationDetail"].includes(current_tab)) {
      return (
        <CampaignDetail
          router={router}
          location={location}
          projectPath={projectPath}
          project={getProjectObject()}
        ></CampaignDetail>
      );
    }
    if (["Cohort", "segment", "segment-platform"].includes(current_tab)) {
      return (
        <CohortList
          router={router}
          location={location}
          project={getProjectObject()}
        ></CohortList>
      );
    }


    if (gaMenuTabs?.dashboardMap?.has(current_tab)) {
      /*if (["Twitter", "twitter"].includes(current_tab)) {
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
      }*/
      /*if (["Discord", "discord"].includes(current_tab)) {
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
      }*/
      if (["Funnel", "funnel"].includes(current_tab)) {
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
      const twitterEnable = localStorage.getItem("twitterEnable");
      console.log("twitterEnable", twitterEnable)
      if ((twitterEnable !== "enable") && (projectPath === 'TorqueSquad') && ["Twitter", "twitter", "Discord", "discord"].includes(current_tab)) {
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
          <div style={{ display: "relative" }}>
            {currentMenu &&
            projectObject &&
            gaMenuTabs &&
            getContentPannel(currentMenu)}
            {/* TODO: need to add real user fga vip grade */}
            {projectObject?.protocolSlug !== "default" &&
            !checkVipMenuPermisson(
              projectObject?.protocolSlug === "the-sandbox"
                ? "Enterprise"
                : "Free",
              currentMenu,
            ) && <DashboardMask currentMenu={currentMenu} router={router} />}
            {projectObject?.protocolSlug === "default" &&
            ["members"].includes(currentMenu) && (
              <DashboardMask currentMenu={"set_protocol"} router={router} />
            )}
          </div>
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
  return {
    user: getUser(state),
    projectPath: decodeURIComponent(props.params.project),
    projectObject: getFgaProject(state),
    menu: props.params.menu,
  };
};

export default connect(mapStateToProps)(Project);
