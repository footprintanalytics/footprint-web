/* eslint-disable react/prop-types */
import React from "react";
import { Button } from "antd";
import { UploadOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { getOssUrl } from "metabase/lib/image";
import Link from "metabase/core/components/Link";
import "./QuestionEmpty.css";

export default function QuestionEmpty({ showUpload }) {
  return (
    <div className="Question-main--empty">
      <img src={getOssUrl("img_chart_empty.png")} />
      <h3>Pick your data</h3>
      {showUpload ? (
        <>
          <p>
            Pick the data on the left to create your chart
            <br />
            or
          </p>
          <div className="flex" style={{ gap: 20 }}>
            <Link to="/submit/contract">
              <Button
                className="Question-main--empty-button"
                size="large"
                icon={<PlusCircleOutlined />}
              >
                Submit contract
              </Button>
            </Link>
            <Link to="/chart/custom-upload">
              <Button
                className="Question-main--empty-button"
                size="large"
                icon={<UploadOutlined />}
              >
                Upload your data
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <p>Pick the data on the left to create your chart</p>
      )}
    </div>
  );
}
