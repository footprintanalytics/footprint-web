/* eslint-disable react/prop-types */
import React from "react";
import { Col, Row, Select } from "antd";
import MuiSelect from "metabase/growth/components/MuiSelect";
import cx from "classnames";
import FloatInput from "metabase/growth/components/FloatInput";

export const ItemFilter = props => {
  const {
    projectData,
    collectionData,
    className,
    onSelectChange,
    onFilterChange,
    onMoreChange,
  } = props;
  // mock datas
  const optionsList = [
    {
      label: "Project",
      indicator: "project",
      ui: "select",
      comparisonSymbol: "ge",
      resultFormatFunction: value => {
        return { protocolSlugs: value ? [value] : [] };
      },
      options: projectData?.map(item => {
        return {
          value: item.protocolSlug,
          label: item.name,
        };
      }),
    },
    {
      label: "NFT collection",
      indicator: "nft_collection",
      ui: "select",
      comparisonSymbol: "ge",
      resultFormatFunction: value => {
        return { collectionSlugs: value ? [value] : [] };
      },
      options: collectionData?.map(item => {
        return {
          value: item.collectionSlug,
          label: item.name,
        };
      }),
    },
    {
      label: "Net Worth >=",
      indicator: "netWorth",
      comparisonSymbol: "gte",
      ui: "input",
    },
    // {
    //   label: "NFT Holding Value >=",
    //   indicator: "nftHoldingValue",
    //   comparisonSymbol: "gte",
    //   ui: "input",
    // },
    // {
    //   label: "Token Holding Value >=",
    //   indicator: "tokenHoldingValue",
    //   comparisonSymbol: "gte",
    //   ui: "input",
    // },
    // {
    //   label: "Trading Value(30D) >=",
    //   indicator: "tradingValue",
    //   comparisonSymbol: "gte",
    //   ui: "input",
    // },
    {
      label: "More",
      ui: "more",
      options: [
        {
          value: "nftHoldingValue",
          label: "Nft Holding Value >=",
        },
        {
          value: "tokenHoldingValue",
          label: "Token Holding Value >=",
        },
        {
          value: "tradingValue",
          label: "Trading Value(30D) >=",
        },
      ]
    },
  ];
  const handleChange = (value) => {
    onMoreChange?.(value);
  };
  const renderUi = (item) => {
    if (item.ui === "more") {
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
      <FloatInput
        height={40}
        style={{ width: "100%", height: 40 }}
        onChange={val => {
          onFilterChange?.({
            comparisonValue: parseFloat(val),
            indicator: item.indicator,
            comparisonSymbol: item.comparisonSymbol,
          });
        }}
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
      <span style={{ marginRight: 8, color: "white" }}>Filters:</span>
      <Row gutter={[10, 10]} className="w-full">
        {optionsList.map(item => (
          <Col sm={24} md={12} lg={8} xl={6} xxl={4} key={item.label}>
            {renderUi(item)}
          </Col>
        ))}
      </Row>
    </div>
  );
};
