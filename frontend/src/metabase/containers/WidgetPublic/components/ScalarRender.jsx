/* eslint-disable react/prop-types */
import React from "react";
import { get } from "lodash";

const ScalarRender = ({ data }) => {
  const rows = data?.rows;
  const firstRow = get(rows, 0);

  return (
    <div className="min-widget__item-scalar">
      <h3>{get(firstRow, 1).toLocaleString()}</h3>
    </div>
  );
};

export default ScalarRender;
