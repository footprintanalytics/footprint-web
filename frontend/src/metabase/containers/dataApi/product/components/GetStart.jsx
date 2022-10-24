/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import DataApiButtons from "metabase/containers/dataApi/components/DataApiButtons";

const GetStart = () => {
  return (
    <div className="data-api-product__start data-api-product__start-bg">
      <div className="data-api-product__start-container">
        <h1>
          Multichain <span className="data-api__text-bland">NFT API</span> to
          build native Web3 apps with ease
        </h1>
        <h2>
          Quickly fetch comprehensive data for any NFT project on Ethereum,
          Solana and Polygon and more.
        </h2>
        <h2>
          Use industry-leading NFT API to fetch metadata, ownership data, <br />
          NFT transfer data, NFT prices, and much more.
        </h2>
        <span className="mb4" />
        <DataApiButtons blandButtonText="Get your API key" />
      </div>
    </div>
  );
};

export default GetStart;
