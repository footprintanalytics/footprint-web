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
  return (
    <>
      <Meta
        title={`Data API - Footprint Analytics`}
      />
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
