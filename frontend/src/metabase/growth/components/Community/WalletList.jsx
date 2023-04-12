/* eslint-disable react/prop-types */
import React from "react";
import { Tag, Space, Table, Typography, Button, Card, Dropdown } from "antd";
import { getGrowthProjectPath } from "metabase/growth/utils/utils";
import UploadWallets from "../buttons/UploadWallets";

export const WalletList = props => {
  // mock datas
  const dataList = [
    {
      address: "0x1cf8fd41718deff957562acfac78b85b3914a677",
      holdingNFT: 10,
      holdingToken: 100,
      holdingNFTValue: 1000,
      holdingTokenValue: 10000,
      netWorth: 11000,
      totalNFTTransaction: 100,
      totalTransactions: 1000,
      twitterName: "twitter name",
      discordName: "discord name",
      tags: ["Whale"],
      email: "email@exmaple",
      eNS: "eNS",
    },
    {
      address: "0x1cf8fd41718deff957562acfac78b85b3914a688",
      holdingNFT: 29,
      holdingToken: 344,
      holdingNFTValue: 1450,
      holdingTokenValue: 24200,
      netWorth: 11000,
      tags: ["Whale", "Airdrop"],
      totalNFTTransaction: 100,
      totalTransactions: 1000,
      twitterName: "twitter name",
      discordName: "discord name",
      email: "email@exmaple",
      eNS: "eNS",
    },
    {
      address: "0x1cf8fd41718deff957562acfac78b85b3914a610",
      holdingNFT: 10,
      holdingToken: 100,
      holdingNFTValue: 1000,
      holdingTokenValue: 10000,
      netWorth: 11000,
      tags: ["Whale", "Airdrop"],
      totalNFTTransaction: 100,
      totalTransactions: 1000,
      twitterName: "twitter name",
      discordName: "discord name",
      email: "email@exmaple",
      eNS: "eNS",
    },
    {
      address: "0x33f8fd41718deff957562acfac78b85b3914a688",
      holdingNFT: 1,
      holdingToken: 200,
      holdingNFTValue: 4400,
      holdingTokenValue: 34000,
      netWorth: 11000,
      tags: ["Whale", "Blue chip", "Top 100"],
      totalNFTTransaction: 20,
      totalTransactions: 1000,
      twitterName: "twitter name",
      discordName: "discord name",
      email: "email@exmaple",
      eNS: "eNS",
    },
    {
      address: "0x44f8fd41718deff957562acfac78b85b3914a688",
      holdingNFT: 31,
      holdingToken: 4100,
      holdingNFTValue: 6400,
      holdingTokenValue: 10000,
      netWorth: 11000,
      tags: ["Diamond hand", "Airdrop"],
      totalNFTTransaction: 100,
      totalTransactions: 1000,
      twitterName: "twitter name",
      discordName: "discord name",
      email: "email@exmaple",
      eNS: "eNS",
    },
  ];
  const columns = [
    {
      title: "Wallet",
      dataIndex: "address",
      key: "Wallet",
      render: text => <a>{text}</a>,
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags.map((tag, index) => {
            const colors = [
              "blue",
              "green",
              "volcano",
              "yellow",
              "orange",
              "cyan",
              "geekblue",
              "purple",
              "magenta",
              "lime",
              "gold",
              "red",
            ];
            const color = colors[index % colors.length];
            return (
              <Tag color={color} key={tag}>
                {tag}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Net Worth",
      dataIndex: "netWorth",
      key: "netWorth",
    },
    {
      title: "NFT Holding Values",
      dataIndex: "holdingNFTValue",
      key: "holdingNFTValue",
    },
    {
      title: "Token Holding Values",
      dataIndex: "holdingTokenValue",
      key: "holdingTokenValue",
    },
    {
      title: "Twitter",
      dataIndex: "twitterName",
      key: "twitterName",
    },
    {
      title: "Discord",
      dataIndex: "discordName",
      key: "discordName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <a>Invite {record.name}</a>
    //       <a>Delete</a>
    //     </Space>
    //   ),
    // },
  ];
  const actionItems = [
    {
      key: "1",
      label: (
        <div
          onClick={() =>
            props.router?.push({
              pathname: getGrowthProjectPath(
                props.router?.params?.project,
                "Potential Users",
              ),
            })
          }
        >
          Filter Wallets
        </div>
      ),
    },
    {
      key: "2",
      label: <UploadWallets />,
    },
    {
      key: "3",
      label: (
        <div
          onClick={() =>
            props.router?.push({
              pathname: getGrowthProjectPath(
                props.router?.params?.project,
                "CreateCampaign",
              ),
            })
          }
        >
          Mapping Now
        </div>
      ),
    },
  ];
  return (
    <div className="flex flex-col w-full rounded p1">
      <Card bordered={false} className="">
        <div className="flex flex-row w-full justify-between align-end mb2">
          <Typography.Text type="secondary">
            Filter {dataList?.length} Wallets{" "}
          </Typography.Text>
          <Dropdown menu={{ items: actionItems }}>
            <Button type="primary">User Actions</Button>
          </Dropdown>
        </div>
        <Table columns={columns} dataSource={dataList} />
      </Card>
    </div>
  );
};
