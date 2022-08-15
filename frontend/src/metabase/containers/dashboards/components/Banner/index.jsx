import React from "react";
import "./index.css";
import { getOssUrl } from "metabase/lib/image";
import BannerImage from "metabase/containers/dashboards/components/Banner/BannerImage";

const Banner = () => {
  return (
    <div className="dashboards__banner">
      <div className="dashboards__banner-container">
        <BannerImage
          src={getOssUrl("/img_banner_left_1.png")}
          width={842}
          height={350}
        />
        <div className="dashboards__banner-right">
          <BannerImage
            src={getOssUrl("/img_banner_right_1.png")}
            width={332}
            height={164}
          />
          <BannerImage
            src={getOssUrl("/img_banner_right_2.png")}
            width={332}
            height={164}
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
