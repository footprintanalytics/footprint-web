/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Space, Col, Row, Tag, Input, Typography, Button } from "antd";
import cx from "classnames";
import FloatInput from "../FloatInput";

export const ValueFilter = props => {
  const { data, isLoading, refetchData, className, onFliterChange } = props;
  return (
    <div
      className={cx(
        "flex flex-row w-full p1 items-center text-nowrap",
        className,
      )}
    >
      {/* <Button type="text" loading={isLoading} style={{ marginRight: 8 }}> */}
      <Typography.Text
        ellipsis={false}
        rows={1}
        style={{ color: "white", whiteSpace: "nowrap", marginRight: 8 }}
      >
        Value Filter:
      </Typography.Text>
      {/* </Button> */}

      <Row gutter={[10, 10]} className="w-full">
        {data?.map(item => (
          <Col sm={24} md={12} lg={8} xl={6} xxl={4} key={item.label}>
            {/* {ValueInput(item)} */}
            <FloatInput
              height={40}
              style={{ width: "100%", height: 40 }}
              value={item.defaultValue}
              isLoading={isLoading}
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
