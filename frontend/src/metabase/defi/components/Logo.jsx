/* eslint-disable react/prop-types */
import React from "react";
import { Typography } from "antd";
import { getOssUrl } from "metabase/lib/image";

const Logo = () => {
  return (
    <Typography.Link className="defi-layout__logo" href="/defi360">
      <img
        className="defi-layout__logo-icon"
        src={getOssUrl("20220208152008.png")}
        alt="Footprint"
      />
      <div className="defi-layout__logo-divider" />
      <span className="defi-layout__logo-text">Enterprise</span>
    </Typography.Link>
  );
};

export default Logo;
