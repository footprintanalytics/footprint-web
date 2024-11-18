/* eslint-disable react/prop-types */
import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import { Layout, Skeleton } from "antd";
import { Content } from "antd/lib/layout/layout";
import { push } from "react-router-redux";
import { getFgaProject, getUser } from "metabase/selectors/user";
import { getOssUrl } from "metabase/lib/image";
import Meta from "metabase/components/Meta";
import { createFgaProjectModalShowAction, loadFgaProjectList, loginModalShowAction } from "metabase/redux/control";
import { refreshCurrentFgaProjectChartType } from "metabase/redux/user";
import { getFgaDashboardKey, getFgaProjectList } from "metabase/selectors/control";
import FgaCreateProjectGuide from "metabase/ab/components/FgaCreateProjectGuide";
import { StateContext, StateProvider } from "./StateProvider";
import "../css/index.css";
import GaSidebar from "./GaSidebar";

const ABLayout = props => {
  const pathname = location.pathname;
  const isHideSidebar = pathname.includes("/fga/chart");
  return (
    <StateProvider>
      <LayoutView {...props} isChart={isHideSidebar}/>
    </StateProvider>
  );
};

const LayoutView = props => {
  const { isOpenSubMenu } = useContext(StateContext);
  const { fgaDashboardKey, user, projectObject, setLoginModalShow, setCreateFgaProjectModalShowAction, fgaProjectList, refreshCurrentFgaProjectChartType } = props;
  const isGamesManage = window.location.pathname.startsWith("/fga/") && window.location.pathname.includes("project-manage")
  const isProjectList = window.location.pathname.startsWith("/fga/") && window.location.pathname.includes("project-list")
  const isBindGame = window.location.pathname.startsWith("/fga/") && window.location.pathname.includes("bind-game")
  const showSidebar = !props.isChart || isGamesManage || isBindGame || isProjectList;
  const defaultDesc =
    "Unlock your growth potential in a web3 world. Dive into data insights and get an edge in your marketing strategy with Footprint GA by bringing all of your Web2 and Wed3 data sources together.";
  const keywords =
    "Footprint Analytics, web3 gaming, web3 gaming analytics, web3 gaming data, NFT game, Web3 marketing, web3 growth marketing, wallet profile, Growth Marketing, cross chain data, blockchain data api, Zero coding analytics";
  const title =
    "Growth Analytics | Unlock your growth potential in a web3 world";
  const isProFga = window.location.pathname.startsWith("/fga/pro")

  const isPayStandard = !!user?.vipInfoFga?.find(vipInfo => vipInfo.type === "fga_standard" && !vipInfo.isExpire);

  useEffect(() => {
    const getFgaProjectChartTypeStatus = () => {
      if (projectObject) {
        refreshCurrentFgaProjectChartType(projectObject?.id)
      }
    }
    const intervalId = setInterval(getFgaProjectChartTypeStatus, 20000);
    return () => clearInterval(intervalId);
  }, [projectObject]);

  if (isProFga //限制 pro 版本fga，区分于 demo
    && !fgaDashboardKey //主要用于刷新
    && !user) {
    return(
      <FgaCreateProjectGuide
        {...props}
        user={user}
        setLoginModalShow={setLoginModalShow}
        setCreateFgaProjectModalShowAction={setCreateFgaProjectModalShowAction}
        fgaProjectList={fgaProjectList}
      />
    )
  }

  if (isProFga && !fgaProjectList) {
    return (
      <div className="flex flex-col h-full " style={{background: '#101014', padding: 20}}>
        <Skeleton active />
      </div>
    )
  }
  if (isProFga //限制 pro 版本fga，区分于 demo
    && !fgaDashboardKey //主要用于刷新
      && (
        fgaProjectList?.length <= 1 // 未创建项目
      || !isPayStandard // 未购买标准版
    )) {
    return (
      <FgaCreateProjectGuide
        {...props}
        user={user}
        setLoginModalShow={setLoginModalShow}
        setCreateFgaProjectModalShowAction={setCreateFgaProjectModalShowAction}
        fgaProjectList={fgaProjectList}
      />
    )
  }

  return (
    <>
      <Meta
        description={defaultDesc}
        keywords={keywords}
        title={title}
        image={getOssUrl("20230303142500.jpg")}
        imageWidth={1200}
        imageHeight={630}
        siteName="Footprint Growth Analytics"
      />
      <Layout
        hasSider
        className={`ga-layout ab-page h-full ${
          isOpenSubMenu ? "" : "ga-layout--hide-sub-menu"
        }`}
        style={{ backgroundColor: "#101014" }}
      >
        {showSidebar && <GaSidebar />}
        <Content
          className="h-full ga-layout__content"
          // style={{ marginLeft: props.isChart ? 0 : 250 }}
        >
          {props.children}
        </Content>
      </Layout>
    </>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
    projectObject: getFgaProject(state),
    fgaProjectList: getFgaProjectList(state),
    chartTypeStatus: state?.currentFgaProject?.chartTypeStatus,
    fgaDashboardKey: getFgaDashboardKey(state),
  };
};

const mapDispatchToProps = {
  onChangeLocation: push,
  setLoginModalShow: loginModalShowAction,
  setCreateFgaProjectModalShowAction: createFgaProjectModalShowAction,
  loadFgaProjectList: loadFgaProjectList,
  refreshCurrentFgaProjectChartType,
};

export default connect(mapStateToProps, mapDispatchToProps)(ABLayout);
