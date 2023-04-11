/* eslint-disable react/prop-types */
import React from "react";
import { isDark } from "metabase/dashboard/components/utils/dark";

const SplitLine = props => {
  return (
    <div className="flex flex-row align-center mb1">
      <div
        style={{
          flex: 1,
          marginRight: "5px",
          background: isDark ? "#4A5568" : "#D8D8D8",
          height: "1px",
        }}
      />
      <span style={{ color: "#ACACB2" }}>or</span>
      <div
        style={{
          flex: 1,
          marginLeft: "5px",
          background: isDark ? "#4A5568" : "#D8D8D8",
          height: "1px",
        }}
      />
    </div>
  );
};

export default SplitLine;
