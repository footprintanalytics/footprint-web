/* eslint-disable react/prop-types */
import React from "react";
import { Col, Row, Select } from "antd";
import MuiSelect from "metabase/growth/components/MuiSelect";
import cx from "classnames";
import MuiInput from "metabase/growth/components/MuiInput";
import { filterResultMapFunction } from "metabase/growth/utils/utils";
import {
  getPotentialUseFilterProject,
  getPotentialUserFilterCollection, getPotentialUserFilterTag,
  getPotentialUserFilterToken,
} from "metabase/new-service";
import { formatTableTitle } from "metabase/lib/formatting/footprint";

export const ItemFilter = props => {
  const {
    filterResultData,
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
    const result = sliceResultData;
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
    onMoreChange?.(value, filterResultData);
  };
  const getApiFunction = (item) => {
    if (item.indicator === "protocolSlugs") {
      return getPotentialUseFilterProject;
    }
    if (item.indicator === "nftCollectionSlugs") {
      return getPotentialUserFilterCollection;
    }
    if (item.indicator === "tokenSlugs") {
      return getPotentialUserFilterToken;
    }
    if (item.indicator === "tags") {
      return getPotentialUserFilterTag;
    }
    return getPotentialUseFilterProject;
  }
  const getResultMappingFunction = (item) => {
    let optionsObject = null;
    optionsObject = (item) => {
      return {
        value: item.protocolSlug,
        label: item.name,
      };
    }
    if (item.indicator === "protocolSlugs") {
      optionsObject = (item) => {
          return {
            value: item.protocolSlug,
            label: item.name,
          };
        }

    }
    if (item.indicator === "nftCollectionSlugs") {
      optionsObject = (item) => {
          return {
            value: item.collectionSlug,
            label: item.name,
          };
        }

    }
    if (item.indicator === "tokenSlugs") {
      optionsObject = (item) => {
          return {
            value: item.tokenSlug,
            label: item.name,
          };
        }

    }
    if (item.indicator === "tags") {
      optionsObject = (item) => {
          return {
            value: item.tag,
            label: formatTableTitle(item.tag?.replace(/-/g, " ")),
          };
        }
    }
    return optionsObject;
  }
  const renderUi = (item) => {
    if (item === null) {
      return <div />
    }

    if (item.type === "more") {
      return (
        <div className="flex align-center">
          <div className="more-filter-division"/>
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
          resultMappingFunction={getResultMappingFunction(item)}
          apiFunction={getApiFunction(item)}
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
        frontSymbol={["netWorth", "nftHoldingValue", "tokenHoldingValue"].includes(item.indicator) ? "$" : ""}
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
