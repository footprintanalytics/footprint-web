/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import BatchDownloadButtons from "metabase/containers/solution/components/batchDownloadButtons";

const BatchDownloadStart = () => {
  return (
    <div className="solution__start solution__start-bg">
      <div className="solution__start-container">
        <h1>
          A Long-term Incentive <br/>Program for Users, <br/>Projects, and Ecosystems.
        </h1>
        <h2>
          Footprint provides a robust framework to build <br />and
          manage communities.
        </h2>
        <BatchDownloadButtons />
      </div>
    </div>
  );
};

export default BatchDownloadStart;
