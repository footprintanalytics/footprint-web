/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Space, Tag, Row, Typography } from "antd";
const { CheckableTag } = Tag;

export const QuickFilter = ({ options }) => {
  // mock datas
  const optionsList = [
    { label: "Whale (100)", value: "Whale" },
    { label: "Active Gamer (100)", value: "Active Gamer" },
    { label: "Only Discord ID (100)", value: "Only Discord ID" },
    { label: "Only Twitter ID (100)", value: "Only Twitter ID" },
    {
      label: "Wallets with Discord ID (100)",
      value: "Wallets with Discord ID",
    },
    {
      label: "Wallets with Twitter ID (100)",
      value: "Wallets with Twitter ID",
    },
  ];
  const [selectedTags, setSelectedTags] = useState(null);
  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked ? tag.value : null;
    console.log("You are interested in: ", nextSelectedTags);
    setSelectedTags(nextSelectedTags);
  };
  return (
    <div className="flex flex-row w-full p1 items-center">
      <span style={{ marginRight: 8, color: "white" }}>Quick Filter:</span>
      <Space size={[0, 8]} wrap>
        {optionsList.map(tag => (
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
            {tag.label}
          </CheckableTag>
        ))}
      </Space>
    </div>
  );
};
