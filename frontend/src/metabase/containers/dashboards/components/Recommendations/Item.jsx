/* eslint-disable react/prop-types */
import React from "react";
import ItemCommon from "./ItemCommon";
import ItemVideo from "./ItemVideo";
import ItemDashboard from "./ItemDashboard";

const Item = ({ item, showStat }) => {
  switch (item.mode) {
    case "dashboard":
    case "card":
      return <ItemDashboard item={item} showStat={showStat} />;
    case "video":
      return <ItemVideo item={item} />;
    case "activity":
      return (
        <ItemCommon
          url={item.websiteUrl}
          thumb={item.mediaUrl}
          name={item.name}
          target={item.target}
        />
      );
    default:
      return null;
  }
};

export default Item;
