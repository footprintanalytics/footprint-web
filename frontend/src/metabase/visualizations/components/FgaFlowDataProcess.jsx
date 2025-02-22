/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Button, Spin, Timeline } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { fgaUploadCsvUrl } from "metabase/new-service";
import { getWeb2TypeText } from "metabase/ab/utils/mapping-utils";

const FgaFlowDataProcess = ({ projectObject, callbackData, fileList, cardId, onUploadAgainClick }) => {
  const projectId = projectObject?.id

  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState("");

  const timeItems =
    [
      {
        label: "Step 1: Uploading Data ",
        status: "success",
      },
      {
        label: "Step 2: AI Analyzing Now ",
        status: "success",
      },
      {
        label: "Step 3: AI Transforming Now ",
        status: result,
      },
    ]

  useEffect(() => {
    const handleUpload = async () => {
      if (!fileList || fileList.length === 0) {
        console.error('No files selected');
        return;
      }

      const chartType = getWeb2TypeText(cardId);
      const formData = new FormData();
      fileList.forEach((file, index) => {
        formData.append('files', file);
      });
      formData.append('projectId', projectId + "");
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
        setResult("error");
        setLoading(false);
      }
    };

    if (fileList && fileList.length > 0) {
      handleUpload();
    }
  }, [fileList]);

  useEffect(() => {
    if (current < timeItems.length - 1) {
      setTimeout(() => {
        setCurrent(pre => pre + 1);
      }, 3000);
    } else if (current === timeItems.length - 1) {
    }
  }, [current]);

  const getDotIcon = (index) => {
    // 控制前2个是模拟的绿色
    if (current > index) {
      return <CheckCircleOutlined style={{ color: "green", fontSize: "18px" }} />
    }
    // 最后一个是根据接口结果进行显示
    if (current === index) {
      if (loading) {
        return <Spin />
      }
      if (timeItems[index].status === "error") {
        return <CloseCircleOutlined style={{ color: "red", fontSize: "18px" }} />
      } else {
        return <CheckCircleOutlined style={{ color: "green", fontSize: "18px" }} />
      }
    }
    // 默认图标
    return <ClockCircleOutlined style={{ color: "gray", fontSize: "18px" }} />
  }

  return (
    <div className="flex flex-col items-center" style={{ padding: 40 }}>
      <div className="flex p-20 mt4" >
        <Timeline>
          {timeItems.map((item, index) => (
            <Timeline.Item
              style={{display: "flex", justifyContent: "left"}}
              key={index}
              dot={<div className="bg-transparent">{
                getDotIcon(index)
              }</div>}
            >
              {item.label}
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
      {result === "error" && (<Button onClick={onUploadAgainClick}>Processing failed. Upload Again.</Button>)}
    </div>
  );
};

export default FgaFlowDataProcess;
