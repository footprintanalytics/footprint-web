/* eslint-disable react/prop-types */
import React from "react";
import { Checkbox } from "antd";

const TableBelong = ({ belongType, setBelongType, className }) => {
  return (
    <>
      <Checkbox
        className={className}
        checked={belongType === "private"}
        onChange={e => {
          const belongType = !e.target.checked ? "public": "private";
          setBelongType(belongType)
        }}
      >
        Keep this data private
      </Checkbox>
    </>
  );
};

export default TableBelong;
