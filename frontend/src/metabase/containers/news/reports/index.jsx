/* eslint-disable react/prop-types */
import React from "react";
import { push } from "react-router-redux";
import connect from "react-redux/lib/connect/connect";
import { getChannel } from "metabase/selectors/app";
import "../index.css";
import "../../academy/index.css";
import "../../dashboards/components/Recommendations/index.css";
import Box from "metabase/containers/academy/components/Box";

const Index = ({ router, type }) => {
  const array = {
    articles: {
      label: "Articles",
      value: "articles",
      subMenus: [
        { label: "GameFi", value: "GameFi" },
        { label: "NFT", value: "NFT" },
        { label: "DeFi", value: "DeFi" },
        { label: "How-to", value: "How-to" },
        { label: "Blockchain", value: "Blockchain" },
        { label: "Industry", value: "Industry" },
      ],
    },
    research: {
      label: "Research",
      value: "research",
      subMenus: [
        { label: "Reports", value: "Reports" },
        { label: "Monthly Reports", value: "Monthly Reports" },
        { label: "Yearly Reports", value: "Yearly Reports" },
        { label: "Co-branded reports", value: "Co-branded reports" },
      ],
    },
    events: {
      label: "Events",
      value: "events",
      subMenus: [
        {
          label: "Establishing Strategic Partnerships",
          value: "Establishing Strategic Partnerships",
        },
        { label: "Activities", value: "Activities" },
        { label: "AMA", value: "AMA" },
        { label: "Twitter", value: "Twitter" },
      ],
    },
  };
  const selectCategory = array[type] || {};
  return (
    <div className="news-articles__container news-report__container">
      <Box router={router} selectCategory={selectCategory} />
      {/*<ArticleHot />*/}
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: state.currentUser,
    channel: getChannel(state, props),
  };
};

const mapDispatchToProps = {
  onChangeLocation: push,
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
