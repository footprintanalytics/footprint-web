import "./index.css";
import React from "react";
import { Result, Typography } from "antd";
import { isFgaPath } from "metabase/growth/utils/utils"
import { isABPath } from "metabase/ab/utils/utils"

const SubmitContractSuccess = () => {
  let prefix = "";
  if (isFgaPath()) {
    prefix = "/growth";
  }
  if (isABPath()) {
    prefix = "/ab";
  }
  return (
    <div className="SubmitContract">
      <Result
        status="success"
        title="The submission was successful!"
        subTitle="Your contract has been submitted, we need some time to review, please be patient."
        extra={
          <span>
            You can check the progress of the review{" "}
            <Typography.Link href={`${prefix}/submit/contract`} underline>
              here
            </Typography.Link>
          </span>
        }
      />
    </div>
  );
};

export default SubmitContractSuccess;
