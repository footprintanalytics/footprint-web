/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable-next-line react/display-name */
import React from "react";
import { Table, Typography, Button, Card, Dropdown } from "antd";


export const WalletList = props => {
  const {
    data,
    columns,
    router,
    isLoading,
    isRefetching,
    refetchData,
    actions,
  } = props;
  const actionItems = [];
  actions?.map(item => {
    actionItems.push({
      key: item.title,
      label: item.component ?? (
        <a
          onClick={() => {
            router?.push({ pathname: item.link });
          }}
        >
          {item.title}
        </a>
      ),
    });
  });
  return (
    <div className="flex flex-col w-full rounded p1">
      <Card bordered={false} className="">
        <div className="flex flex-row w-full justify-between align-end mb2">
          <Typography.Text type="secondary">
            Filtered {data?.total.toLocaleString("en-US")} Wallets
          </Typography.Text>
          <Dropdown menu={{ items: actionItems }}>
            <Button type="primary" className=" rounded">
              User Actions
            </Button>
          </Dropdown>
        </div>
        <Table
          columns={columns}
          dataSource={data?.data}
          loading={isRefetching}
        />
      </Card>
    </div>
  );
};
