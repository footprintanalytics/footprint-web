/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";
import ScrollToTop from "metabase/hoc/ScrollToTop";
import Navbar from "metabase/nav/containers/Navbar";

import { IFRAMED, initializeIframeResizer } from "metabase/lib/dom";

import UndoListing from "metabase/containers/UndoListing";
import AppErrorCard from "metabase/components/AppErrorCard/AppErrorCard";
import Index from "metabase/components/GlobalContactPanel/";
import Meta from "metabase/components/Meta";

import {
  Archived,
  NotFound,
  GenericError,
  Unauthorized,
} from "metabase/containers/ErrorPages";
import { getOssUrl } from "./lib/image";
import { setChannel } from "metabase/redux/app";

const mapStateToProps = (state, props) => ({
  errorPage: state.app.errorPage,
  currentUser: state.currentUser,
  loginPage: props.router.location.pathname.startsWith("/auth/login"),
});

const mapDispatchToProps = {
  setChannel,
};

const getErrorComponent = ({ status, data, context }) => {
  if (status === 403) {
    return <Unauthorized />;
  } else if (status === 404) {
    return <NotFound />;
  } else if (
    data &&
    data.error_code === "archived" &&
    context === "dashboard"
  ) {
    return <Archived entityName="dashboard" linkTo="/dashboards/archive" />;
  } else if (
    data &&
    data.error_code === "archived" &&
    context === "query-builder"
  ) {
    return <Archived entityName="question" linkTo="/questions/archive" />;
  } else {
    return <GenericError details={data && data.message} />;
  }
};

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {
  state = {
    errorInfo: undefined,
  };

  constructor(props) {
    super(props);
    initializeIframeResizer();
  }

  componentDidMount() {
    this.handleChannel();
  }

  handleChannel = () => {
    const { location, setChannel } = this.props;
    const channel = location.query.channel || location.query.cnl || "homepage";
    setChannel(channel);
    window.gtag("set", "user_properties", { channel: channel });
  };

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
  }

  render() {
    const { children, loginPage, location, errorPage } = this.props;
    const { errorInfo } = this.state;
    return (
      <React.Fragment>
        <Meta
          title="Footprint Analytics"
          // description="Explore Cross-Chain Web3.0 Data about NFTs, GameFi, Metaverse and DeFi(Decentralized Finance) DApps here. A platform for discovering and visualizing blockchain data without coding."
          image={getOssUrl("Footprint.jpeg")}
          imageWidth={1200}
          imageHeight={630}
          siteName="Footprint"
          viewport={0.3}
        />
        <ScrollToTop>
          <div className="relative">
            {!loginPage && !IFRAMED && <Navbar location={location} />}
            {errorPage ? getErrorComponent(errorPage) : children}
            <UndoListing />
            <Index />
          </div>
          <AppErrorCard errorInfo={errorInfo} />
        </ScrollToTop>
      </React.Fragment>
    );
  }
}
