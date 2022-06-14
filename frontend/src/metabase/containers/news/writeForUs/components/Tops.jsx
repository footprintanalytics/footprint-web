/* eslint-disable react/prop-types */

import React from "react";
import Button from "metabase/components/Button";
import { staticBucketUrl } from "metabase/env";
import { trackStructEvent } from "metabase/lib/analytics";

const Tops = () => {
  return (
    <div
      className="news-us__top"
      style={{
        backgroundImage: `
          url("${staticBucketUrl}/img-write-for-us-bg1.png"),
          url("${staticBucketUrl}/img-write-for-us-bg2.png")
        `,
      }}
    >
      <div className="flex flex-row justify-center align-center p2">
        <div className="flex flex-column justify-center news-us__middle">
          <h1 className="footprint-title1 footprint-mt-s news-us__middle-title">
            Write for Footprint Analytics!
          </h1>
          <a
            href="mailto:analytics@footprint.network"
            onClick={() => {
              trackStructEvent("write-for-us Contact us");
            }}
          >
            <Button className="news-us__top-button">Contact us</Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Tops;
