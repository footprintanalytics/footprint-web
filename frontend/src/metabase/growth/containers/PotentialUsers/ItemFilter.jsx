/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Col, Row, Select, Skeleton } from "antd";
import MuiSelect from "metabase/growth/components/MuiSelect";
import cx from "classnames";
import MuiInput from "metabase/growth/components/MuiInput";
import {
  getPotentialUseFilterProject,
  getPotentialUserFilterCollection,
  getPotentialUserFilterToken,
} from "metabase/new-service";
import { formatTableTitle } from "metabase/lib/formatting/footprint";
import Icon from "metabase/components/Icon";
import { orderBy } from "lodash";

export const ItemFilter = props => {
  const {
    visibleFilterResultData,
    moreFilterResultData,
    className,
    onSelectChange,
    onFilterChange,
    onMoreChange,
    titleColor = "white",
    isOtherFilter,
    onCloseAction,
    selectMoreValue = [],
  } = props;
  const [openMoreSelect, setOpenMoreSelect] = useState(false);

  const handleChange = (value) => {
    onMoreChange?.(value, visibleFilterResultData, moreFilterResultData);
    setOpenMoreSelect(false);
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
   /* if (item.indicator === "tags") {
      return getPotentialUserFilterTag;
    }*/
    return null;
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
    if (item.indicator === "tags" || item.indicator === "projectTags") {
      optionsObject = (item) => {
          return {
            value: item.tag,
            label: formatTableTitle(item.tag?.replace(/-/g, " ")),
          };
        }
    }
    return optionsObject;
  }

  const getItemMappingFunction = (item) => {
    return (item) => {
      return {
        value: item,
        label: formatTableTitle(item?.replace(/-/g, " ")),
      };
    };
  }

  const renderUi = (item) => {
    if (!item) {
      return <div />
    }

    if (item.type === "more") {
      return (
        <div className="flex align-center">
          <div className="more-filter">
            <div className="more-text"><Icon name="add" size={12} className="mr1"/> Add Filter</div>
            <Select
              height={40}
              open={openMoreSelect}
              style={{ width: "130px", height: 40 }}
              label={item.label}
              options={item.options}
              value={selectMoreValue}
              onDropdownVisibleChange={(visible) => setOpenMoreSelect(visible)}
              bordered={false}
              showArrow={false}
              mode="multiple"
              showSearch={false}
              onChange={handleChange}
              dropdownMatchSelectWidth={250}
            />
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
              "comparisonValue": value ? [value] : null,
            });
          }}
          options={item.options}
          resultMappingFunction={getResultMappingFunction(item)}
          apiFunction={getApiFunction(item)}
          showClose={isOtherFilter}
          autoFocus={isOtherFilter}
          defaultOpen={isOtherFilter}
          dropdownMatchSelectWidth={isOtherFilter ? 250 : null}
          onCloseAction={() => onCloseAction(item)}
          defaultOptions={item.value && item.value.length > 0 ? orderBy(item.value?.map(getItemMappingFunction(item)), "label") : null}
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
        showClose={isOtherFilter}
        autoFocus={isOtherFilter}
        dropdownMatchSelectWidth={isOtherFilter ? 250 : null}
        onCloseAction={() => onCloseAction(item)}
      />
    )
  }

  if (!visibleFilterResultData) {
    return <Skeleton />
  }

  if (visibleFilterResultData.length === 0) {
    return <div className="mb1"/>
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
        {visibleFilterResultData?.map((item, index) => (
          <Col sm={24} md={12} lg={8} xl={6} xxl={4} key={index}>
            {renderUi(item)}
          </Col>
        ))}
        {moreFilterResultData?.map((item, index) => (
          <Col sm={24} md={12} lg={8} xl={6} xxl={4} key={`${item.label} ${index}`}>
            {renderUi(item)}
          </Col>
        ))}
      </Row>
    </div>
  );
};
