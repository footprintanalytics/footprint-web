/* eslint-disable react/prop-types */
import Icon from "metabase/components/Icon";
import React from "react";
import "./index.css";

const IconValue = ({
  iconName,
  iconSize = 16,
  iconColor = "#acacb2",
  value,
}) => {
  return (
    <div className="dashboards__icon-value">
      <Icon name={iconName} size={iconSize} color={iconColor} />
      <span>{value}</span>
    </div>
  );
};

export default IconValue;
