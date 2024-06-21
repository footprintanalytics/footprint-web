/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import BatchDownloadButtons from "metabase/containers/solution/components/batchDownloadButtons";

const BatchDownloadStart = props => {
  const { title, desc, image } = props;
  console.log("title", image)
  return (
    <div className="solution__start solution__start-bg" style={{backgroundImage: `url(${image})`}}>
      <div className="solution__start-container">
        <h1>
          {title}
        </h1>
        <h2>
          {desc}
        </h2>
        <BatchDownloadButtons />
      </div>
    </div>
  );
};

export default BatchDownloadStart;
