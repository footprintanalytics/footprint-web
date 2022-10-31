import React from "react";
import "./index.css";
import { getOssUrl } from "metabase/lib/image";
import BannerImage from "metabase/containers/dashboards/components/Banner/BannerImage";

const Banner = () => {
  return (
    <div className="dashboards__banner">
      <div className="dashboards__banner-container">
        <BannerImage
          src={getOssUrl("img-crpyoslate-footprint.png")}
          width={842}
          height={350}
          url="https://www.footprint.network/article/blockchain-security-alliance-q3-2022-blockchain-security-report-hwop2nhO"
        />
        <div className="dashboards__banner-right">
          <BannerImage
            src={getOssUrl("img_analysis_banner_2022082401.png")}
            width={332}
            height={164}
            url="/moon-men"
          />
          <BannerImage
            src={getOssUrl("img_analysis_banner_2022081601.png")}
            width={332}
            height={164}
            url="https://footprint.cool/mv2v"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
