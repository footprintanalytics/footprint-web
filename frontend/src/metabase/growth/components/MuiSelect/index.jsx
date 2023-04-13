/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Select } from "antd";

import "./index.css";

const MuiSelect = props => {
  let { label, value, placeholder, required, onValueChange, options } = props;
  const [focus, setFocus] = useState(false);
  const [currentValue, setCurrentValue] = useState(value ?? "");

  if (!placeholder) {
    placeholder = label;
  }

  const isOccupied = focus || (currentValue && currentValue.length !== 0);

  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

  const requiredMark = required ? <span className="text-danger">*</span> : null;

  return (
    <div
      className={"mui-select"}
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      <Select
        style={{ width: "100%", height: 40 }}
        showSearch
        allowClear
        optionFilterProp="children"
        onChange={e => {
          if (currentValue !== e) {
            setCurrentValue(e);
          }
          if (onValueChange) {
            onValueChange(e);
          }
        }}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        value={value}
        options={options}
      />
      <label className={labelClass}>
        {isOccupied ? label : placeholder} {requiredMark}
      </label>
    </div>
  );
};

export default MuiSelect;
