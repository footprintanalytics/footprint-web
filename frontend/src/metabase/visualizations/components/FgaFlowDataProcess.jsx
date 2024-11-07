/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Timeline, message, Spin, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { fgaUploadCsvUrl } from "metabase/new-service";
import { getFgaChartTypeMappingById } from "metabase/ab/utils/mapping-utils";
const FgaFlowDataProcess = ({ projectObject, callbackData, file, cardId }) => {
  const timeItems =
    [
      // { label: " Step 1: Test connection "},
      {
        label: "Step 1: Uploading Data ",
      },
      {
        label: "Step 2: AI Analyzing Now ",
      },
      { label: "Step 3: AI Transforming Now "},
    ]
  const projectId = projectObject?.id

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
      formData.append('projectId', projectId + "");
      const chartType = getFgaChartTypeMappingById(cardId)?.chartType || "";
      formData.append('chartType', chartType);

      try {
        const data = await axios.post(fgaUploadCsvUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setLoading(false);
        setCurrent(pre => pre + 1);
        setTimeout(() => {
          callbackData?.(data?.previewData, data?.pipelineId);
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
