/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Timeline, message, Spin, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const FgaFlowDataProcess = ({ onSuccess, previewData }) => {
  const timeItems =
    [
      // { label: " Step 1: Test connection "},
      {
        label: "Step 1: Sync data ",
      },
      { label: "Step 2: ETL data "},
    ]


  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (current < timeItems.length) {
        setCurrent(current + 1);
        setLoading(true);
      } else {

      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [current]);

  return (
    <div className="flex flex-col items-center" style={{ padding: 20 }}>
      <div className="flex p-20" >
        <Timeline>
          {timeItems.map((item, index) => (
            <Timeline.Item
              style={{display: "flex", justifyContent: "left"}}
              key={index}
              dot={<div className="bg-transparent">{current > index ? <CheckCircleOutlined style={{ color: "green" }} /> : loading && current === index ? <Spin /> : <div />}</div>}
            >
              {item.label}
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
      {current === timeItems.length && (<Button
        style={{width: 200}}
        onClick={() => {
          previewData?.()
        }}
      >Preview Data</Button>)}
    </div>
  );
};

export default FgaFlowDataProcess;
