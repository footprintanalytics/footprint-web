/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Upload, message, Button } from "antd";
import { daoUrl } from "metabase/env";
import { trackStructEvent } from "metabase/lib/analytics";
import { saveAs } from "file-saver";
import { getOssUrl } from "metabase/lib/image";
import { newQuestion } from "metabase/lib/urls";
import { isDemo, demoTip } from "../utils/dashboard";

const DashboardUploadData = ({ router, userId }) => {
  const [loading, setLoading] = useState(false);

  const handleUploadChange = info => {
    setLoading(true);
    if (info.file.response) {
      setLoading(false);
      if (info.file.response.code) {
        message.error(info.file.response.message);
      } else {
        message.success("Upload successfully");
        router.push(newQuestion());
      }
    }
  };

  const props = {
    disabled: loading || isDemo(),
    action: `${daoUrl}/api/v1/custom/data/update/csv?userid=${userId}`,
    accept: ".xls,.xlsx,.csv",
    showUploadList: false,
    onChange: handleUploadChange,
  };

  const tHeads = [
    ["block_date", "Date"],
    ["block_time", "Timestamp"],
    ["chain", "String"],
    ["amount", "Number"],
  ];
  const tBodys = [
    {
      block_date: "2022-01-01",
      block_time: "2022-01-01 12:00:00",
      chain: "Ethereum",
      amount: "0.00135",
    },
    {
      block_date: "2022-01-02",
      block_time: "2022-01-02 12:00:00",
      chain: "BSC",
      amount: "0.70097",
    },
    {
      block_date: "2022-01-03",
      block_time: "2022-01-03 12:00:00",
      chain: "Polygon",
      amount: "0",
    },
    {
      block_date: "2022-01-04",
      block_time: "2022-01-04 12:00:00",
      chain: "Solana",
      amount: "1.17389",
    },
  ];

  return (
    <div className="defi-full-content defi-dashboard__upload">
      <h3 className="defi-dashboard__upload-title">Upload Data</h3>
      <div className="defi-dashboard__upload-wrap">
        <div className="defi-dashboard__upload-wrap-left">
          <Upload.Dragger className="defi-dashboard__upload-dragger" {...props}>
            <img src={getOssUrl("20220221174412.png")} alt="upload" />
            <p className="defi-dashboard__upload-dragger-msg">
              Drop file to upload or
            </p>
            <Button
              loading={loading}
              className="defi-dashboard__upload-btn"
              type="primary"
              onClick={() => {
                trackStructEvent("Footprint Enterprise", "Upload CSV");
                isDemo() && demoTip();
              }}
            >
              Upload CSV
            </Button>
            <p className="defi-dashboard__upload-template">
              Having problems? Try the{" "}
              <a
                onClick={() => {
                  saveAs(getOssUrl("temp_data.xlsx"), "temp_data.xlsx");
                  trackStructEvent("Footprint Enterprise", "template");
                }}
              >
                template
              </a>
            </p>
          </Upload.Dragger>
        </div>
        <div className="defi-dashboard__upload-wrap-right">
          <div className="defi-dashboard__upload-tips">
            <h4>
              Tips <span>(Please use snake case field and filename)</span>
            </h4>
            <div className="defi-dashboard__upload-tips-table">
              <table>
                <thead>
                  <tr>
                    {tHeads.map(item => (
                      <td key={item}>
                        {item[0]} <span>({item[1]})</span>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tBodys.map(item => (
                    <tr key={JSON.stringify(item)}>
                      <td>{item.block_date}</td>
                      <td>{item.block_time}</td>
                      <td>{item.chain}</td>
                      <td>{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <img src={getOssUrl("20220221171657.png")} alt="verify" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUploadData;
