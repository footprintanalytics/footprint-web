/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import BatchDownloadButtons from "metabase/containers/solution/components/batchDownloadButtons";

const BatchDownloadStart = props => {
  const { title, desc, image, marginRight, descColor } = props;
  return (
    <div className="solution__start solution__start-bg" style={{backgroundImage: `url(${image})`}}>
      <div className="solution__start-container" style={{marginRight: marginRight}}>
        <h1>
          {title}
        </h1>
        <h2 style={{ color: descColor }}>
          {desc}
        </h2>
        <BatchDownloadButtons />
      </div>
    </div>
  );
};

export default BatchDownloadStart;
