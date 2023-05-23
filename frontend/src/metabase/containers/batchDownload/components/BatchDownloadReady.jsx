/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import Link from "metabase/core/components/Link";
import Button from "metabase/core/components/Button/Button";

const BatchDownloadReady = () => {

  return (
    <div className="batch-download__ready">
      <div className="batch-download__ready-inner">
        <h2>Ready to get started?</h2>
        <span>Get started right away and access over 26 different chains with our efficient, reliable, and affordable <br/> service that is designed to help you kickstart your enterprise.</span>
        <Link className="mt4" href="mailto:sales@footprint.network" target="_blank" style={{ width: "fit-content" }}>
          <Button className="batch-download__button-white">Contact us</Button>
        </Link>
      </div>
    </div>
  );
};

export default BatchDownloadReady;
