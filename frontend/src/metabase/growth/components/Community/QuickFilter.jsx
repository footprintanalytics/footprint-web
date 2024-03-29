/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Space, Tag } from "antd";
import cx from "classnames";

const { CheckableTag } = Tag;

export const QuickFilter = props => {
  const {
    className,
    optionsList,
    formatFunction,
    isLoading,
    refetchData,
    onFliterChange,
    defaultValue,
    titleWidth,
    title = "Quick Filter",
  } = props;
  const [selectedTags, setSelectedTags] = useState(defaultValue);
  const handleChange = (tag, checked) => {
    setSelectedTags(checked ? tag.value : null);
    onFliterChange?.(checked ? tag : null);
  };
  return (
    <div
      className={cx(
        "flex flex-row w-full p1",
        className,
      )}
    >
      {/* <Button
        type="text"
        loading={isLoading}
        style={{
          marginRight: 8,
          marginTop: 5,
        }}
      > */}
      <span
        style={{
          marginRight: 8,
          marginTop: 5,
          color: "white",
          whiteSpace: "nowrap",
          width: titleWidth,
        }}
      >
        {title}:
      </span>
      {/* </Button> */}
      <Space size={[0, 8]} wrap>
        {optionsList?.map(tag => (
          <CheckableTag
            key={tag.value}
            className=" rounded"
            style={{
              // borderColor: "#4A5568",
              // borderStyle: "solid",
              // borderWidth: "1px",
              // color: "var(--color-primary-dark)",
              padding: "5px 8px",
            }}
            checked={selectedTags === tag.value}
            onChange={checked => handleChange(tag, checked)}
          >
            {formatFunction?.(tag.label) || tag.label}
          </CheckableTag>
        ))}
      </Space>
    </div>
  );
};
