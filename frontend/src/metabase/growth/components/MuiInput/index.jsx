/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, Input, Select } from "antd";

import "./index.css";
import { Option } from "antd/lib/mentions";

const MuiInput = props => {
  let { label, value, placeholder, required, onValueChange, comparisonSymbol } = props;
  const [focus, setFocus] = useState(false);
  const [currentValue, setCurrentValue] = useState(value ?? "");
  const [inputValue, setInputValue] = useState();

  if (!placeholder) {
    placeholder = label;
  }

  const isOccupied = focus || (currentValue && currentValue.length !== 0);

  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

  const requiredMark = required ? <span className="text-danger">*</span> : null;

  const [open, setOpen] = useState(false);

  const comparisonSymbolMapping = {
    "gte": ">="
  }

  return (
    <div
      className={"mui-select"}
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      <Select
        style={{ width: "100%", height: 40 }}
        open={open}
        value={currentValue}
        onChange={e => {
          if (currentValue !== e) {
            setCurrentValue(e);
          }
          if (onValueChange) {
            onValueChange(e || null);
          }
        }}
        notFoundContent={(<div />)}
        onDropdownVisibleChange={(visible) => setOpen(visible)}
        dropdownRender={(menu) => (
          <div>
            <div className="flex full-width justify-evenly align-center">
              {">="}
              <Input
                style={{
                  width: 150
                }}
                onChange={e => {
                  setInputValue(e.target.value)
                }}
              />
            </div>
            {menu}
            <div className="flex justify-center">
              <Button type="primary" onClick={() => {
                const tempInputValue = `${comparisonSymbolMapping[comparisonSymbol]}${inputValue}`;
                if (currentValue !== tempInputValue) {
                  setCurrentValue(tempInputValue);
                }
                if (onValueChange) {
                  onValueChange(inputValue || null);
                }
                setOpen(false)
              }}>
                Confirm
              </Button>
            </div>
          </div>
        )}
      />
      <label className={labelClass}>
        {isOccupied ? label : placeholder} {requiredMark}
      </label>
    </div>
  );
};

export default MuiInput;
