/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Row, Col, Select } from "antd";
import MuiSelect from "metabase/growth/components/MuiSelect";
import cx from "classnames";
import FloatInput from "metabase/growth/components/FloatInput";

export const ItemFilter = ({ className }) => {
  // mock datas
  const optionsList = [
    {
      label: "Project",
      ui: "select",
      options: [
        {
          value: 'The Sandbox',
          label: 'The Sandbox',
        },
      ]
    },
    {
      label: "NFT collection",
      ui: "select",
      options: [
        {
          value: 'Moon Men',
          label: 'Moon Men',
        },
      ]
    },
    {
      label: "Total Holding Value >=",
      ui: "input",
      value: "totalHoldingValue",
      type: "gte",
    },
    { label: "NFT Holding Value >=", ui: "input", value: "nftHoldingValue", type: "gte" },
    {
      label: "Token Holding Value >=",
      value: "tokenHoldingValue",
      ui: "input",
      type: "gte",
    },
    { label: "Profit >=", value: "profit", ui: "input", type: "gte" },
  ];
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  return (
    <div
      className={cx("flex flex-row w-full p1 items-center  text-nowrap", className)}
    >
      <span style={{ marginRight: 8, color: "white", width: "80px", }}>Item Filter:</span>
      <Row gutter={16} className="w-full">
        {optionsList.map(item => (
          <Col span={4} key={item.label}>
            {item.ui === "select" ? (
              <MuiSelect
                height={40}
                style={{ width: "100%", height: 40 }}
                label={item.label}
                value={item.value}
                onValueChange={onChange}
                options={item.options}
              />)
            : (
              <FloatInput
                height={40}
                style={{ width: "100%", height: 40 }}
                label={item.label}
                // placeholder="Email here please"
                name={item.value}
              />
              )}

          </Col>

        ))}
      </Row>
    </div>
  );
};
