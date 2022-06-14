/* eslint-disable react/prop-types */
import React from "react";
import Step from "../Step";
import { CheckCircleOutlined } from "@ant-design/icons";
import { mockPrepareData } from "../../utils/mock";
import { getOssUrl } from "metabase/lib/image";

const Result = ({ prepareData = mockPrepareData, onNext }) => {
  return (
    <Step
      titleIcon={<CheckCircleOutlined style={{ color: "#42C090" }} />}
      title="Your data is here"
      desc={
        <>
          Successfully upload{" "}
          <b>ud_{String(prepareData.tableName).toLowerCase()}</b>, You can find
          the data in <b>Personal Upload</b> after 3-5 minutes.
        </>
      }
      nextText="Let’s create a new chart"
      hidePrev={true}
      onNext={onNext}
    >
      <img
        width={384}
        height={449}
        src={getOssUrl("20220421111719.png")}
        alt="Custom Upload Guide"
      />
    </Step>
  );
};

export default Result;
