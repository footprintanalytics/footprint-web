/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, InputNumber, Radio, Select, Space } from "antd";

import "./index.css";
import Icon from "metabase/components/Icon";

const MuiInput = props => {
  let { label, value, placeholder, required, onValueChange, frontSymbol, showClose, onCloseAction, autoFocus, dropdownMatchSelectWidth } = props;
  const [focus, setFocus] = useState(false);
  const [currentValue, setCurrentValue] = useState(value ?? "");
  const [inputValue, setInputValue] = useState([
    {
      symbol: "gte",
      label: ">=",
      value: null,
    },
    {
      symbol: "lte",
      label: "<=",
      value: null,
    },
  ]);
  const [comparisonSymbol, setComparisonSymbol] = useState("gte");

  if (!placeholder) {
    placeholder = label;
  }

  const isOccupied = focus || (currentValue && currentValue.length !== 0);

  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

  const requiredMark = required ? <span className="text-danger">*</span> : null;

  const [open, setOpen] = useState(false);

  const comparisonSymbolMapping = {
    "gte": ">=",
    "lte": "<=",
  }

  const data = inputValue.map(i => {
    return {
      symbol: i.symbol,
      label: i.label,
    }
  })

  return (
    <div
      className={"mui-input"}
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      <Select
        style={{width: "100%", height: 40, borderRadius: 4, border: "1px solid #58585B", background: "#1B1B1E" }}
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
            <Radio.Group onChange={(e) => setComparisonSymbol(e.target.value)} value={comparisonSymbol}>
              <Space direction="vertical">
                {data?.map(i => {
                  return (
                    <Radio value={i.symbol} key={i.symbol} >
                      <div className="flex full-width justify-evenly align-center">
                        <InputNumber
                          disabled={comparisonSymbol !== i.symbol}
                          addonBefore={<div>{i.label}</div>}
                          prefix={frontSymbol ? frontSymbol : null}
                          controls={false}
                          style={{
                            width: '180px',
                          }}
                          onChange={value => {
                            setInputValue(inputValue.map(j => {
                              return {
                                symbol: j.symbol,
                                label: j.label,
                                value: j.symbol === i.symbol ? value : j.value,
                              }
                            }))
                          }}
                        />
                      </div>
                    </Radio>
                  )
                })}
              </Space>
            </Radio.Group>

            <div className="flex justify-end mt2">
              <Button type="primary" onClick={() => {
                const value = inputValue.find(i => i.symbol === comparisonSymbol).value;
                if (value) {
                  const tempInputValue = `${comparisonSymbolMapping[comparisonSymbol]}${value}`;
                  if (currentValue !== tempInputValue) {
                    setCurrentValue(tempInputValue);
                  }
                  if (onValueChange) {
                    onValueChange(value, comparisonSymbol);
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

export default MuiInput;
