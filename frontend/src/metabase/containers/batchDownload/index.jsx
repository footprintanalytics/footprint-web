/* eslint-disable react/prop-types */
import React from "react";
import "./index.css";
import { connect } from "react-redux";
import { loginModalShowAction } from "metabase/redux/control";
import { push } from "react-router-redux";
import Meta from "metabase/components/Meta";
import BatchDownloadStart from "metabase/containers/batchDownload/components/BatchDownloadStart";
import BatchDownloadData from "metabase/containers/batchDownload/components/BatchDownloadData";
import BatchDownloadWhy from "metabase/containers/batchDownload/components/BatchDownloadWhy";
import BatchDownloadHow from "metabase/containers/batchDownload/components/BatchDownloadHow";
import BatchDownloadReady from "metabase/containers/batchDownload/components/BatchDownloadReady";
import HomeFooter from "metabase/containers/home/components/HomeFooter";
import LazyLoad from "react-lazyload";
import { Skeleton } from "antd";

const BatchDownload = () => {
  const defaultDesc =
    "Download blockchain historical data in one batch. Start building DApps immediately, not in months. Built for money tracking, backtesting, machine learning, and more.";
  const keywords = "Footprint Analytics, historical data, blockchain data, cryptocurrency data, NFT data, Ethereum data, BNB chain data, polygon chain data, web3 gaming, web3 gaming analytics, web3 gaming data, NFT game, blockchain AML, wallet profile, Growth Marketing, cross chain data, blockchain data api";
  const title = "Download blockchain historical data in one batch| A faster and more affordable way to access blockchain data";

  const LazyLoadComponent = ({ children }) => {
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
      <div className="batch-download__about">
        <BatchDownloadStart />
        <BatchDownloadData />
        <LazyLoadComponent>
          <BatchDownloadWhy />
        </LazyLoadComponent>
        <LazyLoadComponent>
          <BatchDownloadHow />
        </LazyLoadComponent>
        <LazyLoadComponent>
          <BatchDownloadReady />
        </LazyLoadComponent>
        <div style={{ height: 100, background: "#06061E" }}/>
        <div className="batch-download__dividing-line-gray" />
        <LazyLoadComponent>
          <HomeFooter />
        </LazyLoadComponent>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  user: state.currentUser,
});

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
  onChangeLocation: push,
};

export default connect(mapStateToProps, mapDispatchToProps)(BatchDownload);
