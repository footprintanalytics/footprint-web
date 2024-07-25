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
// import { TaskList, Community } from '@pea-ai/growth-sdk'
// import '@pea-ai/growth-sdk/dist/style.css'
const About = props => {
  const {
    children,
  } = props;

  const defaultDesc =
    "Footprint Analytics is a blockchain data solutions provider. We leverage cutting-edge AI technology to help analysts, builders, and investors turn blockchain data and combine Web2 data into insights with accessible visualization tools and a powerful multi-chain API across 30+ chains for NFTs, games, wallet profiles, and money flow data.";
  const keywords = "Footprint Analytics, Web3 AI, blockchain AI, reference data, wallet profile, money flow, Web3 metadata, Protocol graph, blockchain data, crypto data provider, Web3 data solution, web3 gaming, web3 gaming analytics, web3 gaming data, NFT game, Web3 marketing, web3 growth marketing, Growth Marketing, cross chain data, blockchain data api, Zero coding analytics";
  const title = "Footprint Analytics | Web3 Data Solution Provider with AI Technology. ";

  const values = {
    questId: '66a2427aefe7f900111f0a74',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Njc1NDhkYzlmYTNkMDAwMTE1NWI3NDEiLCJpYXQiOjE3MjE4OTI2MjIsImV4cCI6MTcyNDQ4NDYyMn0.7fv0mh3Lfv6utnMFwV9KAyaAvLK54QpsKsT9cM5HCZo',
    theme: 'dark',
    handle: 'bevm',
  }

  return (
    <>
      <Meta description={defaultDesc} keywords={keywords} title={title} link={"https://www.footprint.network/"}/>
      <div className="About">
        {/*<TaskList questId={values.questId} token={values.token} theme={values.theme} />*/}
        {/*<Community handle={values.handle} theme={values.theme} />*/}
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

