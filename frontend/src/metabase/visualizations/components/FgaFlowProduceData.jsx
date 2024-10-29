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
      {!showViewDashboard && (<Result
        icon={<Spin/>}
        title={"Produce Data"}
        subTitle={<span>The data is being generated, just including the recent 7 days.<br/>It will take approximately 5 minutes.</span>}
      >
      </Result>)}

      {showViewDashboard && (<div className="flex flex-col items-center">
        The data for the past 7 days can be generated, <br/>and the related chart has been unlocked.
        <Button type="primary" style={{width: 200, marginTop: 20}} onClick={() => onSuccess?.()}>View Dashboard</Button>
      </div>)}
    </div>
  );
};

export default FgaFlowProduceData;
