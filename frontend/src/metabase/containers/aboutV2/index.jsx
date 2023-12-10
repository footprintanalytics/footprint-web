/* eslint-disable react/prop-types */
import React from "react";
import "./index.css";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { Skeleton } from "antd";
import LazyLoad from "react-lazyload";
import Meta from "metabase/components/Meta";
import { getChannel } from "metabase/selectors/app";
import { createModalShowAction, loginModalShowAction } from "metabase/redux/control";
import AboutDataFeature from "metabase/containers/aboutV2/components/AboutDataFeature";
import AboutDataModel from "metabase/containers/aboutV2/components/AboutDataModel";
import AboutDataTrusted from "metabase/containers/aboutV2/components/AboutDataTrusted";
import AboutDataCoverage from "metabase/containers/aboutV2/components/AboutDataCoverage";
import AboutDemo from "metabase/containers/aboutV2/components/AboutDemo";
import AboutDepth from "metabase/containers/aboutV2/components/AboutDepth";
import AboutPartnerV2 from "metabase/containers/aboutV2/components/AboutPartnerV2";
import HomeFooter from "../home/components/HomeFooter";
import data from "./data";
import AboutBacked from "./components/AboutBacked";
import AboutStart from "./components/AboutStart";
import AboutBanner from "./components/AboutBanner";
import AboutSolutions from "./components/AboutSolutions";
import AboutGrantedBy from "./components/AboutGrantedBy";

const About = props => {
  const {
    children,
  } = props;

  const defaultDesc =
    "Footprint Analytics is a blockchain data solutions provider. We leverage cutting-edge AI technology to help analysts, builders, and investors turn blockchain Web3 data(reference data, wallet profile, money flow, Web3 protocol metadata, and more) and combine web2 data into insights with accessible visualization tools and a powerful multi-chain API across 27+ chains for NFTs, GameFi, and DeFi.";
  const keywords = "Footprint Analytics, Web3 AI, blockchain AI, reference data, wallet profile, money flow, Web3 metadata, Protocol graph, blockchain data, crypto data provider, Web3 data solution, web3 gaming, web3 gaming analytics, web3 gaming data, NFT game, Web3 marketing, web3 growth marketing, Growth Marketing, cross chain data, blockchain data api, Zero coding analytics";
  const title = "Footprint Analytics | Web3 Data Solution Provider with AI technology. ";

  const LazyLoadAbout = ({ children }) => {
    return (
      <LazyLoad
        className="full-height"
        scrollContainer="#app-content"
        placeholder={
          <div style={{ padding: 20 }}>
            <Skeleton active />
          </div>
        }
      >
        {children}
      </LazyLoad>
    );
  };
  return (
    <>
      <Meta description={defaultDesc} keywords={keywords} title={title} />
      <iframe
        src="https://preview.footprint.network/public/dashboard/contract-info-dashboard-fp-25806320-605e-4a95-8756-bb87b53cf9bd"
        frameBorder="0" width={800} height={600} allowTransparency
      />
      {/*<div className="About">*/}
      {/*  <AboutStart />*/}
      {/*  <LazyLoadAbout>*/}
      {/*    <AboutBanner />*/}
      {/*  </LazyLoadAbout>*/}
      {/*  <LazyLoadAbout>*/}
      {/*    <AboutSolutions />*/}
      {/*  </LazyLoadAbout>*/}
      {/*  <LazyLoadAbout>*/}
      {/*    <AboutDepth />*/}
      {/*  </LazyLoadAbout>*/}
      {/*  <LazyLoadAbout>*/}
      {/*    <AboutDemo />*/}
      {/*  </LazyLoadAbout>*/}
      {/*  <LazyLoadAbout>*/}
      {/*    <AboutDataCoverage />*/}
      {/*  </LazyLoadAbout>*/}
      {/*  <LazyLoadAbout>*/}
      {/*    <AboutDataFeature />*/}
      {/*  </LazyLoadAbout>*/}
      {/*  <LazyLoadAbout>*/}
      {/*    <AboutDataModel />*/}
      {/*  </LazyLoadAbout>*/}
      {/*  <LazyLoadAbout>*/}
      {/*    <AboutBacked list={data.backedList} />*/}
      {/*  </LazyLoadAbout>*/}
      {/*  <LazyLoadAbout>*/}
      {/*    <AboutDataTrusted />*/}
      {/*  </LazyLoadAbout>*/}
      {/*  <LazyLoadAbout>*/}
      {/*    <AboutPartnerV2 list={data.partnerList} />*/}
      {/*  </LazyLoadAbout>*/}
      {/*  <LazyLoadAbout>*/}
      {/*    <AboutGrantedBy />*/}
      {/*  </LazyLoadAbout>*/}
      {/*  <div className="About__depth-dividing-line-gray" />*/}
      {/*  <LazyLoadAbout>*/}
      {/*    <HomeFooter />*/}
      {/*  </LazyLoadAbout>*/}

      {/*  {children}*/}
      {/*</div>*/}
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

