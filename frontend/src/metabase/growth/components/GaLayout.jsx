/* eslint-disable react/prop-types */
import React, { useContext } from "react";
import { connect } from "react-redux";
import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import { getUser } from "metabase/selectors/user";
import { getOssUrl } from "metabase/lib/image";
import Meta from "metabase/components/Meta";
import { StateProvider, StateContext } from "./StateProvider";
import "../css/index.css";
import GaSidebar from "./GaSidebar";

const GaLayout = props => {
  return (
    <StateProvider>
      <LayoutView {...props} />
    </StateProvider>
  );
};

const LayoutView = props => {
  const { isOpenSubMenu } = useContext(StateContext);
  const defaultDesc =
    "Unlock your growth potential in a web3 world. Dive into data insights and get an edge in your marketing strategy with Footprint GA by bringing all of your Web2 and Wed3 data sources together.";
  const keywords =
    "Footprint Analytics, web3 gaming, web3 gaming analytics, web3 gaming data, NFT game, Web3 marketing, web3 growth marketing, wallet profile, Growth Marketing, cross chain data, blockchain data api, Zero coding analytics";
  const title =
    "Growth Analytics | Unlock your growth potential in a web3 world";
  return (
    <>
      <Meta
        description={defaultDesc}
        keywords={keywords}
        title={title}
        image={getOssUrl("20230303142500.jpg")}
        imageWidth={1200}
        imageHeight={630}
        siteName="Footprint Growth Analytics"
      />
      <Layout
        hasSider
        className={`ga-layout h-full ${
          isOpenSubMenu ? "" : "ga-layout--hide-sub-menu"
        }`}
      >
        <GaSidebar />
        <Content
          className="h-full ga-layout__content"
          style={{ marginLeft: 250 }}
        >
          {props.children}
        </Content>
      </Layout>
    </>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(GaLayout);
