/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Button } from "antd";
import "./TaggingModal.css";
import { udTableDetail } from "../new-service";
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";

const SaveChartToUdFail = ({
  cardId,
  callback
}) => {
  return (
    <div className="ud-chart__fail-tip">
      <div>The last run failed to update into ud table.</div>
      <div>1. Please check the logic of the chart and try to update again.</div>
      <div>2. You can contact us at discord</div>
    </div>
  );
};

export default React.memo(SaveChartToUdFail);
