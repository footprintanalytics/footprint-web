/* eslint-disable react/prop-types */
import React from "react";
import { Input, Alert } from "antd";

const TableName = ({ value, message, onChange }) => {
  return (
    <div className="custom-upload__confirm-input-wrap">
      <h3>
        Table Name <b>*</b>
      </h3>
      <Input
        prefix="ud"
        size="large"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="custom-upload__confirm-input"
      />
      {message && <Alert message={message} type="warning" showIcon closable />}
    </div>
  );
};

export default TableName;
