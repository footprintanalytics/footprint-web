/* eslint-disable react/prop-types */
import React from "react";
import { Image, Skeleton } from "antd";

const AboutImage = ({ className, src, alt, preview= false, placeholder=<Skeleton active /> }) => {
  return (
    <div className={className}>
      <Image
        placeholder={placeholder}
        preview={preview}
        src={src}
        alt={alt}
      />
    </div>
  );
};


export default AboutImage;
