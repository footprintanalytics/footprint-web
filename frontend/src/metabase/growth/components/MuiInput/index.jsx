/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, Input, Radio, Select, Space } from "antd";

import "./index.css";
import Icon from "metabase/components/Icon";

const MuiInput = props => {
  let { label, value, placeholder, required, onValueChange, frontSymbol, showClose, onCloseAction, autoFocus, dropdownMatchSelectWidth } = props;
  const [focus, setFocus] = useState(false);
  const [currentValue, setCurrentValue] = useState(value ?? "");
  const [inputValue, setInputValue] = useState();
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

  const data = [
    {
      symbol: "gte",
      label: ">=",
    },
    {
      symbol: "lte",
      label: "<=",
    },
  ]

  return (
    <div
      className={"mui-select"}
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
      style={{ marginRight: showClose ? 20 : 0}}
    >
      <Select
        style={{ width: "100%", height: 40 }}
        open={open}
        value={currentValue}
        autoFocus={autoFocus}
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
                      <div className="flex full-width justify-evenly align-center mb1">
                        <span className="mr2">{i.label}</span>
                        {frontSymbol && (<span className="mr1">{frontSymbol}</span>)}
                        <Input
                          style={{
                            width: 130
                          }}
                          disabled={comparisonSymbol !== i.symbol}
                          onChange={e => {
                            setInputValue(e.target.value)
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
                const tempInputValue = `${comparisonSymbolMapping[comparisonSymbol]}${inputValue}`;
                if (currentValue !== tempInputValue) {
                  setCurrentValue(tempInputValue);
                }
                if (onValueChange) {
                  onValueChange(inputValue || null, comparisonSymbol);
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
