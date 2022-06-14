/* eslint-disable react/prop-types */
import React from "react";
import Icon from "metabase/components/Icon";

const NoData = () => {
  return (
    <div className="protocols-nodata">
      <Icon name="chart_empty" size={32} color={"#84848A"} />
      <span>Sorry, no results found</span>
    </div>
  );
};

export default NoData;
