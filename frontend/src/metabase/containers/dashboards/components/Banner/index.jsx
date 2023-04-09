import React from "react";
import "./index.css";
import { getOssUrl } from "metabase/lib/image";
import BannerImage from "metabase/containers/dashboards/components/Banner/BannerImage";

const Banner = () => {
  return (
    <div className="dashboards__banner">
      <div className="dashboards__banner-container">
        <BannerImage
          src={getOssUrl("article/footprint-analytics-our-2022-in-review-v2.jpg")}
          width={842}
          height={350}
          url="https://www.footprint.network/article/footprint-analytics-our-2022-in-review-GfK0XPDo"
        />
        <div className="dashboards__banner-right">
          <BannerImage
            src={getOssUrl("img-footprint-table-banner.jpg")}
            width={332}
            height={164}
            url="https://www.footprint.network/@Footprint/Level"
          />
          <BannerImage
            src={getOssUrl("img_home_banner_33.png")}
            width={332}
            height={164}
            url="https://www.footprint.network/article/26-stats-about-the-gamefi-industry-in-2022-EDXh40Vm"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
