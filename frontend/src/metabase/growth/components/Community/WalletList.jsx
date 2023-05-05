/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable-next-line react/display-name */
import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Button,
  Card,
  Dropdown,
  Pagination,
  Spin,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
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
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setCurrentPage(data?.current);
  }, [data]);
  const actionItems = [];
  actions?.map(item => {
    actionItems.push({
      key: item.title,
      disabled: item.disabled,
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
  const itemRender = (current, type, originalElement, isLoading) => {
    if (type === "page") {
      return current === currentPage && isLoading ? (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 14 }} spin />} />
      ) : (
        <a>{valueFormat(current)}</a>
      );
    }
    return originalElement;
  };
  return (
    <div className="flex flex-col w-full rounded p1">
      <Card bordered={false} className="">
        <div className="flex flex-row w-full justify-between align-end mb2">
          <Button loading={isLoading} type="text" style={{ padding: 0 }}>
            {isLoading ? (
              <Typography.Text type="secondary">Loading ...</Typography.Text>
            ) : (
              <Typography.Text type="secondary">
                Filtered {data?.total.toLocaleString("en-US")} Addresses
              </Typography.Text>
            )}
          </Button>

          <Dropdown menu={{ items: actionItems }} trigger={["click", "hover"]}>
            <Button type="primary" className=" rounded">
              User Actions
            </Button>
          </Dropdown>
        </div>
        <Table
          columns={columns}
          key="address"
          // pagination={false}
          pagination={{
            pageSize: data?.pageSize,
            total: data?.total,
            showSizeChanger: true,
            current: currentPage,
            itemRender: (current, type, originalElement) => {
              return itemRender(current, type, originalElement, isLoading);
            },
            onChange: (page, pageSize) => {
              if (pageSize !== data?.pageSize) {
                onPageChange?.(1, pageSize);
              } else {
                setCurrentPage(page);
                onPageChange?.(page, pageSize);
              }
            },
          }}
          dataSource={data?.data}
          // loading={isRefetching || isLoading}
        />
      </Card>
    </div>
  );
};
