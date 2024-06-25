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
          title={<>Integrate Blockchain <br/>Into Footprint at <br/>Lightning Speed</>}
          desc={<>Footprint combines the most powerful web3 products <br/>and tools with resources, community and support.</>}
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
              title: "Ronin",
              img: "https://statichk.footprint.network/article/85a03753-98a3-44d2-9ad8-69bee501e9e3.png",
              link: "https://www.footprint.network/article/introducing-ronin-network-the-blockchain-for-gaming-GEURjEyl",
              height: 286,
            },
            {
              title: "Merlin",
              img: getOssUrl("solution/img-merlin-article-1.jpeg"),
              link: "https://x.com/Footprint_Data/status/1795787071380238831",
              height: 286,
            },
            {
              title: "Core",
              img: "https://statichk.footprint.network/article/435e8363-367f-49fe-8885-cb1d49752186.jpeg",
              link: "https://www.footprint.network/article/exploring-core-chain-and-its-core-competency-rJ6oHpgr",
              height: 286,
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
