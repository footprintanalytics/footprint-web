/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable-next-line react/display-name */
import React from "react";
import { Table, Typography, Button, Card, Dropdown } from "antd";
import { valueFormat } from "metabase/growth/utils/utils";

export const WalletList = props => {
  const {
    data,
    columns,
    router,
    isLoading,
    isRefetching,
    refetchData,
    onPageChange,
    actions,
  } = props;
  const actionItems = [];
  actions?.map(item => {
    actionItems.push({
      key: item.title,
      label: item.component ?? (
        <Button
          type="text"
          onClick={() => {
            router?.push({ pathname: item.link });
          }}
        >
          {item.title}
        </Button>
      ),
    });
  });
  const itemRender = (current, type, originalElement) => {
    if (type === "page") {
      return <a>{valueFormat(current)}</a>;
    }
    return originalElement;
  };
  return (
    <div className="flex flex-col w-full rounded p1">
      <Card bordered={false} className="">
        <div className="flex flex-row w-full justify-between align-end mb2">
          <Typography.Text type="secondary">
            Filtered {data?.total.toLocaleString("en-US")} Addresses
          </Typography.Text>
          <Dropdown menu={{ items: actionItems }} trigger={["click", "hover"]}>
            <Button type="primary" className=" rounded">
              User Actions
            </Button>
          </Dropdown>
        </div>
        <Table
          columns={columns}
          key="address"
          pagination={{
            pageSize: data?.pageSize,
            total: data?.total,
            showSizeChanger: true,
            current: data?.current,
            itemRender: itemRender,
            onChange: (page, pageSize) => {
              pageSize !== data?.pageSize
                ? onPageChange?.(1, pageSize)
                : onPageChange?.(page, pageSize);
            },
          }}
          dataSource={data?.data}
          loading={isRefetching || isLoading}
        />
      </Card>
    </div>
  );
};
