/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { trackStructEvent } from "metabase/lib/analytics";
import { demoTip } from "../utils/dashboard";

const DashboardSubmitProtocol = () => {
  return (
    <Button
      icon={<PlusOutlined />}
      type="primary"
      className="defi-dashboard__submit"
      onClick={() => {
        trackStructEvent("Footprint Enterprise", "Submit Protocol");
        demoTip();
      }}
    >
      Submit Protocol
    </Button>
  );
};

export default DashboardSubmitProtocol;
