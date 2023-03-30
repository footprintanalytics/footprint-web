/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import "./index.css";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { Skeleton } from "antd";
import LazyLoad from "react-lazyload";
import AboutExploreDomain from "metabase/containers/about/components/AboutExploreDomain";
import AboutCreateDashboard from "metabase/containers/about/components/AboutCreateDashboard";
import Meta from "metabase/components/Meta";
import {
  getActivityZkspaceRegisterSuccess,
  isRegisterActivityChannel,
  zkspaceDate,
} from "metabase/lib/register-activity";
import ActivityZkspaceFirstModal from "metabase/components/ActivityZkspaceFirstModal";
import * as Urls from "metabase/lib/urls";
import { getChannel } from "metabase/selectors/app";
import {
  createModalShowAction,
  loginModalShowAction,
} from "metabase/redux/control";
import ActivityZkspaceSignupSuccessModal from "metabase/components/ActivityZkspaceSignupSuccessModal";
import HomeFooter from "../home/components/HomeFooter";
import AboutStart from "./components/AboutStart";
import AboutService from "./components/AboutService";
import AboutBuild from "./components/AboutBuild";
import AboutBacked from "./components/AboutBacked";
import AboutPartner from "./components/AboutPartner";
import data from "./data";
import { useQueryIndicator, useQueryNews } from "./hook";
import AboutDataFeature from "metabase/containers/aboutV2/components/AboutDataFeature";
import AboutDataModel from "metabase/containers/aboutV2/components/AboutDataModel";
import AboutDataTrusted from "metabase/containers/aboutV2/components/AboutDataTrusted";
import AboutDataCoverage from "metabase/containers/aboutV2/components/AboutDataCoverage";
import AboutDemo from "metabase/containers/aboutV2/components/AboutDemo";
import AboutDepth from "metabase/containers/aboutV2/components/AboutDepth";
import AboutPartnerV2 from "metabase/containers/aboutV2/components/AboutPartnerV2";

const About = props => {
  const {
    user,
    channel,
    setLoginModalShow,
    onChangeLocation,
    children,
  } = props;
  const { news } = useQueryNews();
  const { indicator } = useQueryIndicator();

  const userId = user && user.id;
  const email = user && user.email;

  const defaultDesc =
    "Footprint Analytics is a data platform blending web2 and web3 data with abstractions. We help analysts, builders, and investors turn blockchain data into insights with accessible visualization tools and a powerful multi-chain API across 20+ chains for NFTs, GameFi and DeFi. We also provide Footprint Growth Analytics to help with effective growth in GameFi and any web3 projects. Explore and share data from Ethereum, Bitcoin, Polygon, BNB Chain, Solana, Arbitrum, Avalanche, Optimism, Fantom and Harmory Chain and more for free.";
  const keywords = "Footprint Analytics, web3 gaming, web3 gaming analytics, web3 gaming data, NFT game, Web3 marketing, web3 growth marketing, wallet profile, Growth Marketing, cross chain data, blockchain data api, Zero coding analytics";
  const title = "Footprint Analytics | Power Web3 growth marketing in GameFi, NFT and DeFi";

  return (
    <>
      <Meta description={defaultDesc} keywords={keywords} title={title} />
      <div className="About">
        <AboutStart />
        <div className="About__depth-dividing-line" />
        <AboutDepth />

        <LazyLoad
          className="full-height"
          scrollContainer="#app-content"
          placeholder={
            <div style={{ padding: 20 }}>
              <Skeleton active />
            </div>
          }
        >
          <>
            <AboutDemo />
            <AboutDataCoverage />
            <AboutDataFeature />
            <AboutDataModel />
            <AboutBacked list={data.backedList}/>
            <AboutDataTrusted />
            <AboutPartnerV2 list={data.partnerList}/>
            <div className="About__depth-dividing-line-gray" />
            <HomeFooter />
          </>
        </LazyLoad>

        {children}
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  user: state.currentUser,
  channel: getChannel(state),
});

const mapDispatchToProps = {
  onChangeLocation: push,
  setLoginModalShow: loginModalShowAction,
  setCreateModalShow: createModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
