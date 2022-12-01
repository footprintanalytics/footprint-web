/* eslint-disable react/prop-types */
import { Input } from "antd";
import React from "react";

const TableName = ({ value, onChange }) => {
  return (
    <>
      <h3>
        Table Name <b>*</b>
      </h3>
      <Input
        size="large"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="buffet__input"
      />
    </>
  );
};

export default TableName;
