/* eslint-disable react/prop-types */
import React from "react";
import "./index.css";
import { connect } from "react-redux";
import { compose } from "underscore";
import HomeFooter from "metabase/containers/home/components/HomeFooter";
import MetaViewportControls from "metabase/dashboard/hoc/MetaViewportControls";
import Meta from "metabase/components/Meta";
import title, { updateTitle } from "metabase/hoc/Title";
import Profile from "metabase/containers/dashboards/components/Profile";
import Banner from "metabase/containers/dashboards/components/Banner";
import Dashboards from "./components/Dashboards";
import News from "./components/News";
import Creator from "./components/Creator";

const Index = ({ router, user }) => {
  const { category } = router?.location?.query;
  const defaultTitle = "";
  /*let defaultDescKeywords = ["GameFi", "NFTs", "Metaverse", "DeFi"];*/

  if (category) {
    updateTitle(category === "All" ? defaultTitle : `${category} Dashboards`);
    /*if (category !== "All" && category !== "New") {
      defaultDescKeywords = [category];
    }*/
  } else {
    updateTitle(defaultTitle);
  }

  /*  if (tags) {
    if (typeof tags === "string") {
      defaultDescKeywords = uniq([...defaultDescKeywords, tags]);
    } else {
      defaultDescKeywords = uniq([...defaultDescKeywords, ...tags]);
    }
  }*/

  const defaultDesc =
    "Zero coding analytics as Tableau for crypto. Use Footprint real-time on-chain data and uploaded data to build charts and dashboards that showcase cutting-edge blockchain market insights without code using a drag-and-drop interface as well as with SQL.";
  const keywords = "Footprint Analytics, web3 gaming, web3 gaming analytics, web3 gaming data, NFT game, Web3 marketing, web3 growth marketing, wallet profile, Growth Marketing, cross chain data, blockchain data api, Zero coding analytics";
  const title = "Analytics App | Get in-depth analytics and data about Web3 NFT Game";

  return (
    <>
      <Meta description={defaultDesc} keywords={keywords} title={title} />
      <div className="dashboards__wrap" data-nosnippet>
        {/*<Recommendations />*/}
        <Banner />
        <div className="dashboards__layout">
          <Dashboards user={user} router={router} />
          <div className="dashboards__layout-side">
            <Profile />
            <Creator />
            <News />
          </div>
        </div>
      </div>
      <HomeFooter />
    </>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

export default compose(
  connect(mapStateToProps),
  MetaViewportControls,
  title(),
)(Index);
