/* eslint-disable react/prop-types */
import React from "react";
import { Checkbox } from "antd";

export const FilterOut = ({ options, defaultValue, onChange }) => {
  return (
    <div className="flex">
      <span className="mr2">{"Doesn't Include:"}</span>
      <Checkbox.Group
        options={options}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </div>
  );
};
