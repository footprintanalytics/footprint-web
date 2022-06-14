/* eslint-disable react/prop-types */
import React from "react";
import { VipLevel } from "metabase/nav/constants";
import { getOssUrl } from "metabase/lib/image";
import "./VipIcon.css";
import cx from "classnames";

const VipIcon = ({ vipInfo }) => {
  const renderData = ({ pic, text, className }) => {
    return (
      <div className={cx("vip-icon", className)}>
        <div className="vip-icon__bg" />
        <img className="vip-icon__img" alt={pic} src={getOssUrl(pic)} />
        <div className="vip-icon__text">{text}</div>
      </div>
    );
  };
  const type = vipInfo && vipInfo.type;
  switch (type) {
    case VipLevel.BASIC:
      return renderData({
        pic: "icon_vip_basic.png",
        text: "Basic",
        className: "vip-icon__basic",
      });
    case VipLevel.PRO:
      return renderData({
        pic: "icon_vip_pro.png",
        text: "Pro",
        className: "vip-icon__pro",
      });
    default:
      return null;
  }
};

export default VipIcon;
