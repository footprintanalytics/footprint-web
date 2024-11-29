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
import AboutPartnerV2 from "metabase/containers/aboutV2/components/AboutPartnerV2";
import HomeFooter from "../home/components/HomeFooter";
import data from "./data";
import AboutBacked from "./components/AboutBacked";
import AboutStart from "./components/AboutStart";
import AboutBanner from "./components/AboutBanner";
import AboutSolutions from "./components/AboutSolutions";
import AboutGrantedBy from "./components/AboutGrantedBy";
import { useQuery } from "react-query";
import { getMediaTagTop } from "metabase/new-service";
import { QUERY_OPTIONS_NORMAL } from "metabase/containers/dashboards/shared/config";
import { get } from "lodash";
const About = props => {
  const {
    children,
  } = props;

  const { data: articleTopData } = useQuery(
    ["getMediaTagTop"],
    async () => {
      return await getMediaTagTop({ tag: "Monthly Reports" });
    },
    {...QUERY_OPTIONS_NORMAL },
  );

  const defaultDesc =
    "Footprint Analytics is a comprehensive blockchain data analytics platform that simplifies analysis and community management for sustainable growth in Web3 projects.";
  const keywords = "Footprint Analytics, Web3 AI, blockchain AI, reference data, wallet profile, money flow, Web3 metadata, Protocol graph, blockchain data, crypto data provider, Web3 data solution, web3 gaming, web3 gaming analytics, web3 gaming data, NFT game, Web3 marketing, web3 growth marketing, Growth Marketing, cross chain data, blockchain data api, Zero coding analytics";
  const title = "Footprint Analytics | Web3 Data Solution Provider with AI Technology. ";

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

  const articleThumbnail = get(articleTopData, "[0].thumbnail")

  return (
    <>
      <Meta description={defaultDesc} keywords={keywords} title={title} link={"https://www.footprint.network/"}/>
      <div className="About">
        <AboutStart />
        <AboutPartnerV2 list={data.partnerList} />
        <AboutBanner />
        <AboutSolutions />
        {/*<AboutDepth />*/}
        <AboutDemo />
        <AboutDataCoverage />
        <LazyLoadAbout>
          <AboutDataFeature thumbnail={articleThumbnail}/>
        </LazyLoadAbout>
        <AboutDataModel />
        <AboutDataTrusted />
        <AboutBacked list={data.backedList} />
        <AboutGrantedBy />
        <div className="About__depth-dividing-line-gray" />
        <HomeFooter />
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

