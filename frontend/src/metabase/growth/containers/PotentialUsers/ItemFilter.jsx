/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Row, Col, Select } from "antd";
import MuiSelect from "metabase/growth/components/MuiSelect";
import cx from "classnames";

export const ItemFilter = ({ className }) => {
  // mock datas
  const optionsList = [
    {
      label: "Project",
      options: [
        {
          value: 'The Sandbox',
          label: 'The Sandbox',
        },
      ]
    },
    {
      label: "NFT collection",
      options: [
        {
          value: 'Moon Men',
          label: 'Moon Men',
        },
      ]
    },
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
            <MuiSelect
              height={40}
              style={{ width: "100%", height: 40 }}
              label={item.label}
              value={item.value}
              onChange={onChange}
              options={item.options}
            />
          </Col>

        ))}
      </Row>
    </div>
  );
};
