/* eslint-disable react/prop-types */
import React from "react";
import { VipLevel } from "metabase/nav/constants";
import { getOssUrl } from "metabase/lib/image";

const VipIcon = ({ user }) => {
  const vipInfo = user.vipInfo;
  const type = vipInfo && vipInfo.type;
  switch (type) {
    case VipLevel.BASIC:
    case VipLevel.BUSINESS:
    case VipLevel.PRO:
      return (
        <img
          alt="icon_vip_basic"
          style={{ height: 20, width: 18 }}
          src={getOssUrl("icon_vip_basic.png")}
        />
      );
    case VipLevel.ENTERPRISE:
      return (
        <img
          alt="icon_vip_pro"
          style={{ height: 20, width: 18 }}
          src={getOssUrl("icon_vip_pro.png")}
        />
      );
    default:
      return null;
  }
};

export default VipIcon;
