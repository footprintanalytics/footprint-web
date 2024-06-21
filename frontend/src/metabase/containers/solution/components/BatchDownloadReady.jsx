/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import Link from "metabase/core/components/Link";
import Button from "metabase/core/components/Button/Button";

const BatchDownloadReady = props => {
  const { title, paddingRight } = props;
  return (
    <div className="solution__ready">
      <div className="solution__ready-inner" style={{paddingRight: paddingRight}}>
        <h2>{title}</h2>
        <Link className="mt4" href="https://calendly.com/partners-79/footprint-analytics-45mins" target="_blank" style={{ width: "fit-content" }}>
          <div className="solution__button-white">Speak With a Solutions Architect</div>
        </Link>
      </div>
    </div>
  );
};

export default BatchDownloadReady;
