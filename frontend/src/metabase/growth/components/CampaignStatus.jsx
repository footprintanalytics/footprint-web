/* eslint-disable react/prop-types */
import React from "react";
import { Badge } from "antd";

const CampaignStatus = ({ value }) => {
  let status = "";
  let text = "";

  switch (value) {
    case "init":
      status = "warning";
      text = "Activation is waiting to be started";
      break;
    case "done":
      status = "success";
      text = "Activation was successfully completed";
      break;
    default:
      status = "processing";
      text = "Activation is in progress";
      break;
  }

  return <Badge status={status} text={text} />;
};

export default CampaignStatus;
