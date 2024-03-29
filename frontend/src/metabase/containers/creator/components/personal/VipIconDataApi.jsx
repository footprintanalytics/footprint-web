/* eslint-disable react/prop-types */
import React from "react";
import "./VipIcon.css";
import cx from "classnames";
import { capitalize } from "lodash";
import "./VipIconDataApi.css";
import dayjs from "dayjs";
import { VipLevelDataApi } from "metabase/nav/constants";
import { formatTableTitle, formatTitle } from "metabase/lib/formatting/footprint";

const VipIconDataApi = ({ dataApiVipInfo, isOwner }) => {
  const renderData = ({ text, className }) => {
    return (
      <div className={cx("vip-icon", className)}>
        <div className="vip-icon__data-api-text">
          {`Data API: ${text}`}
          {isOwner && dataApiVipInfo?.validEndDate ? (
            <> to {dayjs(dataApiVipInfo.validEndDate).format("YYYY-MM-DD")}</>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  };
  const type = dataApiVipInfo && dataApiVipInfo.type;
  switch (type) {
    case VipLevelDataApi.GROWTH:
    case VipLevelDataApi.SCALE:
    case "scale_trial":
      return renderData({
        text: formatTableTitle(type),
      });
    default:
      return null;
  }
};

export default VipIconDataApi;
