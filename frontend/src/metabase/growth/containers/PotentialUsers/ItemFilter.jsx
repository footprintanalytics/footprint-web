/* eslint-disable react/prop-types */
import React from "react";
import { Col, Row } from "antd";
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
    {
      label: "NFT Holding Value >=",
      indicator: "nftHoldingValue",
      comparisonSymbol: "gte",
      ui: "input",
    },
    {
      label: "Token Holding Value >=",
      indicator: "tokenHoldingValue",
      comparisonSymbol: "gte",
      ui: "input",
    },
    {
      label: "Trading Value >=",
      indicator: "tradingValue",
      comparisonSymbol: "gte",
      ui: "input",
    },
  ];
  return (
    <div
      className={cx(
        "flex flex-row w-full p1 items-center  text-nowrap",
        className,
      )}
    >
      <span style={{ marginRight: 8, color: "white" }}>Filters:</span>
      <Row gutter={16} className="w-full">
        {optionsList.map(item => (
          <Col span={4} key={item.label}>
            {item.ui === "select" ? (
              <MuiSelect
                height={40}
                style={{ width: "100%", height: 40 }}
                label={item.label}
                onValueChange={value => {
                  onSelectChange?.(item.resultFormatFunction?.(value));
                }}
                options={item.options}
              />
            ) : (
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
            )}
          </Col>
        ))}
      </Row>
    </div>
  );
};
