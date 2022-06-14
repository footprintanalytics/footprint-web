/* eslint-disable react/prop-types */
import React from "react";
import { trackStructEvent } from "metabase/lib/analytics";
import { Tag } from "antd";

const Item = ({ item }) => {
  return (
    <Tag key={item} onClick={() => trackStructEvent("Protocols Tag", item)}>
      {item}
    </Tag>
  );
};

export default Item;
