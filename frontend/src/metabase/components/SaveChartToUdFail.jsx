/* eslint-disable react/prop-types */
import React from "react";
import "./TaggingModal.css";

const SaveChartToUdFail = () => {
  return (
    <div className="ud-chart__fail-tip">
      <div>The last run failed to update into ud table.</div>
      <div>1. Please check the logic of the chart and try to update again.</div>
      <div>2. You can contact us at discord</div>
    </div>
  );
};

export default React.memo(SaveChartToUdFail);
