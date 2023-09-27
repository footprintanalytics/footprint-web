/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, Input, Radio, Select, Space } from "antd";

import "./index.css";
import Icon from "metabase/components/Icon";

const MuiString = props => {
  let { label, value, placeholder, required, onValueChange, frontSymbol, showClose, onCloseAction, autoFocus, dropdownMatchSelectWidth } = props;
  const [focus, setFocus] = useState(false);
  const [currentValue, setCurrentValue] = useState(value ?? "");
  const [inputValue, setInputValue] = useState("");
  if (!placeholder) {
    placeholder = label;
  }

  const isOccupied = focus || (currentValue && currentValue.length !== 0);

  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

  const requiredMark = required ? <span className="text-danger">*</span> : null;

  const [open, setOpen] = useState(false);

  const comparisonSymbol = "eq";

  return (
    <div
      className={"mui-input"}
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      <Select
        style={{ width: "100%", height: 40 }}
        dropdownStyle={{
          background: "#1C1C1E",
          color: "white",
          border: "1px solid #ffffff30"
        }}
        open={open}
        value={currentValue}
        autoFocus={autoFocus}
        allowClear={true}
        onClear={() => {
          setCurrentValue("")
          onValueChange("", "");
        }}
        notFoundContent={(<div />)}
        dropdownMatchSelectWidth={dropdownMatchSelectWidth}
        onDropdownVisibleChange={(visible) => setOpen(visible)}
        dropdownRender={(menu) => (
          <div className="p2 flex flex-column">
            <Input
              style={{
                width: '200px',
              }}
              onChange={e => {
                setInputValue(e.target.value)
              }}
            />

            <div className="flex justify-end mt2">
              <Button type="primary" onClick={() => {
                console.log("inputvalue", inputValue)
                setCurrentValue(inputValue || "")
                if (onValueChange) {
                  onValueChange(inputValue || "", comparisonSymbol);
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
      {showClose && (
        <Icon className="ml1 close-action" name="close" onClick={onCloseAction}/>
      )}
    </div>
  );
};

export default MuiString;
