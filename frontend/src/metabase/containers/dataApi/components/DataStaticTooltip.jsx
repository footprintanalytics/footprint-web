/* eslint-disable react/prop-types */
import React from "react";
import { Tooltip } from "antd";
import Icon from "metabase/components/Icon";

const DataStaticTooltip = ({ type }) => {
  if (type === "business") {
    return (
      <Tooltip title={
        <ul>
          <div>Reference Data</div>
          {/*<li>protocol_info</li>*/}
          <li>contract_info</li>
          {/*<li>token_info</li>*/}
          {/*<li>nft_collection_info</li>*/}
          {/*<li>nft_info</li>*/}
          <li>entity_tag</li>
          <li>transaction_entity_tag</li>
          <li>address_tag</li>
        </ul>
      }
      >
        <span className="ml1"><Icon name="question" size={16} /></span>
      </Tooltip>
    )
  }
  if (type === "scale") {
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
        <span className="ml1"><Icon name="question" size={16} /></span>
      </Tooltip>
    )
  } else {
    return (
      <Tooltip title={
        <ul>
          <div>Static endpoint</div>
          <li>Get NFT attributes</li>
          <li>Get chains</li>
        </ul>
      }
      >
        <span className="ml1"><Icon name="question" size={16} /></span>
      </Tooltip>
    )
  }
};

export default DataStaticTooltip;
