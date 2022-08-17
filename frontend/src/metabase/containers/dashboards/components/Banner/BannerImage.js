/* eslint-disable react/prop-types */
import { Image, Skeleton } from "antd";
import React from "react";
import { deviceInfo } from "metabase-lib/lib/Device";
import Link from "metabase/components/Link";

const BannerImage = ({ src, width, height, url }) => {
  const isMobile = deviceInfo().isMobile;
  return (
    <Link to={url} target="_blank">
      <Image
        src={src}
        width={isMobile ? width / 2 : width}
        height={isMobile ? height / 2 : height}
        preview={false}
        placeholder={
          <div
            className="flex justify-center align-center"
            style={{ height: "100%", width: "100%" }}
          >
            <Skeleton active />
          </div>
        }
      />
    </Link>
  );
};

export default BannerImage;
