import React, { useState } from "react";
import { Input } from "antd";

import "./index.css";

const FloatInput = props => {
  let { label, value, placeholder, type, required } = props;
  const [focus, setFocus] = useState(false);
  const [currentValue, setCurrentValue] = useState(value ?? "");

  if (!placeholder) placeholder = label;

  const isOccupied = focus || (currentValue && currentValue.length !== 0);

  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

  const requiredMark = required ? <span className="text-danger">*</span> : null;

  return (
    <div
      className="float-label"
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      <Input
        style={{ height: 40 }}
        className="rounded"
        onChange={e => {
          if (currentValue !== e.target.value) {
            setCurrentValue(e.target.value);
          }
          props?.onChange(e);
        }}
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
