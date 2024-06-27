/* eslint-disable react/prop-types */
import React from "react";
import "./index.css";
import { connect } from "react-redux";
import { loginModalShowAction } from "metabase/redux/control";
import { push } from "react-router-redux";
import BatchDownloadStart from "metabase/containers/solution/components/BatchDownloadStart";
import BatchDownloadReady from "metabase/containers/solution/components/BatchDownloadReady";
import HomeFooter from "metabase/containers/home/components/HomeFooter";
import UserGrowth from "metabase/containers/solution/components/UserGrowth";
import Engine from "metabase/containers/solution/components/Engine";
import Drive from "metabase/containers/solution/components/Drive";
import BuildMagic from "metabase/containers/solution/components/BuildMagic";
import DataDriven from "metabase/containers/solution/components/DataDriven";
import BatchDownloadData from "metabase/containers/solution/components/BatchDownloadData";
import { getOssUrl } from "metabase/lib/image";

const Blockchain = () => {
  // const defaultDesc =
  //   "Download blockchain historical data in one batch. Start building DApps immediately, not in months. Built for money tracking, backtesting, machine learning, and more.";
  // const keywords = "Footprint Analytics, historical data, blockchain data, cryptocurrency data, NFT data, Ethereum data, BNB chain data, polygon chain data, web3 gaming, web3 gaming analytics, web3 gaming data, NFT game, blockchain AML, wallet profile, Growth Marketing, cross chain data, blockchain data api";
  // const title = "Download blockchain historical data in one batch| A faster and more affordable way to access blockchain data";

  return (
    <>
      {/*<Meta description={defaultDesc} keywords={keywords} title={title} />*/}
      <div className="solution__about">
        <BatchDownloadStart
          title={<>Integrate Blockchain Data<br/>Into Footprint Analytics at <br/>Lightning Speed</>}
          desc={<>Footprint Analytics combines the most powerful web3 products <br/>and tools with resources, community and support.</>}
          image={"https://static.footprint.network/solution/img-blockchain-head.png"}
          marginRight={630}
          descColor={"#ffffff"}
        />
        <UserGrowth type={"blockchain"} gap={140}/>
        <BuildMagic />
        <DataDriven />
        <BatchDownloadData practices={
          [
            {
              title: "Footprint Analytics Integrates Data Solutions on Ronin Network",
              img: "https://statichk.footprint.network/article/50e53359-6bd9-4793-8c64-9610056c421f.png",
              link: "https://www.footprint.network/article/footprint-analytics-integrates-data-solutions-on-ronin-network-KgAq6WGF",
            },
            {
              title: "Forging a More Transparent Bitcoin Ecosystem Powered by Data",
              img: getOssUrl("solution/img-merlin-article-1.jpeg"),
              link: "https://x.com/Footprint_Data/status/1795787071380238831",
            },
            {
              title: "Footprint Analytics Joins Forces with Core Chain to Elevate Blockchain Infrastructure and Innovation",
              img: "https://statichk.footprint.network/article/435e8363-367f-49fe-8885-cb1d49752186.jpeg",
              link: "https://www.footprint.network/article/footprint-analytics-joins-forces-with-core-chain-to-elevate-blockchain-infrastructure-and-innovation-3FhfKU85",
            },
          ]
        }/>
        <BatchDownloadReady title={"Contact Us for Blockchain \nIndexing!"} paddingRight={500} bg={"solution__ready-bg2"}/>
        <div style={{ height: 100, background: "#06061E" }}/>
        <div className="solution__dividing-line-gray" />
        <HomeFooter />
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

export default connect(mapStateToProps, mapDispatchToProps)(Blockchain);
