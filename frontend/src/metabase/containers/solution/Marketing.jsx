/* eslint-disable react/prop-types */
import React from "react";
import "./index.css";
import { connect } from "react-redux";
import { loginModalShowAction } from "metabase/redux/control";
import { push } from "react-router-redux";
import BatchDownloadStart from "metabase/containers/solution/components/BatchDownloadStart";
import BatchDownloadReady from "metabase/containers/solution/components/BatchDownloadReady";
import HomeFooter from "metabase/containers/home/components/HomeFooter";
import UserGrowth from "metabase/containers/solution/components/UserGrowth";
import Engine from "metabase/containers/solution/components/Engine";
import Drive from "metabase/containers/solution/components/Drive";
import Meta from "metabase/components/Meta";
import { getOssUrl } from "metabase/lib/image";

const Marketing = () => {
  const defaultDesc =
    "Comprehensive wallet analysis for precise, high-quality user acquisition and retention.\n";
  const keywords = "Web3 Growth, User Acquisition, User Retention, Blockchain Data, Wallet Analysis, Token Analysis";
  const title = "Tailored Blockchain Data Solution for User Acquisition | Footprint Analytics";

  return (
    <>
      <Meta description={defaultDesc} keywords={keywords} title={title} image={getOssUrl("home-v2/img-seo-Marketing.jpg", { resize: true })}/>
      <div className="solution__about">
        <BatchDownloadStart
          title={<>Unlock Your Potential With <br/>Data-Driven Customer<br/>Acquisition</>}
          desc={<>Comprehensive wallet analysis for precise, <br />high-quality user acquisition and retention.</>}
          image={"https://static.footprint.network/solution/img-marketing-head.png"}
          marginRight={480}
          descColor={"#ffffff"}
        />
        <UserGrowth type={"marketing"} gap={190}/>
        <Engine />
        <Drive />
        <BatchDownloadReady title={"Let’s Get Started! Contact Our\nExperts Now!"} paddingRight={500}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Marketing);
