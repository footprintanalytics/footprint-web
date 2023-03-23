/* eslint-disable react/prop-types */
import React from "react";
import "./index.css";
import { connect } from "react-redux";
import { loginModalShowAction } from "metabase/redux/control";
import { push } from "react-router-redux";
import DataApiStart from "./components/DataApiStart";
import DataApiGetStart from "./components/DataApiGetStart";
import DataApiLowering from "./components/DataApiLowering";
import DataApiPower from "./components/DataApiPower";
import DataApiGameFi from "metabase/containers/dataApi/components/DataApiGameFi";
import DataApiNFT from "metabase/containers/dataApi/components/DataApiNFT";
import DataApiIntroduce from "metabase/containers/dataApi/components/DataApiIntroduce";
import Meta from "metabase/components/Meta";

const DataApi = () => {
  const defaultDesc =
    "Build your application with the Data API. A unified data API for NFTs, GameFi, and DeFi across all major chain ecosystems. Support not only raw data but also statistics metrics with one line of code.";
  const keywords = "Footprint Analytics, web3 gaming, web3 gaming analytics, web3 gaming data, NFT game, Web3 marketing, web3 growth marketing, wallet profile, Growth Marketing, cross chain data, blockchain data api, Zero coding analytics";
  const title = "Data API | A unified API for Web3 Gaming data, NFT data, and more";
  return (
    <>
      <Meta description={defaultDesc} keywords={keywords} title={title} />
      <div className="data-api__about">
        <DataApiStart />
        <DataApiIntroduce />
        <DataApiGetStart />
        <DataApiNFT />
        <DataApiGameFi />
        <DataApiLowering />
        {/*<DataApiAlphaTest />*/}
        <DataApiPower />
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

export default connect(mapStateToProps, mapDispatchToProps)(DataApi);
