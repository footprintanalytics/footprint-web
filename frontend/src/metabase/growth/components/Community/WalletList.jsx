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
      email: "email@exmaple",
      eNS: "eNS",
    },
    {
      address: "0x1cf8fd41718deff957562acfac78b85b3914a688",
      holdingNFT: 10,
      holdingToken: 100,
      holdingNFTValue: 1000,
      holdingTokenValue: 10000,
      netWorth: 11000,
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
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: text => <a>{text}</a>,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags.map(tag => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];
  const data = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      tags: ["loser"],
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
      tags: ["cool", "teacher"],
    },
    {
      key: "4",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    {
      key: "5",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      tags: ["loser"],
    },
    {
      key: "6",
      name: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
      tags: ["cool", "teacher"],
    },
    {
      key: "7",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    {
      key: "8",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      tags: ["loser"],
    },
    {
      key: "9",
      name: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
      tags: ["cool", "teacher"],
    },
    {
      key: "10",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
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
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};
