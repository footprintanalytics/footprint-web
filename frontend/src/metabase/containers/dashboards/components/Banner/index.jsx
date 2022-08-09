import React from "react";
import "./index.css";
import { getOssUrl } from "metabase/lib/image";

const Banner = () => {
  return (
    <div className="dashboards__banner">
      <div className="dashboards__banner-container">
        <img src={getOssUrl("/img_banner_left_1.png")} alt={""} />
        <div className="dashboards__banner-right">
          <img src={getOssUrl("/img_banner_right_1.png")} alt={""} />
          <img src={getOssUrl("/img_banner_right_2.png")} alt={""} />
        </div>
      </div>
    </div>
  );
};

export default Banner;
