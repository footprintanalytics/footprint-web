/* eslint-disable react/prop-types */
import React from "react";

const SplitLine = props => (
  <div className="flex flex-row align-center mb1">
    <div
      style={{
        flex: 1,
        marginRight: "5px",
        background: "#D8D8D8",
        height: "1px",
      }}
    ></div>
    <span style={{ color: "#ACACB2" }}>or</span>
    <div
      style={{
        flex: 1,
        marginLeft: "5px",
        background: "#D8D8D8",
        height: "1px",
      }}
    ></div>
  </div>
);

export default SplitLine;
