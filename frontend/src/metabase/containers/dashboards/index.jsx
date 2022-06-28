/* eslint-disable react/prop-types */
import React from "react";
import "./index.css";
import Recommendations from "./components/Recommendations";
import Dashboards from "./components/Dashboards";
import News from "./components/News";
import HomeFooter from "metabase/containers/home/components/HomeFooter";
import { connect } from "react-redux";
import Meta from "metabase/components/Meta";
import MetaViewportControls from "metabase/dashboard/hoc/MetaViewportControls";
import { compose } from "underscore";
import title, { updateTitle } from "metabase/hoc/Title";
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
    "Footprint is a powerful yet easy-to-use analytics tool to uncover and visualize blockchain data. The product puts user experience first whether you’re an analyst, data scientist, developer, student, teacher, or executive. It provides an intuitive, drag-and-drop interface for interactive data queries.";
  const keywords = "Footprint";
  const title = "Footprint Analytics: Crypto Analysis Dashboards";

  return (
    <>
      <Meta description={defaultDesc} keywords={keywords} title={title} />
      <div className="dashboards__wrap" data-nosnippet>
        <Recommendations />
        <div className="dashboards__layout">
          <Dashboards user={user} router={router} />
          <div className="dashboards__layout-side">
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
