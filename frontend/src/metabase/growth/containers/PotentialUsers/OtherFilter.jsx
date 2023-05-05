/* eslint-disable react/prop-types */
import React from "react";
import { Col, Row, Select } from "antd";
import MuiSelect from "metabase/growth/components/MuiSelect";
import cx from "classnames";
import FloatInput from "metabase/growth/components/FloatInput";
import MuiInput from "metabase/growth/components/MuiInput";

export const OtherFilter = props => {
  const {
    className,
    optionsList = [],
    onSelectChange,
    onFilterChange,
  } = props;
  // mock datas
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const renderUi = (item) => {
    if (item.ui === "more") {
      return (
        <Select
          height={40}
          style={{ width: "100%", height: 40 }}
          label={item.label}
          options={item.options}
          mode="multiple"
          allowClear
          placeholder="More"
          onChange={handleChange}
        />
      )
    }
    if (item.ui === "select") {
      return (
        <MuiSelect
          height={40}
          style={{ width: "100%", height: 40 }}
          label={item.label}
          onValueChange={value => {
            onSelectChange?.(item.resultFormatFunction?.(value));
          }}
          options={item.options}
        />
      )
    }
    return (
      <MuiInput
        height={40}
        style={{ width: "100%", height: 40 }}
        onValueChange={val => {
          onFilterChange?.({
            comparisonValue: parseFloat(val),
            indicator: item.indicator,
            comparisonSymbol: item.comparisonSymbol,
          });
        }}
        comparisonSymbol={item.comparisonSymbol}
        label={item.label}
        // placeholder="Email here please"
        name={item.value}
      />
    )
  }
  return (
    <div
      className={cx(
        "flex flex-row w-full p1 items-center  text-nowrap",
        className,
      )}
    >
      {optionsList?.length > 0 && (<span style={{ marginRight: 8, color: "transparent" }}>Filters:</span>)}
      <Row gutter={[10, 10]} className="w-full">
        {optionsList?.map(item => (
          <Col sm={24} md={12} lg={8} xl={6} xxl={4} key={item.label}>
            {renderUi(item)}
          </Col>
        ))}
      </Row>
    </div>
  );
};
