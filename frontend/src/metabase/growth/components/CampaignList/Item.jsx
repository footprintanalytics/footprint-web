/* eslint-disable react/prop-types */
import React from "react";

const Item = ({ item }) => {
  return (
    <div url={item.websiteUrl} thumb={item.mediaUrl} name={item.name}>
      test
    </div>
  );
};

export default Item;
