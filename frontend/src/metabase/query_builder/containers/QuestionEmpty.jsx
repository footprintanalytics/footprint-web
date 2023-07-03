/* eslint-disable react/prop-types */
import React from "react";
import { Button } from "antd";
import { UploadOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { getOssUrl } from "metabase/lib/image";
import Link from "metabase/core/components/Link";
import "./QuestionEmpty.css";
import * as Urls from "metabase/lib/urls";

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
            <Link target="_blank" to={Urls.newQuestion({ type: "query" })}>
              <Button
                className="Question-main--empty-button"
                size="large"
              >
                0 Coding Chart
              </Button>
            </Link>
            <Link
              target="_blank"
              to={Urls.newQuestion({
                type: "native",
                creationType: "native_question",
              })
            }>
              <Button
                className="Question-main--empty-button"
                size="large"
              >
                SQL Chart
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
