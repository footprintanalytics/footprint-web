/* eslint-disable react/prop-types */
import React from "react";
import ItemCommon from "./ItemCommon";

const ItemEmbed = ({ item }) => {
  return (
    <>
      <iframe
        width="100%"
        height="100%"
        src={item.mediaUrl}
        frameBorder="0"
        allowFullScreen
        // scrolling="no"
      />
      <ItemCommon url={item.url} name={item.name} target="_blank" />
    </>
  );
};

export default ItemEmbed;
