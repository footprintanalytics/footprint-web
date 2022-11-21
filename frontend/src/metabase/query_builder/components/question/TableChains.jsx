/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React from "react";
import { Image, Select } from "antd";
import { getOssUrl } from "metabase/lib/image";
import { sortBy, concat } from "lodash";

const TableChains = props => {
  const { chainChange, chain, disabled } = props;

  const overheadData = [
    {
      value: "all",
      label: "All chains",
      icon: getOssUrl("chain_all.png"),
    },
    {
      value: "ethereum",
      label: "Ethereum",
      icon: getOssUrl("fp-chains/ethereum.webp"),
    },
    {
      value: "bsc",
      label: "BNB",
      icon: getOssUrl("fp-chains/bsc.webp"),
    },
    {
      value: "polygon",
      label: "Polygon",
      icon: getOssUrl("fp-chains/polygon.webp"),
    },
    {
      value: "solana",
      label: "Solana",
      icon: getOssUrl("fp-chains/solana.webp"),
    },
    {
      value: "optimism",
      label: "Optimism",
      icon: getOssUrl("fp-chains/optimism.webp"),
    },
  ];

  const sortData = sortBy(
    [
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
        value: "dfk",
        label: "DFK",
        icon: getOssUrl("fp-chains/dfk.webp"),
      },
      {
        value: "eos",
        label: "EOS",
        icon: getOssUrl("fp-chains/eos.webp"),
      },
      {
        value: "fantom",
        label: "Fantom",
        icon: getOssUrl("fp-chains/fantom.webp"),
      },
      {
        value: "harmony",
        label: "Harmony",
        icon: getOssUrl("fp-chains/harmony.webp"),
      },
      {
        value: "hive",
        label: "Hive",
        icon: getOssUrl("fp-chains/hive.webp"),
      },
      {
        value: "iotex",
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
        value: "oasys",
        label: "Oasys",
        icon: getOssUrl("fp-chains/oasys.webp"),
      },
      {
        value: "thundercore",
        label: "Thundercore",
        icon: getOssUrl("fp-chains/thundercore.webp"),
      },
      {
        value: "wax",
        label: "Wax",
        icon: getOssUrl("fp-chains/wax.webp"),
      },
    ],
    ["value"],
  );

  const data = concat(overheadData, sortData);

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
