/* eslint-disable react/prop-types */
import React from "react";
import "./index.css";
import { connect } from "react-redux";
import { loginModalShowAction } from "metabase/redux/control";
import { push } from "react-router-redux";
import BatchDownloadStart from "metabase/containers/solution/components/BatchDownloadStart";
import BatchDownloadData from "metabase/containers/solution/components/BatchDownloadData";
import BatchDownloadReady from "metabase/containers/solution/components/BatchDownloadReady";
import HomeFooter from "metabase/containers/home/components/HomeFooter";
import CaseShow from "metabase/containers/solution/components/CaseShow";
import { getOssUrl } from "metabase/lib/image";
import UserGrowth from "metabase/containers/solution/components/UserGrowth";
import Overview from "metabase/containers/solution/components/Overview";
import Meta from "metabase/components/Meta";

const Community = () => {
  const defaultDesc =
    "Footprint Analytics provides a robust framework to build and manage communities.";
  const keywords = "Web3 Growth, Web3 Community, User Growth, Loyalty Incentive System, AI Assistant, User Score";
  const title = "Tailored Blockchain Data Solution for Community Growth | Footprint Analytics";

  return (
    <>
      <Meta description={defaultDesc} keywords={keywords} title={title} image={getOssUrl("home-v2/img-seo-Community.jpg", { resize: true })}/>
      <div className="solution__about">
        <BatchDownloadStart
          title={<>A Long-term Incentive <br/>Program for Users, <br/>Projects, and Ecosystems</>}
          desc={<>Footprint Analytics provides a robust framework to build <br />and manage communities.</>}
          image={"https://static.footprint.network/solution/img-head0.png"}
        />
        <UserGrowth type={"community"}/>
        <Overview />
        <CaseShow/>
        <BatchDownloadData />
        <BatchDownloadReady title={"Don't Wait, Get Started Today!"}/>
        <div style={{ height: 100, background: "#06061E" }}/>
        <div className="solution__dividing-line-gray" />
        <HomeFooter />
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  user: state.currentUser,
});

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
  onChangeLocation: push,
};

export default connect(mapStateToProps, mapDispatchToProps)(Community);
