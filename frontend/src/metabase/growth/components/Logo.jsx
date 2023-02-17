/* eslint-disable react/prop-types */
import React from "react";
import { Typography } from "antd";
import { getOssUrl } from "metabase/lib/image";

const Logo = () => {
  return (
    <Typography.Link className="ga-layout__logo" href="/growth">
      <img
        className="ga-layout__logo-icon"
        src={getOssUrl("20220208152008.png")}
        alt="Footprint"
      />
      <div className="ga-layout__logo-divider" />
      <span className="ga-layout__logo-text">Growth Analytics</span>
    </Typography.Link>
  );
};

export default Logo;
