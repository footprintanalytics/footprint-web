/* eslint-disable react/prop-types */
import React from "react";
import { Table } from "antd";
import { getOssUrl } from "metabase/lib/image";
import * as Urls from "metabase/lib/urls";

const Indicators = props => {
  const databaseId = 3;
  const tableIdMap = {
    token_daily_stats: 37,
    dex_daily_stats: 40,
    ethereum_transactions: 35,
    defi_daily_stats: 38,
    pools_daily_stats: location.host === "www.footprint.network" ? 142 : 389,
    lending_assets_daily_stats: 64,
    dex_pair_daily_stats: 41,
    gamefi_daily_stats: 191,
    nft_daily_stats: 173,
    defi_fundraising_stats: 166,
    socialfi_daily_stats: 206,
    organization_daily_info: 196,
    organization_token_daily_info: 195,
  };

  const renderAvailable = val => {
    return val.Available ? (
      <div className="tutorials__indicators-wrap">
        <img
          className="tutorials__indicators-check"
          src={getOssUrl("icon_check.png")}
        />
        <span>{val.AvailableTip}</span>
      </div>
    ) : (
      <span className="tutorials__indicators-soon">coming soon</span>
    );
  };

  const renderDataset = val => {
    if (!val) {
      return null;
    }

    if (!val.length) {
      return <span className="tutorials__indicators-empty">—</span>;
    }

    return (
      <ul className="tutorials__indicators-dataset">
        {val.map((item, index) => (
          <li
            key={index}
            onClick={() => {
              const url = Urls.newQuestion({
                databaseId,
                tableId: tableIdMap[item],
                type: "query",
              });
              props.router.push(url);
            }}
          >
            <span>{item}</span>
            {index < val.length - 1 ? <small>、</small> : null}
          </li>
        ))}
      </ul>
    );
  };

  const sortDataset = dataSource => {
    return dataSource.sort((a, b) => b.Dataset.length - a.Dataset.length);
  };

  const columnIndicator = {
    title: "Indicator",
    dataIndex: "Indicator",
    width: "35%",
  };

  const columnDataset = {
    title: "Dataset",
    dataIndex: "Dataset",
    render: renderDataset,
    width: "40%",
  };

  const columnAvailable = {
    title: "Available",
    render: renderAvailable,
  };

  const list = [
    {
      title: "Chain Indicators",
      dataSource: [
        { key: "Ethereum", Indicator: "Ethereum", Available: true },
        {
          key: "Binance",
          Indicator: "Binance",
          Available: true,
          AvailableTip: "TVL Only",
        },
        {
          key: "Polygon",
          Indicator: "Polygon",
          Available: true,
          AvailableTip: "TVL Only",
        },
        {
          key: "Solana",
          Indicator: "Solana",
          Available: true,
          AvailableTip: "TVL Only",
        },
        {
          key: "Others",
          Indicator: "Others",
          Available: true,
          AvailableTip: "TVL Only",
        },
      ],
      columns: [
        columnIndicator,
        { ...columnDataset, title: null },
        columnAvailable,
      ],
      tip: "More multiple chains indicators are coming soon.",
    },
    {
      title: "Token Indicators",
      dataSource: sortDataset([
        {
          key: "Token Holder",
          Indicator: "Token Holder",
          Dataset: [],
        },
        {
          key: "Price",
          Indicator: "Price",
          Dataset: ["token_daily_stats"],
          Available: true,
        },
        {
          key: "Token Supply",
          Indicator: "Token Supply",
          Dataset: ["token_daily_stats"],
          Available: true,
        },
        {
          key: "Token Staked",
          Indicator: "Token Staked",
          Dataset: [],
        },
        {
          key: "Token Volume",
          Indicator: "Token Volume",
          Dataset: ["token_daily_stats", "dex_daily_stats"],
          Available: true,
        },
        {
          key: "Gas Fee",
          Indicator: "Gas Fee",
          Dataset: ["ethereum_transactions"],
          Available: true,
        },
      ]),
      columns: [columnIndicator, columnDataset, columnAvailable],
    },
    {
      title: "Protocol Indicators",
      dataSource: sortDataset([
        {
          key: "Total TVL",
          Indicator: "Total TVL",
          Dataset: ["defi_daily_stats"],
          Available: true,
        },
        {
          key: "TVL of Different Pools",
          Indicator: "TVL of Different Pools",
          Dataset: [],
        },
        {
          key: "Transactions Volume ",
          Indicator: "Transactions Volume ",
          Dataset: ["pools_daily_stats"],
          Available: true,
        },
        {
          key: "Deposit Volume",
          Indicator: "Deposit Volume",
          Dataset: ["pools_daily_stats"],
          Available: true,
        },
        {
          key: "Withdraw Volume",
          Indicator: "Withdraw Volume",
          Dataset: ["pools_daily_stats"],
          Available: true,
        },
        {
          key: "Net Deposit Volume",
          Indicator: "Net Deposit Volume",
          Dataset: ["pools_daily_stats"],
          Available: true,
        },
        {
          key: "Total Account Per Token",
          Indicator: "Total Account Per Token",
          Dataset: [],
        },
        {
          key: "Top Transactions Address",
          Indicator: "Top Transactions Address",
          Dataset: [],
        },
        {
          key: "Top Holding Address",
          Indicator: "Top Holding Address",
          Dataset: [],
        },
        {
          key: "Gas Fee",
          Indicator: "Gas Fee",
          Dataset: ["ethereum_transactions"],
          Available: true,
        },
      ]),
      columns: [columnIndicator, columnDataset, columnAvailable],
    },
    {
      title: "Lending",
      dataSource: sortDataset([
        {
          key: "Borrow Volume",
          Indicator: "Borrow Volume",
          Dataset: ["lending_assets_daily_stats"],
          Available: true,
        },
        {
          key: "Repay Volume",
          Indicator: "Repay Volume",
          Dataset: ["lending_assets_daily_stats"],
          Available: true,
        },
        {
          key: "Net Borrow Volume",
          Indicator: "Net Borrow Volume",
          Dataset: ["lending_assets_daily_stats"],
          Available: true,
        },
        {
          key: "Capital Utilization",
          Indicator: "Capital Utilization",
          Dataset: ["lending_assets_daily_stats"],
          Available: true,
        },
        {
          key: "Liquidation Volume",
          Indicator: "Liquidation Volume",
          Dataset: ["lending_assets_daily_stats"],
          Available: true,
        },
        {
          key: "Liquidations Success Rate",
          Indicator: "Liquidations Success Rate",
          Dataset: [],
          Available: true,
        },
        {
          key: "Liquidations Unique Participants",
          Indicator: "Liquidations Unique Participants",
          Dataset: ["lending_assets_daily_stats"],
          Available: true,
        },
        {
          key: "Pool Revenue",
          Indicator: "Pool Revenue",
          Dataset: [],
        },
        {
          key: "Supply Rate",
          Indicator: "Supply Rate",
          Dataset: [],
        },
        {
          key: "Borrow Rate",
          Indicator: "Borrow Rate",
          Dataset: [],
        },
        {
          key: "Deposit Trader Count",
          Indicator: "Deposit Trader Count",
          Dataset: ["lending_assets_daily_stats"],
          Available: true,
        },
        {
          key: "Borrow Trader Count",
          Indicator: "Borrow Trader Count",
          Dataset: ["lending_assets_daily_stats"],
          Available: true,
        },
        {
          key: "Withdraw Trader Count",
          Indicator: "Withdraw Trader Count",
          Dataset: ["lending_assets_daily_stats"],
          Available: true,
        },
        {
          key: "Repay Trader Count",
          Indicator: "Repay Trader Count",
          Dataset: ["lending_assets_daily_stats"],
          Available: true,
        },
      ]),
      columns: [columnIndicator, columnDataset, columnAvailable],
    },
    {
      title: "Dex",
      dataSource: sortDataset([
        {
          key: "Swaps Volume",
          Indicator: "Swaps Volume",
          Dataset: ["dex_pair_daily_stats"],
          Available: true,
        },
        {
          key: "Liquidity",
          Indicator: "Liquidity",
          Dataset: ["dex_pair_daily_stats"],
          Available: true,
        },
        {
          key: "Volume",
          Indicator: "Volume",
          Dataset: ["dex_pair_daily_stats"],
          Available: true,
        },
        {
          key: "Trade Count",
          Indicator: "Trade Count",
          Dataset: ["dex_pair_daily_stats"],
          Available: true,
        },
        {
          key: "Trader Count",
          Indicator: "Trader Count",
          Dataset: ["dex_pair_daily_stats"],
          Available: true,
        },
      ]),
      columns: [columnIndicator, columnDataset, columnAvailable],
    },
    {
      title: "Yield",
      dataSource: sortDataset([
        {
          key: "Borrow Volume",
          Indicator: "Borrow Volume",
          Dataset: ["pools_daily_stats"],
          Available: true,
        },
        {
          key: "Repay Volume",
          Indicator: "Repay Volume",
          Dataset: ["pools_daily_stats"],
          Available: true,
        },
        {
          key: "Net Borrow Volume",
          Indicator: "Net Borrow Volume",
          Dataset: ["pools_daily_stats"],
          Available: true,
        },
      ]),
      columns: [columnIndicator, columnDataset, columnAvailable],
    },
    {
      title: "User indicators",
      dataSource: [
        {
          key: "Total User",
          Indicator: "Total User",
          Dataset: ["lending_assets_daily_stats"],
          Available: true,
        },
        {
          key: "New User",
          Indicator: "New User",
          Dataset: ["lending_assets_daily_stats"],
          Available: true,
        },
        {
          key: "Number of Transactions",
          Indicator: "Number of Transactions",
          Dataset: ["lending_assets_daily_stats"],
          Available: true,
        },
      ],
      columns: [columnIndicator, columnDataset, columnAvailable],
    },
    {
      title: "NFT",
      dataSource: [
        {
          key: "Chain",
          Indicator: "Chain",
          Dataset: ["nft_daily_stats"],
          Available: true,
        },
        {
          key: "Trading Volume",
          Indicator: "Trading Volume",
          Dataset: ["nft_daily_stats"],
          Available: true,
        },
        {
          key: "Trade Count",
          Indicator: "Trade Count",
          Dataset: ["nft_daily_stats"],
          Available: true,
        },
        {
          key: "Buyers Count",
          Indicator: "Buyers Count",
          Dataset: ["nft_daily_stats"],
          Available: true,
        },
        { key: "Seller Count", Indicator: "Seller Count", Dataset: [] },
        {
          key: "Trader Count",
          Indicator: "Trader Count",
          Dataset: ["nft_daily_stats"],
          Available: true,
        },
        {
          key: "Market Cap",
          Indicator: "Market Cap",
          Dataset: ["nft_daily_stats"],
          Available: true,
        },
        { key: "Total NFT Count", Indicator: "Total NFT Count", Dataset: [] },
        { key: "Mint NFT Count", Indicator: "Mint NFT Count", Dataset: [] },
        { key: "Holder", Indicator: "Holder", Dataset: [] },
        { key: "Price", Indicator: "Price", Dataset: [] },
        { key: "NFT Details", Indicator: "NFT Details", Dataset: [] },
      ],
      columns: [columnIndicator, columnDataset, columnAvailable],
    },
    {
      title: "GameFi",
      dataSource: [
        {
          key: "Chain",
          Indicator: "Chain",
          Dataset: ["gamefi_daily_stats"],
          Available: true,
        },
        {
          key: "TVL",
          Indicator: "TVL",
          Dataset: ["gamefi_daily_stats"],
          Available: true,
        },
        {
          key: "Protocol Catagory",
          Indicator: "Protocol Catagory",
          Dataset: ["gamefi_daily_stats"],
          Available: true,
        },
        {
          key: "Users",
          Indicator: "Users",
          Dataset: ["gamefi_daily_stats"],
          Available: true,
        },
        {
          key: "Transactions",
          Indicator: "Transactions",
          Dataset: ["gamefi_daily_stats"],
          Available: true,
        },
        {
          key: "Volume",
          Indicator: "Volume",
          Dataset: ["gamefi_daily_stats"],
          Available: true,
        },
        {
          key: "Balance",
          Indicator: "Balance",
          Dataset: ["gamefi_daily_stats"],
          Available: true,
        },
        { key: "Token", Indicator: "Token", Dataset: [] },
      ],
      columns: [columnIndicator, columnDataset, columnAvailable],
    },
    {
      title: "Fundraising",
      dataSource: [
        {
          key: "Category",
          Indicator: "Category",
          Dataset: ["defi_fundraising_stats"],
          Available: true,
        },
        {
          key: "Investor",
          Indicator: "Investor",
          Dataset: ["defi_fundraising_stats"],
          Available: true,
        },
        {
          key: "Round",
          Indicator: "Round",
          Dataset: ["defi_fundraising_stats"],
          Available: true,
        },
        {
          key: "Amount",
          Indicator: "Amount",
          Dataset: ["defi_fundraising_stats"],
          Available: true,
        },
      ],
      columns: [columnIndicator, columnDataset, columnAvailable],
    },
    {
      title: "DAO",
      dataSource: [
        {
          key: "Category",
          Indicator: "Category",
          Dataset: ["organization_daily_info", "organization_token_daily_info"],
          Available: true,
        },
        {
          key: "Platform",
          Indicator: "Platform",
          Dataset: ["organization_daily_info", "organization_token_daily_info"],
          Available: true,
        },
        {
          key: "Total Revenue",
          Indicator: "Total Revenue",
          Dataset: ["organization_daily_info", "organization_token_daily_info"],
          Available: true,
        },
        {
          key: "Total Expenses",
          Indicator: "Total Expenses",
          Dataset: ["organization_daily_info", "organization_token_daily_info"],
          Available: true,
        },
        {
          key: "Net Revenue",
          Indicator: "Net Revenue",
          Dataset: ["organization_daily_info", "organization_token_daily_info"],
          Available: true,
        },
        {
          key: "Total Members",
          Indicator: "Total Members",
          Dataset: ["organization_daily_info", "organization_token_daily_info"],
          Available: true,
        },
        {
          key: "Total Proposals",
          Indicator: "Total Proposals",
          Dataset: ["organization_daily_info", "organization_token_daily_info"],
          Available: true,
        },
        {
          key: "Total Voters",
          Indicator: "Total Voters",
          Dataset: ["organization_daily_info", "organization_token_daily_info"],
          Available: true,
        },
        {
          key: "DAO Token",
          Indicator: "DAO Token",
          Dataset: ["organization_daily_info", "organization_token_daily_info"],
          Available: true,
        },
      ],
      columns: [columnIndicator, columnDataset, columnAvailable],
    },
    {
      title: "SocialFi",
      dataSource: [
        {
          key: "Chain",
          Indicator: "Chain",
          Dataset: ["socialfi_daily_stats"],
          Available: true,
        },
        {
          key: "TVL",
          Indicator: "TVL",
          Dataset: ["socialfi_daily_stats"],
          Available: true,
        },
        {
          key: "Users",
          Indicator: "Users",
          Dataset: ["socialfi_daily_stats"],
          Available: true,
        },
        {
          key: "Transactions",
          Indicator: "Transactions",
          Dataset: ["socialfi_daily_stats"],
          Available: true,
        },
        {
          key: "Volume",
          Indicator: "Volume",
          Dataset: ["socialfi_daily_stats"],
          Available: true,
        },
        {
          key: "Balance",
          Indicator: "Balance",
          Dataset: ["socialfi_daily_stats"],
          Available: true,
        },
        { key: "Token", Indicator: "Token", Dataset: [] },
      ],
      columns: [columnIndicator, columnDataset, columnAvailable],
    },
  ];

  return (
    <ul className="tutorials__indicators">
      {list.map(item => (
        <li className="tutorials__indicators-item" key={item.title}>
          <h3 className="tutorials__indicators-item-title footprint-title1">
            {item.title}
          </h3>
          <Table
            dataSource={item.dataSource}
            columns={item.columns}
            pagination={false}
            footer={item.tip ? () => item.tip : null}
          />
        </li>
      ))}
    </ul>
  );
};

export default Indicators;
