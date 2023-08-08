/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, DatePicker, InputNumber, Radio, Select, Space } from "antd";

import "./index.css";
import Icon from "metabase/components/Icon";

const MuiBoolean = props => {
  let { label, value, placeholder, required, onValueChange, frontSymbol, showClose, onCloseAction, autoFocus, dropdownMatchSelectWidth } = props;
  const [focus, setFocus] = useState(false);
  const [currentValue, setCurrentValue] = useState(value ?? "");
  const [inputValue, setInputValue] = useState([
    {
      symbol: "eq",
      label: "=",
      value: true,
    },
    {
      symbol: "eq",
      label: "=",
      value: false,
    },
  ]);
  const [comparisonValue, setComparisonValue] = useState();

  if (!placeholder) {
    placeholder = label;
  }

  const isOccupied = focus || (currentValue && currentValue.length !== 0);

  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

  const requiredMark = required ? <span className="text-danger">*</span> : null;

  const [open, setOpen] = useState(false);

  const comparisonSymbolMapping = {
    "eq": "=",
  }

  const data = inputValue.map(i => {
    return {
      symbol: i.symbol,
      label: i.label,
      value: i.value,
    }
  })

  return (
    <div
      className={"mui-input"}
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      <Select
        style={{ width: "100%", height: 40, borderRadius: 4, border: "1px solid #58585B", background: "#1B1B1E" }}
        dropdownStyle={{
          background: "#1C1C1E",
          color: "white",
          border: "1px solid #ffffff20"
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
            <Radio.Group onChange={(e) => setComparisonValue(e.target.value)} value={comparisonValue}>
              <Space direction="vertical">
                {data?.map(i => {
                  return (
                    <Radio value={i.value} key={i.value} >
                      <div className="flex full-width justify-evenly align-center">
                        <div>{i.label}</div>
                        <div>{i.value ? "true": "false"}</div>
                      </div>
                    </Radio>
                  )
                })}
              </Space>
            </Radio.Group>

            <div className="flex justify-end mt2">
              <Button type="primary" onClick={() => {
                const symbol = inputValue.find(i => i.value === comparisonValue).symbol;
                if (symbol) {
                  const tempInputValue = `${comparisonSymbolMapping[symbol]}${comparisonValue}`;
                  if (currentValue !== tempInputValue) {
                    setCurrentValue(tempInputValue);
                  }
                  if (onValueChange) {
                    onValueChange(comparisonValue, symbol);
                  }
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

export default MuiBoolean;
