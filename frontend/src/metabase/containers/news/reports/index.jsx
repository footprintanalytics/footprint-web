/* eslint-disable react/prop-types */
import React from "react";
import { push } from "react-router-redux";
import connect from "react-redux/lib/connect/connect";
import { getChannel } from "metabase/selectors/app";
import "../index.css";
import "../../academy/index.css";
import "../../dashboards/components/Recommendations/index.css";
import Box from "metabase/containers/academy/components/Box";
import Meta from "metabase/components/Meta";

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
        { label: "Industry", value: "Industry" },
      ],
    },
    research: {
      label: "Research",
      value: "research",
      subMenus: [
        // { label: "Daily Reports", value: "Daily Reports" },
        // { label: "Weekly Reports", value: "Weekly Reports" },
        { label: "Monthly Reports", value: "Monthly Reports" },
        { label: "Quarterly Reports", value: "Quarterly Reports" },
        { label: "Yearly Reports", value: "Yearly Reports" },
        { label: "Co-branded Reports", value: "Co-branded reports" },
        { label: "GameFi", value: "GameFi" },
        { label: "NFT", value: "NFT" },
        { label: "DeFi", value: "DeFi" },
        { label: "How-to", value: "How-to" },
        { label: "Industry", value: "Industry" },
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
        { label: "Space", value: "Space" },
        { label: "Data Drive", value: "Data Drive" },
        { label: "Learn From Workshops", value: "Learn From Workshops" },
        { label: "AMA", value: "AMA" },
        { label: "Activities", value: "Activities" },
      ],
    },
    product: {
      label: "Product",
      value: "product",
      subMenus: [
        {
          label: "Spotlight",
          value: "Spotlight",
        },
        { label: "Use Case", value: "Use Case" },
        { label: "Product", value: "Product" },
        { label: "Company", value: "Company" },
        {
          label: "Establishing Strategic Partnerships",
          value: "Establishing Strategic Partnerships",
        },
        // { label: "Pea.AI", value: "Pea.AI" },
        { label: "Space", value: "Space" },
        { label: "Data Drive", value: "Data Drive" },
        { label: "Learn From Workshops", value: "Learn From Workshops" },
        { label: "AMA", value: "AMA" },
        { label: "Activities", value: "Activities" },
      ],
    },
    academy: {
      label: "Academy",
      value: "academy",
      sortBy: "title",
      sortDirection: "asc",
      showPublishTime: false,
      subMenus: [
        {
          label: "Web3 Data",
          value: "Web3 Data",
        },
        { label: "EVM Analysis", value: "EVM Analysis" },
        { label: "NFT Analysis", value: "NFT Analysis" },
        { label: "GameFi Analysis", value: "GameFi Analysis" },
        { label: "DeFi Analysis", value: "DeFi Analysis" },
        { label: "Wallet Analysis", value: "Wallet Analysis" },
        { label: "Footprint for SQL", value: "Footprint for SQL" },
        { label: "Footprint for Developer", value: "Footprint for Developer" },
        { label: "Footprint for Crypto Investor", value: "Footprint for Crypto Investor" },
        { label: "Footprint Analytics Tutorials", value: "Footprint Analytics Tutorials" },
        { label: "Footprint for Marketing", value: "Footprint for Marketing" },
      ],
    },
  };
  const selectCategory = array[type] || {};
  return (
    <>
    <Meta
      title={`${selectCategory?.label} - Footprint Analytics`}
    />
    <div className="news-articles__container news-report__container">
      <Box router={router} selectCategory={selectCategory} />
      {/*<ArticleHot />*/}
    </div>
    </>
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
