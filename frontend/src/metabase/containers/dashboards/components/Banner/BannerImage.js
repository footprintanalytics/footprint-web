/* eslint-disable react/prop-types */
import { Image, Skeleton } from "antd";
import React from "react";
import Link from "metabase/core/components/Link";
import { deviceInfo } from "metabase-lib/lib/Device";

const BannerImage = ({ src, width, height, url }) => {
  const isMobile = deviceInfo().isMobile;
  return (
    <Link to={url} target="_blank">
      <Image
        src={src}
        width={isMobile ? width / 3 : width}
        height={isMobile ? height / 3 : height}
        preview={false}
        alt={url}
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
