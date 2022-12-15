/* eslint-disable react/prop-types */

import React from "react";
import { staticBucketUrl } from "metabase/env";

const HomeBanner = () => {
  return (
    <div style={{ padding: "18px 18px 0px" }}>
      <div
        className="home-banner"
        style={{
          backgroundImage: `
            url("${staticBucketUrl}/img-home-banner-bg-1.png?x-oss-process=image/format,webp"),
            url("${staticBucketUrl}/img-home-banner-bg-2.png?x-oss-process=image/format,webp")
          `,
        }}
      >
        <div className="home-banner-content">
          <span>DEFI AND NFT ANALYTICS</span>
          <span>
            Footprint is an analysis platform to discover and visualize
            blockchain data.
          </span>
          <span>
            An intuitive, drag-and-drop interface for interactive data queries.
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
