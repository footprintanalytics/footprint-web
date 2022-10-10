/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import DataApiButtons from "metabase/containers/dataApi/components/DataApiButtons";

const DataApiStart = () => {
  return (
    <div className="data-api__start">
      <h1>
        <span className="data-api__text-bland">One unifies API</span> access to{" "}
        <br />
        Webs development
      </h1>
      <h2>Get comprehensive data from all major blockchains and protocols</h2>
      <DataApiButtons />
    </div>
  );
};

export default DataApiStart;