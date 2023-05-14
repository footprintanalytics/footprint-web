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
import AboutGrantedBy from "metabase/containers/aboutV2/components/AboutGrantedBy";
import HomeFooter from "../home/components/HomeFooter";
import data from "./data";
import AboutBacked from "./components/AboutBacked";
import AboutStart from "./components/AboutStart";

const About = props => {
  const {
    children,
  } = props;

  const defaultDesc =
    "Footprint Analytics is a data platform blending web2 and web3 data with abstractions. We help analysts, builders, and investors turn blockchain data into insights with accessible visualization tools and a powerful multi-chain API across 20+ chains for NFTs, GameFi and DeFi. We also provide Footprint Growth Analytics to help with effective growth in GameFi and any web3 projects. Explore and share data from Ethereum, Bitcoin, Polygon, BNB Chain, Solana, Arbitrum, Avalanche, Optimism, Fantom and Harmory Chain and more for free.";
  const keywords = "Footprint Analytics, web3 gaming, web3 gaming analytics, web3 gaming data, NFT game, Web3 marketing, web3 growth marketing, wallet profile, Growth Marketing, cross chain data, blockchain data api, Zero coding analytics";
  const title = "Footprint Analytics | Power Web3 growth marketing in GameFi, NFT and DeFi";

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
      <div className="About">
        <AboutStart />
        <div className="About__depth-dividing-line" />
        <LazyLoadAbout>
          <AboutDepth />
        </LazyLoadAbout>
        <LazyLoadAbout>
          <AboutDemo />
        </LazyLoadAbout>
        <LazyLoadAbout>
          <AboutDataCoverage />
        </LazyLoadAbout>
        <LazyLoadAbout>
          <AboutDataFeature />
        </LazyLoadAbout>
        <LazyLoadAbout>
          <AboutDataModel />
        </LazyLoadAbout>
        <LazyLoadAbout>
          <AboutBacked list={data.backedList} />
        </LazyLoadAbout>
        <LazyLoadAbout>
          <AboutDataTrusted />
        </LazyLoadAbout>
        <LazyLoadAbout>
          <AboutPartnerV2 list={data.partnerList} />
        </LazyLoadAbout>
        <LazyLoadAbout>
          <AboutGrantedBy />
        </LazyLoadAbout>
        <div className="About__depth-dividing-line-gray" />
        <LazyLoadAbout>
          <HomeFooter />
        </LazyLoadAbout>

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
