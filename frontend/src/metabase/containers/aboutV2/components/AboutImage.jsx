/* eslint-disable react/prop-types */
import React from "react";
import { Image, Skeleton } from "antd";

const AboutImage = ({ className, src, alt, style, preview= false, placeholder=<Skeleton active /> }) => {
  return (
    <div className={className} style={style}>
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
