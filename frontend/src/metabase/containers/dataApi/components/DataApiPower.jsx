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
          Fetch NFT ownership, transfer, price, orderbook, and metadata and
          more, <br />
          making it easy to build NFT applications instantly.
        </h2>
        <DataApiButtons />
      </div>
    </div>
  );
};

export default DataApiPower;
