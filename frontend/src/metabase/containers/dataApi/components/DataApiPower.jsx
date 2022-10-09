/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import DataApiButtons from "metabase/containers/dataApi/components/DataApiButtons";

const DataApiPower = () => {
  return (
    <div className="data-api__power data-api__power-bg">
      <div className="data-api__power-container">
        <h1>Power your Web3 projects and applications with our data</h1>
        <h2>
          Boost your apps in seconds and get access to 17+ different chains.{" "}
          <br />
          Get access to the comprehensive data about chains, NFTs, GameFi and
          more.
        </h2>
        <DataApiButtons />
      </div>
    </div>
  );
};

export default DataApiPower;
