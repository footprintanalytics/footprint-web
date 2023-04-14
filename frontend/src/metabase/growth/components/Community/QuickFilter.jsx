/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Space, Tag, Row, Typography } from "antd";
const { CheckableTag } = Tag;

export const QuickFilter = props => {
  const { optionsList, formatFunction, isLoading, refetchData, onFliterChange } = props
  const [selectedTags, setSelectedTags] = useState(null);
  const handleChange = (tag, checked) => {
    setSelectedTags(checked ? tag.value : null);
    onFliterChange?.(checked ? tag : null);
  };
  return (
    <div className="flex flex-row w-full p1 items-center">
      <span style={{ marginRight: 8, color: "white" }}>Quick Filter:</span>
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
