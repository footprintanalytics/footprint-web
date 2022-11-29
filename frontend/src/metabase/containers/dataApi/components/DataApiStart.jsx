/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import DataApiButtons from "metabase/containers/dataApi/components/DataApiButtons";

const DataApiStart = () => {
  return (
    <div className="data-api__start data-api__start-bg">
      <div className="data-api__start-container">
        <h1>
          <span className="data-api__text-bland">One unified API</span> <br />
          for Web3 developers
        </h1>
        <h2>
          Get comprehensive data from all major <br />
          blockchains and protocols
        </h2>
        <DataApiButtons />
      </div>
    </div>
  );
};

export default DataApiStart;
