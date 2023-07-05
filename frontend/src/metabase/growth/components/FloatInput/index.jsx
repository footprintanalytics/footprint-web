/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Input } from "antd";
import { debounce } from "lodash";

import "./index.css";

const FloatInput = props => {
  let { label, value, placeholder, type, required, isLoading } = props;
  const [focus, setFocus] = useState(false);
  const [currentValue, setCurrentValue] = useState(value ?? "");
  if (!placeholder) placeholder = label;

  const isOccupied = focus || (currentValue && currentValue.length !== 0);

  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

  const requiredMark = required ? <span className="text-danger">*</span> : null;
  const handleInputChange = debounce(val => {
    if (currentValue !== val) {
      setCurrentValue(val);
    }
    props?.onChange(val);
  }, 1500);
  return (
    <div
      className="float-label"
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      <Input
        style={{ height: 40 }}
        className="rounded"
        isLoading={isLoading}
        onChange={e => handleInputChange(e.target.value)}
        type={type}
        defaultValue={value ?? ""}
      />
      <label className={labelClass}>
        {isOccupied ? label : placeholder} {requiredMark}
      </label>
    </div>
  );
};

export default FloatInput;
