/* eslint-disable react/prop-types */
import React from "react";
import { Checkbox } from "antd";

export const FilterOut = () => {

  return (
    <div className="flex">
      <span className="mr2">Filter out:</span>
      <Checkbox defaultChecked={true}>Bot</Checkbox>
      <Checkbox defaultChecked={true}>Sybil</Checkbox>
    </div>
  );
};
