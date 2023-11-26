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
import { fga_menu_data_v2, getDashboardMap } from "../utils/data";
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
import BindGame from "./bindGame";
import {
  getBindGameMapping,
  getFgaChain,
  getFgaFavoriteList,
  getFgaProjectList,
  getGamesByRedux,
} from "metabase/selectors/control";
import { setGames } from "metabase/redux/control";
import ProjectList from "metabase/ab/containers/projectList";
import KeysIds from "metabase/ab/components/KeysIds";

const Project = props => {
  const {
    router,
    location,
    children,
    user,
    menu,
    projectPath,
    projectObject,
    bindGameMapping,
    chain,
    setGames,
    games,
    favoriteList,
    fgaProjectList,
    businessType,
  } =
    props;
  const [currentMenu, setCurrentMenu] = useState(menu);
  const [gaMenuTabs, setGaMenuTabs] = useState(null);
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
      const menuData = fga_menu_data_v2(businessType, projectObject, chain);
      const menuKeys = menuData.keys;
      const liveKeys = menuData.liveKeys;
      setGaMenuTabs(menuData);
      if (
        !currentMenu ||
        (liveKeys.includes(currentMenu) && !menuKeys.includes(currentMenu))
      ) {
        const firstMenu = menuKeys[0];
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
      setGaMenuTabs(null);
    }
    /*if (projectPath !== "Demo Project") {
      localStorage.setItem("twitterEnable", "");
    }*/
  }, [projectObject, user]);

  if (!businessType) {
    return null;
  }

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
                /*extra={
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
                }*/
              />
            ) : (
              <LoadingSpinner message="Loading..." />
            )}
          </>
        </div>
      </div>
    );
  };

  const renderDashboardMask = () => {
    if (getProjectObject()?.protocolSlug !== "Demo Project" && getProjectObject()?.protocolSlug && projectObject?.nftCollectionAddress?.length === 0 &&
      ["nft_summary", "nft_sales_mints", "nft_listing", "nft_nft_holder", "nft_leaderboard"].includes(currentMenu)) {
      return (
        <DashboardMask currentMenu={"nft"} originCurrentMenu={currentMenu} router={router}
                       project={getProjectObject()} />
      );
    }
    if (getProjectObject()?.protocolSlug !== "Demo Project" && getProjectObject()?.protocolSlug && projectObject?.tokenAddress?.length === 0 &&
      ["game_tokenomics"].includes(currentMenu)) {
      return (
        <DashboardMask currentMenu={"token"} originCurrentMenu={currentMenu} router={router}
                       project={getProjectObject()} />
      );
    }
    if (getProjectObject()?.protocolSlug !== "Demo Project" && !getProjectObject()?.existsWeb2Data && getProjectObject()?.protocolSlug &&
      ["nft_listing", "acquisition_users", "gaming_engagement", "user_retention", "revenue-total-revenue", "twitter", "discord"].includes(currentMenu)) {
      return (
        <DashboardMask currentMenu={"enterprise"} originCurrentMenu={currentMenu} router={router}
                       project={getProjectObject()} />
      );
    }
  };

  const getContentPanel = current_tab => {
    // if (!projectObject || !currentMenu || !gaMenuTabs) {
    //   return <LoadingSpinner message="Loading..." />;
    // }
    const WrapPublicDashboard = current_tab =>
      getProjectObject()?.protocolSlug ? (
        <>
          <PublicDashboard
            params={{ uuid: getDashboardMap(businessType, projectObject, chain)?.get(current_tab) }}
            location={location}
            project={getProjectObject()}
            router={router}
            chain={chain}
            fgaMenu={currentMenu}
            favoriteList={favoriteList}
            projectList={fgaProjectList}
            isFullscreen={false}
            hideTitle={true}
            key={`${chain}${projectObject?.protocolSlug}${current_tab}`}
            hideFooter
          />
          {/* all dashboart except twitter and discord , need a mask when no protocol */}
          {/*{(getProjectObject()?.protocolSlug === "default" || !getProjectObject()?.protocolSlug) &&*/}
          {/*!["twitter", "discord"].includes(currentMenu) && (*/}
          {/*  <DashboardMask currentMenu={"set_protocol"} router={router} />*/}
          {/*)}*/}
          {/*{businessType === "game" && getProjectObject()?.protocolSlug !== "Demo Project" && getProjectObject()?.protocolSlug &&*/}
          {/*["revenue-web2-revenue", "revenue-total-revenue", "web2_user_acquisition", "web2_user_engagement", "web2_user_retention", "web2_stats", "twitter", "discord"].includes(currentMenu) && (*/}
          {/*  <DashboardMask currentMenu={"web2_connect"} originCurrentMenu={currentMenu} router={router} project={getProjectObject()}/>*/}
          {/*)}*/}
          {/*Enterprise*/}
          {renderDashboardMask()}
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
    if (!(bindGameMapping[projectObject?.protocolName] && [
      "project_health",
      "project_overlap",
      "nft_summary",
      "nft_sales_mints",
      "listing",
      "gaming_overview",
      "gaming_user",
      "gaming_engagement",
      "gaming_spend",
      "nft_nft_holder",
      "user_profile",
      "project_health-platform",
    ].includes(current_tab)) && projectPath === "duke" && current_tab !== "integration") {
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
    if (["bind-game"].includes(current_tab)) {
      return (
        <BindGame
          location={location}
          router={router}
          // project={getProjectObject()}
        />
      );
    }
    if (["all-projects"].includes(current_tab)) {
      return (
        <ProjectList
          location={location}
          router={router}
          businessType={businessType}
          // project={getProjectObject()}
        />
      );
    }
    if (
      current_tab === "journey" || current_tab === "journey-platform"
    ) {
      if (getProjectObject()?.protocolSlug !== "Demo Project" && getProjectObject()?.protocolSlug) {
        return <DashboardMask currentMenu={"web2_connect"} originCurrentMenu={currentMenu} router={router} project={getProjectObject()}/>;
      }
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
      !projectObject?.nftCollectionAddress?.filter(item => item.chain === chain)?.length > 0
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
          businessType={businessType}
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
        />
      );
    }
    if (["general", "General"].includes(current_tab)) {
      return (
        <ProjectInfo
          location={location}
          router={router}
          businessType={businessType}
          // project={getProjectObject()}
        />
      );
    }
    if (["keys-ids"].includes(current_tab)) {
      return (
        <KeysIds
          location={location}
          router={router}
          businessType={businessType}
        />
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
          businessType={businessType}
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
    /* if (["Cohort", "segment", "segment-platform"].includes(current_tab)) {
       return (
         <CohortList
           router={router}
           location={location}
           project={getProjectObject()}
           businessType={businessType}
         ></CohortList>
       );
     }*/


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
      // const twitterEnable = localStorage.getItem("twitterEnable");
      /*if ((twitterEnable !== "enable") && (projectPath === 'TorqueSquad' || projectPath === 'Mocaverse' || projectPath === 'duke' || projectPath === 'xxx') && ["Twitter", "twitter", "Discord", "discord"].includes(current_tab)) {
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
      }*/
      return WrapPublicDashboard(current_tab);
    }
    return comingSoon("");
  };
  return (
    <>
      {projectObject ? (
        <>
          <div style={{ display: "relative" }} key={currentMenu}>
            {getContentPanel(currentMenu)}
          </div>
        </>
      ) : (
        <div style={{ marginTop: 40 }}>
          <LoadingSpinner message="Loading project data..." />
        </div>
      )}
    </>
  );
};

const mapDispatchToProps = {
  setGames: setGames,
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectPath: decodeURIComponent(props.params?.project),
    projectObject: getFgaProject(state),
    chain: getFgaChain(state),
    games: getGamesByRedux(state),
    menu: props.params?.menu,
    businessType: props.params?.businessType,
    bindGameMapping: getBindGameMapping(state),
    favoriteList: getFgaFavoriteList(state),
    fgaProjectList: getFgaProjectList(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Project);
