/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Button, Result, Spin } from "antd";

const FgaFlowProduceData = ({ onSuccess, previewData }) => {
  const [showViewDashboard, setShowViewDashboard] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShowViewDashboard(true)
    }, 3000)
  }, []);
  return (
    <div className="flex flex-col justify-center line-height-2" style={{padding: 40, lineHeight: 1.5}}>
      <Result
        icon={<Spin/>}
        title={"Produce Data"}
        subTitle={
          <div className={"flex flex-col items-center"}>
            <span>The data is being generated, just including the recent 7 days.<br/>It will take approximately 5 minutes.</span>
            <span>You can continue waiting until the task is completed, or check out the data on other dashboards.</span>
            <Button type="primary" style={{width: 200, marginTop: 20}} onClick={() => onSuccess?.()}>View Dashboard</Button>
          </div>
        }
      >
      </Result>
    </div>
  );
};

export default FgaFlowProduceData;
