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
import BuildMagic from "metabase/containers/solution/components/BuildMagic";
import DataDriven from "metabase/containers/solution/components/DataDriven";
import BatchDownloadData from "metabase/containers/solution/components/BatchDownloadData";
import { getOssUrl } from "metabase/lib/image";
import Meta from "metabase/components/Meta";

const Blockchain = () => {
  const defaultDesc =
    "Gain unparalleled insights with a comprehensive view of on-chain and off-chain data to build, engage, and optimize your games.";
  const keywords = "Blockchains, Blockchain Infrastructure, Public Chains, Data Solution, Blockchain Ecosystem";
  const title = "Tailored Blockchain Data Solutions for Blockchains | Footprint Analytics";

  return (
    <>
      <Meta description={defaultDesc} keywords={keywords} title={title} image={getOssUrl("home-v2/img-seo-Blockchain.jpg", { resize: true })}/>
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
              title: "Footprint Analytics Boosts Core’s Data Efficiency in the Bitcoin Ecosystem",
              img: "https://statichk.footprint.network/home-v2/FootprintCORE.jpg",
              link: "https://www.footprint.network/article/footprint-analytics-boosts-core-s-data-efficiency-in-the-bitcoin-ecosystem-fp-WUQqSVqU",
            },
            {
              title: "Rootstock and Footprint Analytics: Powering DeFi Ecosystem Growth with Data-Driven Insights",
              img: "https://static.footprint.network/home-v2/img-Footprint-Rootstock.jpg?image_process=resize,w_378/crop,h_214/format,jpg",
              link: "https://www.footprint.network/article/rootstock-and-footprint-analytics-powering-defi-ecosystem-growth-with-data-driven-insights-fp-7WupJH8I",
            },
            {
              title: "Footprint Analytics Enhances Data Insights for the Arbitrum Ecosystem",
              img: "https://statichk.footprint.network/article/74e9aa49-c510-4fbd-a7d5-3e58eee7e76d.png?image_process=resize,w_378/crop,h_214/format,png",
              link: "https://www.footprint.network/article/footprint-analytics-enhances-data-insights-for-the-arbitrum-ecosystem-7zphDrd9",
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
