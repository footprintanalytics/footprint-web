/* eslint-disable react/prop-types */
import React from "react";
import "./index.css";
import { connect } from "react-redux";
import { loginModalShowAction } from "metabase/redux/control";
import { push } from "react-router-redux";
import BatchDownloadStart from "metabase/containers/solution/components/BatchDownloadStart";
import BatchDownloadData from "metabase/containers/solution/components/BatchDownloadData";
import BatchDownloadReady from "metabase/containers/solution/components/BatchDownloadReady";
import HomeFooter from "metabase/containers/home/components/HomeFooter";
import UserGrowth from "metabase/containers/solution/components/UserGrowth";
import GainView from "metabase/containers/solution/components/GainView";
import DataDrivenGame from "metabase/containers/solution/components/DataDrivenGame";
import { getOssUrl } from "metabase/lib/image";

const Games = () => {
  // const defaultDesc =
  //   "Download blockchain historical data in one batch. Start building DApps immediately, not in months. Built for money tracking, backtesting, machine learning, and more.";
  // const keywords = "Footprint Analytics, historical data, blockchain data, cryptocurrency data, NFT data, Ethereum data, BNB chain data, polygon chain data, web3 gaming, web3 gaming analytics, web3 gaming data, NFT game, blockchain AML, wallet profile, Growth Marketing, cross chain data, blockchain data api";
  // const title = "Download blockchain historical data in one batch| A faster and more affordable way to access blockchain data";

  return (
    <>
      {/*<Meta description={defaultDesc} keywords={keywords} title={title} />*/}
      <div className="solution__about">
        <BatchDownloadStart
          title={<>The Ultimate Gaming <br/>Solution Powers Data-<br/>Decisions.</>}
          desc={<>Gain unparalleled insights with a comprehensive <br />view of on-chain and off-chain data to build, engage, <br />and optimize your games.</>}
          image={"https://static.footprint.network/solution/img-header-games.jpg"}
        />
        <UserGrowth type={"games"}/>
        <GainView />
        <DataDrivenGame />
        <BatchDownloadData practices={
          [
            {
              title: "How Mocaverse Used Data to Launch Its Metaverse",
              img: "https://static.footprint.network/article/57aa4d64-c876-4cf0-a368-207ac0be8558.png",
              link: "https://www.footprint.network/article/how-mocaverse-used-data-to-launch-its-metaverse-CrcJLIkf",
            },
            {
              title: "Footprint Analytics Partners with Pebble to Pioneer Data-Driven Web3 Gaming",
              img: "https://statichk.footprint.network/article/1b9f8908-0a99-42ae-a10b-1ee11bd3672e.jpeg",
              link: "https://www.footprint.network/article/footprint-analytics-partners-with-pebble-to-pioneer-data-driven-web3-gaming-vqzsq2DA",
            },
            {
              title: "Footprint Analytics X Planet IX : Establishing Strategic Partnerships",
              img: "https://static.footprint.network/article/44e0cb60-a5df-448a-9cca-40c74ac93c92.jpeg",
              link: "https://www.footprint.network/article/footprint-analytics-x-planet-ix-establishing-strategic-partnerships-pgWsQqV3",
            },
          ]
        }/>
        <BatchDownloadReady title={"Don't Wait, Get Started \nToday!"} bg={"solution__ready-games-bg"}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Games);
