import React from "react";
import "./index.css";
import { getOssUrl } from "metabase/lib/image";
import BannerImage from "metabase/containers/dashboards/components/Banner/BannerImage";

const Banner = () => {
  return (
    <div className="dashboards__banner">
      <div className="dashboards__banner-container">
        <BannerImage
          src={getOssUrl("img_analysis_banner_2022081601.png")}
          width={842}
          height={350}
          url="https://footprint.cool/mv2v"
        />
        <div className="dashboards__banner-right">
          <BannerImage
            src={getOssUrl("img_analysis_banner_2022082401.png")}
            width={332}
            height={164}
            url="/moon-men"
          />
          <BannerImage
            src={getOssUrl("img_analysis_banner_2022081603.jpg")}
            width={332}
            height={164}
            url="https://footprint.cool/yv9I"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
