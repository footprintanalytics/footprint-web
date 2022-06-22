/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React from "react";
import { Select } from "antd";

const TableSelect = props => {
  const { list, placeholder } = props;

  console.log("list", list);
  if (!list) {
    return null;
  }
  return (
    <Select
      style={{ width: "100%", marginBottom: "15px" }}
      placeholder={placeholder}
      allowClear
    >
      {list.map(n => (
        <Select.Option key={`${n.id}-${n.name}`} value={n.id}>
          {n.name}
        </Select.Option>
      ))}
    </Select>
  );
};
export default TableSelect;
