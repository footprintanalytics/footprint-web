/* eslint-disable react/prop-types */
import { Image, Skeleton } from "antd";
import React from "react";
import { deviceInfo } from "metabase-lib/lib/Device";

const BannerImage = ({ src, width, height }) => {
  const isMobile = deviceInfo().isMobile;
  return (
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
  );
};

export default BannerImage;
