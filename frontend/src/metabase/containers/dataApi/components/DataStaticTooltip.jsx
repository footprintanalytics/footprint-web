/* eslint-disable react/prop-types */
import React from "react";
import { Tooltip } from "antd";
import Icon from "metabase/components/Icon";

const DataStaticTooltip = () => {
  return (
    <Tooltip title={
      <ul>
        <div>Static endpoint</div>
        <li>Get NFT tokens by collection</li>
        <li>Get NFT attributes</li>
        <li>Get NFT collections</li>
        <li>Get protocols</li>
        <li>Get chains</li>
      </ul>
    }
    >
      <span className="ml1"><Icon name="question" size={16}/></span>
    </Tooltip>
  )
};

export default DataStaticTooltip;
