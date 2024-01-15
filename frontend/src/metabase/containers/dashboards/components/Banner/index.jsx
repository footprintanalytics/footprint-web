import React from "react";
import "./index.css";
import { getOssUrl } from "metabase/lib/image";
import BannerImage from "metabase/containers/dashboards/components/Banner/BannerImage";

const Banner = () => {
  return (
    <div className="dashboards__banner">
      <div className="dashboards__banner-container">
        <BannerImage
          src={getOssUrl("footprint-research-page.jpg")}
          width={842}
          height={350}
          url={"/research/nft"}
        />
        <div className="dashboards__banner-right">
          <BannerImage
            src={getOssUrl("img-footprint-table-banner.jpg")}
            width={332}
            height={164}
            url="https://www.footprint.network/@Footprint/Level"
          />
          <BannerImage
            src={getOssUrl("new-era-of-web3.png")}
            width={332}
            height={164}
            url="https://www.footprint.network/article/striding-into-the-new-era-of-web3-fp-jMqU8z5f"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
