/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Timeline, message, Spin, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import axios from "axios";

const FgaFlowDataProcess = ({ onSuccess, previewData, file }) => {
  const timeItems =
    [
      // { label: " Step 1: Test connection "},
      {
        label: "Step 1: Upload data ",
      },
      {
        label: "Step 2: AI recognize data ",
      },
      { label: "Step 3: ETL data "},
    ]


  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleUpload = async () => {
      if (!file) {
        console.error('No file selected');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectName', 'anichess');

      try {
        const data = await axios.post('/api/v1/fga/event/upload/csv', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setLoading(false);
        setCurrent(pre => pre + 1);
        setTimeout(() => {
          previewData?.(data)
        }, 1000)
      } catch (error) {
        console.error('Upload failed:', error);
        setLoading(false);
      }
    };

    if (file) {
      handleUpload(file);
    }
  }, [file]);

  useEffect(() => {
    if (current < timeItems.length - 1) {
      setTimeout(() => {
        setCurrent(pre => pre + 1);
      }, 3000);
    } else if (current === timeItems.length - 1) {
    }
  }, [current]);

  return (
    <div className="flex flex-col items-center" style={{ padding: 40 }}>
      <div className="flex p-20" >
        <Timeline>
          {timeItems.map((item, index) => (
            <Timeline.Item
              style={{display: "flex", justifyContent: "left"}}
              key={index}
              dot={<div className="bg-transparent">{
                current > index ? <CheckCircleOutlined style={{ color: "green" }} /> : loading && current === index ? <Spin /> : <div />
              }</div>}
            >
              {item.label}
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
      {/*{current === timeItems.length && (<Button
        style={{width: 200}}
        onClick={() => {
          previewData?.()
        }}
      >Preview Data</Button>)}*/}
    </div>
  );
};

export default FgaFlowDataProcess;
