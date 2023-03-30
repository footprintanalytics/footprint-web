/* eslint-disable react/prop-types */
import React from "react";
import { Image, Skeleton } from "antd";

const AboutImage = ({ className, src, alt, preview= false }) => {
  return (
    <div className={className}>
      <Image
        placeholder={
          <Skeleton active />
        }
        preview={preview}
        src={src}
        alt={alt}
      />
    </div>
  );
};


export default AboutImage;
