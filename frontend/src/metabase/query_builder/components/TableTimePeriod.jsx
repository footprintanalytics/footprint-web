/* eslint-disable react/prop-types */
import React from "react";
import { Tooltip } from "antd";

const TableTimePeriod = ({ content }) => {
  return (
    <div className="flex align-center">
      <Tooltip tooltip={"Time Period"} verticalAttachments={["top", "bottom"]}>
        <span className="table-time-period-text">{`Time Period: ${content}`}</span>
      </Tooltip>
    </div>
  );
};

export default TableTimePeriod;
