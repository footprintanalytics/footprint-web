/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import BatchDownloadButtons from "metabase/containers/batchDownload/components/batchDownloadButtons";

const BatchDownloadStart = () => {
  return (
    <div className="batch-download__start batch-download__start-bg">
      <div className="batch-download__start-container">
        <h1>
          Download blockchain historical <br />
          data in one batch
        </h1>
        <h2>
          Start building DApps immediately, not in months. <br />
          Built for money tracking, backtesting, machine learning, and more
        </h2>
        <BatchDownloadButtons />
      </div>
    </div>
  );
};

export default BatchDownloadStart;
