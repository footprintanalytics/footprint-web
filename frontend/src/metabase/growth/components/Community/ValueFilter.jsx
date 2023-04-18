/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Space, Col, Row, Tag, Input, Typography } from "antd";
import cx from "classnames";
import FloatInput from "../FloatInput";

export const ValueFilter = props => {
  const { data, isLoading, refetchData, className, onFliterChange } = props;
  return (
    <div
      className={cx(
        "flex flex-row w-full p1 items-center  text-nowrap",
        className,
      )}
    >
      <Typography.Text
        ellipsis={false}
        rows={1}
        style={{ marginRight: 8, color: "white", whiteSpace: "nowrap" }}
      >
        Value Filter:
      </Typography.Text>
      <Row gutter={16} className="w-full">
        {data?.map(item => (
          <Col span={4} key={item.label}>
            {/* {ValueInput(item)} */}
            <FloatInput
              height={40}
              style={{ width: "100%", height: 40 }}
              value={item.defaultValue}
              onChange={val => {
                onFliterChange?.({
                  comparisonValue: parseFloat(val),
                  indicator: item.indicator,
                  comparisonSymbol: item.comparisonSymbol,
                });
              }}
              label={item.label}
              // placeholder="Email here please"
              name={item.indicator}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};
