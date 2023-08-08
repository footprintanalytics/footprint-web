/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { orderBy } from "lodash";

import "./index.css";
import Icon from "metabase/components/Icon";

const MuiSelect = props => {
  let { label, value, placeholder, required, onValueChange, resultMappingFunction, apiFunction, showClose, onCloseAction, allowClear, autoFocus, defaultOpen, dropdownMatchSelectWidth, defaultOptions } = props;
  const [focus, setFocus] = useState(false);
  const [currentValue, setCurrentValue] = useState(value ?? "");
  const [options, setOptions] = useState(defaultOptions);

  const [loading, setLoading] = useState(false);
  if (!placeholder) {
    placeholder = label;
  }
  const isOccupied = focus || (currentValue && currentValue.length !== 0);

  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

  const requiredMark = required ? <span className="text-danger">*</span> : null;

  useEffect(() => {
    const runApi = async () => {
      if (!apiFunction) {
        return ;
      }
      setLoading(true);
      const data = await apiFunction?.();
      setOptions(orderBy(data?.data?.map(resultMappingFunction), "label"));
      setLoading(false);
    }

    if (focus && !loading && !options) {
      runApi();
    }
  }, [apiFunction, focus, loading, options, resultMappingFunction])

  return (
    <div
      className={"mui-select"}
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
        showSearch
        allowClear={allowClear || true}
        optionFilterProp="children"
        autoFocus={autoFocus}
        defaultOpen={defaultOpen}
        dropdownMatchSelectWidth={dropdownMatchSelectWidth}
        onChange={e => {
          if (currentValue !== e) {
            setCurrentValue(e);
          }
          if (onValueChange) {
            onValueChange(e || null);
          }
        }}
        dropdownRender={(menu) =>
          loading ? (<div className="p2">Loading...</div>) : (menu)
        }
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        value={currentValue}
        options={options}
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

export default MuiSelect;
