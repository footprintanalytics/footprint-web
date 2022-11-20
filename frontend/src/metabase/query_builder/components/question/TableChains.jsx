/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React from "react";
import { Image, Select } from "antd";
import { getOssUrl } from "metabase/lib/image";

const TableChains = props => {
  const { chainChange, chain, disabled } = props;

  const data = [
    {
      value: "all",
      label: "All chains",
      icon: getOssUrl("chain_all.png"),
    },
    {
      value: "bsc",
      label: "BSC",
      icon: getOssUrl("fp-chains/bsc.webp"),
    },
    {
      value: "polygon",
      label: "Polygon",
      icon: getOssUrl("fp-chains/polygon.webp"),
    },
    {
      value: "ethereum",
      label: "Ethereum",
      icon: getOssUrl("fp-chains/ethereum.webp"),
    },
    {
      value: "fantom",
      label: "Fantom",
      icon: getOssUrl("fp-chains/fantom.webp"),
    },
    {
      value: "arbitrum",
      label: "Arbitrum",
      icon: getOssUrl("fp-chains/arbitrum.webp"),
    },
    {
      value: "avalanche",
      label: "Avalanche",
      icon: getOssUrl("fp-chains/avalanche.webp"),
    },
    {
      value: "optimism",
      label: "Optimism",
      icon: getOssUrl("fp-chains/optimism.webp"),
    },
    {
      value: "boba",
      label: "Boba",
      icon: getOssUrl("fp-chains/boba.webp"),
    },
    {
      value: "celo",
      label: "Celo",
      icon: getOssUrl("fp-chains/celo.webp"),
    },
    {
      value: "harmony",
      label: "Harmony",
      icon: getOssUrl("fp-chains/harmony.webp"),
    },
    {
      value: "harmony",
      label: "Iotex",
      icon: getOssUrl("fp-chains/iotex.webp"),
    },
    {
      value: "moonbeam",
      label: "Moonbeam",
      icon: getOssUrl("fp-chains/moonbeam.webp"),
    },
    {
      value: "moonriver",
      label: "Moonriver",
      icon: getOssUrl("fp-chains/moonriver.webp"),
    },
    {
      value: "thundercore",
      label: "Thundercore",
      icon: getOssUrl("fp-chains/thundercore.webp"),
    },
    {
      value: "solana",
      label: "Solana",
      icon: getOssUrl("fp-chains/solana.webp"),
    },
  ];

  const onChange = value => {
    chainChange && chainChange(value);
  };

  return (
    <Select
      className="question-side__chains"
      allowClear
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
