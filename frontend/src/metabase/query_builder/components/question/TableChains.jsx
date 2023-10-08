/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React from "react";
import { Image, Select } from "antd";
import { getChainDataList } from "metabase/query_builder/components/question/handle";

const TableChains = props => {
  const { chainChange, chain, disabled } = props;

  const data = getChainDataList({ includeAll: false });

  const onChange = value => {
    chainChange && chainChange(value);
  };

  return (
    <Select
      className="question-side__chains"
      disabled={disabled}
      value={chain}
      placeholder="Select chain"
      defaultValue="all"
      onChange={onChange}
    >
      {data.map(n => (
        <Select.Option key={`${n.value}-${n.label}`} value={n.value}>
          <div className="question-side__chains-item">
            <Image src={n.icon} width={20} height={20} preview={false} />
            <span>{n.label}</span>
          </div>
        </Select.Option>
      ))}
    </Select>
  );
};

export default React.memo(TableChains);
