/* eslint-disable react/prop-types */
import React from "react";
import { Badge } from "antd";

const CampaignStatus = ({ value }) => {
  let status = "";
  let text = "";

  switch (value) {
    case "init":
      status = "warning";
      text = "Campaign is waiting to be started";
      break;
    default:
      status = "processing";
      text = "Campaign is in progress";
      break;
  }

  return <Badge status={status} text={text} />;
};

export default CampaignStatus;
