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
import Meta from "metabase/components/Meta";

const Games = () => {
  const defaultDesc =
    "Gain unparalleled insights with a comprehensive view of on-chain and off-chain data to build, engage, and optimize your games.";
  const keywords = "Blockchain Game, Web3 Game, Game Data, Data Solution, On-chain Data, Off-chain Data";
  const title = "Tailored Blockchain Data Solutions for Games | Footprint Analytics";

  return (
    <>
      <Meta description={defaultDesc} keywords={keywords} title={title} image={getOssUrl("home-v2/img-seo-Games.jpg", { resize: true })}/>
      <div className="solution__about">
        <BatchDownloadStart
          title={<>The Ultimate Gaming <br/>Solution Powers <br/>Data-Driven Decisions</>}
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
              img: "https://static.footprint.network/solution/img-banner-Mocaverse.png",
              link: "https://www.footprint.network/article/how-mocaverse-used-data-to-launch-its-metaverse-CrcJLIkf",
            },
            {
              title: "Pebble and Footprint Analytics Redefine Blockchain Gaming with Rapid Integration and Strategic Data Solutions",
              img: "https://statichk.footprint.network/home-v2/img-banner-Pebble-Client-Story.jpg?image_process=resize,w_768/crop,h_432/format,jpg",
              link: "https://www.footprint.network/article/pebble-and-footprint-analytics-redefine-blockchain-gaming-with-rapid-integration-and-strategic-data-solutions-fp-xyOaOMCi",
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
