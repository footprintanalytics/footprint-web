/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";

const NoDashboardData = () => {
  return (
    <div className="flex w-full align-center flex-column justify-center">
      <img src={getOssUrl("img_coming_soon_rocket.png")} alt={"noData"} />
      <div className="nodata-title mt2">COMING VERY SOON!</div>
      <div className="nodata-desc mt1">
        {`We're`} working hard to give you more dashboard! Stay tuned!
      </div>
    </div>
  );
};

export default NoDashboardData;
