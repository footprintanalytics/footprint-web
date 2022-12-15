import "./index.css";
import React from "react";
import { Result, Typography } from "antd";

const SubmitContractSuccess = () => {
  return (
    <div className="SubmitContract">
      <Result
        status="success"
        title="The submission was successful!"
        subTitle="Your contract has been submitted, we need some time to review, please be patient."
        extra={
          <>
            You can check the progress of the review{" "}
            <Typography.Link href="/submit/contract" underline>
              here
            </Typography.Link>
          </>
        }
      />
    </div>
  );
};

export default SubmitContractSuccess;
