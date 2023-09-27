/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import "../../css/index.css";
import "./index.css";
import { Input, Select } from "antd";

const Filter = props => {
  const { onChange } = props;
  const [key, setKey] = useState(null);
  const [operator, setOperator] = useState(null);
  const [value, setValue] = useState(null);

  useEffect(() => {
    onChange({ key, operator, value })
  }, [onChange, key, operator, value])
  return (
    <div className="flex">
      <span className="mr2">And</span>
      <Select
        style={{ width: 300 }}
        dropdownStyle={{
          background: "#1C1C1E",
          color: "white",
          border: "1px solid #ffffff30"
        }}
        options={[
          {
            value: 'total holding value',
            label: 'total holding value',
          },
          {
            value: 'NFT holding value',
            label: 'NFT holding value',
          },
          {
            value: 'token holding value',
            label: 'token holding value',
          },
          {
            value: 'profit',
            label: 'profit',
          },
        ]}
        onChange={value => setKey(value)}
      />
      <Select
        style={{ width: 120 }}
        dropdownStyle={{
          background: "#1C1C1E",
          color: "white",
          border: "1px solid #ffffff30"
        }}
        options={[
          {
            value: '>=',
            label: '>=',
          },
          {
            value: '<=',
            label: '<=',
          },
          {
            value: '>',
            label: '>',
          },
          {
            value: '<',
            label: '<',
          },
          {
            value: '=',
            label: '=',
          },
        ]}
        onChange={value => setOperator(value)}
      />
      <Input value={value} style={{
        width: 100,
      }} onChange={e => setValue(e.target.value)}/>
    </div>
  );
};

export default Filter;
