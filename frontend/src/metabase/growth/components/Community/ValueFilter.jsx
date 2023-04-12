/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Space, Col, Row, Tag, Input, Typography } from "antd";
const { CheckableTag } = Tag;

export const ValueFilter = ({ options }) => {
  // mock datas
  const optionsList = [
    {
      label: "Total Holding Value >=",
      value: "totalHoldingValue",
      type: "gte",
    },
    { label: "NFT Holding Value >=", value: "nftHoldingValue", type: "gte" },
    {
      label: "Token Holding Value >=",
      value: "tokenHoldingValue",
      type: "gte",
    },
    { label: "Profit >=", value: "profit", type: "gte" },
  ];

  function ValueInput(item) {
    const [showLabel, setShowLabel] = useState(false);
    return (
      <div
        className="flex flex-row rounded px1 align-center text-nowrap"
        style={{
          height: "40px",
          borderColor: "var(--color-border-dark)",
          borderStyle: "solid",
          borderWidth: "1px",
        }}
      >
        {/* {showLabel && <Typography.Text>{item.label}</Typography.Text>} */}
        <Typography.Text type="secondary" style={{ fontSize: 10 }}>
          {item.label}
        </Typography.Text>
        <div className="number-input">
          <Input
            // placeholder={item.label}
            bordered={false}
            className=" w-full"
            type="number"
            style={{}}
            size="small"
            // size={showLabel ? "small" : "large"}
            // onFocus={e => {
            //   console.log("onFocus", e);
            //   setShowLabel(true);
            // }}
            // onBlur={e => {
            //   console.log("onBlur", e);
            //   setShowLabel(false);
            // }}
            onChange={e => {
              console.log("onChange", e.target?.value);
              if (e.target?.value?.length > 0) {
                setShowLabel(true);
              } else {
                setShowLabel(false);
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row w-full p1 items-center  text-nowrap">
      <Typography.Text
        ellipsis={false}
        rows={1}
        style={{ marginRight: 8, color: "white" }}
      >
        Value Filter:
      </Typography.Text>
      <Row gutter={16} className="w-full">
        {optionsList.map(item => (
          <Col span={4} key={item.label}>
            {ValueInput(item)}
          </Col>
        ))}
      </Row>
      {/* <Space size={[0, 8]} wrap>
        {optionsList.map(item => (
          <>{ValueInput(item)}</>
        ))}
      </Space> */}
    </div>
  );
};
