/* eslint-disable react/prop-types */
import React from "react";
import "./VipIcon.css";
import cx from "classnames";
import { capitalize } from "lodash";
import dayjs from "dayjs";
import { getOssUrl } from "metabase/lib/image";
import { VipLevel } from "metabase/nav/constants";

const VipIcon = ({ vipInfo, isOwner }) => {
  const renderData = ({ pic, text, className }) => {
    return (
      <div className={cx("vip-icon", className)}>
        <img className="vip-icon__img" alt={pic} src={getOssUrl(pic)} />
        <div className="vip-icon__text">
          {text}
          {isOwner && vipInfo?.validEndDate ? (
            <> to {dayjs(vipInfo.validEndDate).format("YYYY-MM-DD")}</>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  };
  const type = vipInfo && vipInfo.type;
  switch (type) {
    case VipLevel.BASIC:
    case VipLevel.BUSINESS:
    case VipLevel.PRO:
      return renderData({
        pic: "icon_vip_basic.png",
        text: capitalize(type),
        className: "vip-icon__basic",
      });
    case VipLevel.ENTERPRISE:
      return renderData({
        pic: "icon_vip_pro.png",
        text: capitalize(type),
        className: "vip-icon__pro",
      });
    default:
      return null;
  }
};

export default VipIcon;
