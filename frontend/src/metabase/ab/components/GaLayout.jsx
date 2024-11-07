/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { Button, Card, Layout, message, Skeleton } from "antd";
import { Content } from "antd/lib/layout/layout";
import { getFgaProject, getUser } from "metabase/selectors/user";
import { getOssUrl } from "metabase/lib/image";
import Meta from "metabase/components/Meta";
import { StateProvider, StateContext } from "./StateProvider";
import "../css/index.css";
import GaSidebar from "./GaSidebar";
import { createFgaProjectModalShowAction, loadFgaProjectList, loginModalShowAction } from "metabase/redux/control";
import { push } from "react-router-redux";
import { getFgaProjectList, getUserExtend } from "metabase/selectors/control";
import FgaCreateProjectGuide from "metabase/ab/components/FgaCreateProjectGuide";

const ABLayout = props => {
  const pathname = location.pathname;
  const isHideSidebar = pathname.includes("/fga/chart");
  return (
    <StateProvider>
      <LayoutView {...props} isChart={isHideSidebar} />
    </StateProvider>
  );
};

const LayoutView = props => {
  const { isOpenSubMenu } = useContext(StateContext);
  const { user, projectObject, setLoginModalShow, setCreateFgaProjectModalShowAction, userExtend, fgaProjectList, loadFgaProjectList } = props;
  const isGamesManage = window.location.pathname.startsWith("/fga/") && window.location.pathname.includes("project-manage")
  const isProjectList = window.location.pathname.startsWith("/fga/") && window.location.pathname.includes("project-list")
  const isBindGame = window.location.pathname.startsWith("/fga/") && window.location.pathname.includes("bind-game")
  const [isFirst, setFirst] = useState(true);
  const showSidebar = !props.isChart || isGamesManage || isBindGame || isProjectList;
  const defaultDesc =
    "Unlock your growth potential in a web3 world. Dive into data insights and get an edge in your marketing strategy with Footprint GA by bringing all of your Web2 and Wed3 data sources together.";
  const keywords =
    "Footprint Analytics, web3 gaming, web3 gaming analytics, web3 gaming data, NFT game, Web3 marketing, web3 growth marketing, wallet profile, Growth Marketing, cross chain data, blockchain data api, Zero coding analytics";
  const title =
    "Growth Analytics | Unlock your growth potential in a web3 world";
  const isProFga = window.location.pathname.startsWith("/fga/pro")

  // useEffect(() => {
  //   if (isProFga) {
  //     if (!user) {
  //       setLoginModalShow({ show: true, from: "" });
  //       return
  //     }
  //
  //     if (!projectObject?.id) {
  //       setCreateFgaProjectModalShowAction({ show: true });
  //       return
  //     }
  //   }
  // }, [setLoginModalShow, user, projectObject]);
  //

/*  useEffect(() => {
    const showCreateProjectModal = async () => {
      if (!isFirst) {
        return
      }
      const result = await loadFgaProjectList({ from: "pro" });
      setFirst(false)
      const projectList = result?.payload
      if (projectList?.length === 1) {
        setCreateFgaProjectModalShowAction({ show: true });
      }
    }
    if (isProFga && user && fgaProjectList?.length === 1) {
      console.log("auto create project", fgaProjectList)
      showCreateProjectModal()

    }
  }, [fgaProjectList, user])*/

  if (isProFga && (!user || (fgaProjectList?.length <= 1))) {
    return (
      <FgaCreateProjectGuide user={user} setLoginModalShow={setLoginModalShow} setCreateFgaProjectModalShowAction={setCreateFgaProjectModalShowAction} fgaProjectList={fgaProjectList}/>
    )
  }

  if (isProFga && !fgaProjectList) {
    return (
      <div className="flex flex-col h-full " style={{background: '#101014', padding: 20}}>
        <Skeleton active />
      </div>
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
  console.log("statestatestate", state)
  return {
    user: getUser(state),
    userExtend: getUserExtend(state),
    projectObject: getFgaProject(state),
    fgaProjectList: getFgaProjectList(state),
    chartTypeStatus: state?.currentFgaProject?.chartTypeStatus
  };
};

const mapDispatchToProps = {
  onChangeLocation: push,
  setLoginModalShow: loginModalShowAction,
  setCreateFgaProjectModalShowAction: createFgaProjectModalShowAction,
  loadFgaProjectList: loadFgaProjectList,
};

export default connect(mapStateToProps, mapDispatchToProps)(ABLayout);
