/* eslint-disable react/prop-types */
import React from "react";
import { Col, Row, Select } from "antd";
import MuiSelect from "metabase/growth/components/MuiSelect";
import cx from "classnames";
import MuiInput from "metabase/growth/components/MuiInput";
import { filterResultMapFunction } from "metabase/growth/utils/utils";

export const ItemFilter = props => {
  const {
    tagsData,
    filterResultData,
    projectData,
    tokenData,
    collectionData,
    className,
    onSelectChange,
    onFilterChange,
    onMoreChange,
    titleColor = "white",
    enableMoreSelect,
    visibleCount = 3,
  } = props;

  const filterDataToOptionsList = () => {
    let sliceResultData = filterResultData;
    if (visibleCount > 0) {
      sliceResultData = filterResultData?.slice(0, visibleCount);
    }
    const result = sliceResultData?.map(filterResultMapFunction({projectData, collectionData, tokenData, tagsData})) || [];
    if (filterResultData === null) {
      return [];
    }
    if (enableMoreSelect) {
      result?.push({
        label: "More",
        type: "more",
        options: [
          {
            label: "Recent",
            options: filterResultData?.slice(visibleCount, visibleCount + 1)?.map(i => {
              return {
                value: i?.indicator,
                label: i?.label,
              };
            }) || [],
          },
          {
            label: "Hot",
            options: filterResultData?.slice(visibleCount + 1, filterResultData?.length)?.map(i => {
              return {
                value: i.indicator,
                label: i.label,
              };
            }) || [],
          },
        ],
      })
    }
    return result;
  }

  const optionsList = filterDataToOptionsList();

  const handleChange = (value) => {
    console.log("handleChange", value)
    onMoreChange?.(value, filterResultData?.map(filterResultMapFunction({projectData, collectionData, tokenData, tagsData})));
  };
  const renderUi = (item) => {
    if (item === null) {
      return <div />
    }

    if (item.type === "more") {
      return (
        <div className="more-filter">
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
          <div className="more-text">More</div>
        </div>
      )
    }
    if (item.type === "string" && item.isArray) {
      return (
        <MuiSelect
          height={40}
          style={{ width: "100%", height: 40 }}
          label={item.label}
          onValueChange={value => {
            onSelectChange?.({
              "indicator": item.indicator,
              "comparisonSymbol": "in",
              "comparisonValue": [value]
            });
          }}
          options={item.options}
        />
      )
    }
    return (
      <MuiInput
        height={40}
        style={{ width: "100%", height: 40 }}
        onValueChange={(val, comparisonSymbol) => {
          onFilterChange?.({
            comparisonValue: parseFloat(val),
            indicator: item.indicator,
            comparisonSymbol: comparisonSymbol,
          });
        }}
        comparisonSymbol={item.comparisonSymbol}
        label={item.label}
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
      <span style={{ marginRight: 8, color: titleColor }}>Filters:</span>
      <Row gutter={[10, 10]} className="w-full">
        {optionsList?.map((item, index) => (
          <Col sm={24} md={12} lg={8} xl={6} xxl={4} key={index}>
            {renderUi(item)}
          </Col>
        ))}
      </Row>
    </div>
  );
};
