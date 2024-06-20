/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import Link from "metabase/core/components/Link";
import Button from "metabase/core/components/Button/Button";

const BatchDownloadReady = () => {

  return (
    <div className="solution__ready">
      <div className="solution__ready-inner">
        <h2>{"Don't Wait, Get Started Today!"}</h2>
        <Link className="mt4" href="https://calendly.com/partners-79/footprint-analytics-jimmy" target="_blank" style={{ width: "fit-content" }}>
          <Button className="solution__button-white">Speak With a Solutions Architect</Button>
        </Link>
      </div>
    </div>
  );
};

export default BatchDownloadReady;
