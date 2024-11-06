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
        title={"Data Brewing!"}
        subTitle={
          <div className={"flex flex-col items-center"}>
            <span>Hang tight for about 3 minutes, or explore other dashboards and refresh later</span>
            <Button type="primary" style={{width: 200, marginTop: 20}} onClick={() => onSuccess?.()}>View Dashboard</Button>
          </div>
        }
      >
      </Result>
    </div>
  );
};

export default FgaFlowProduceData;
