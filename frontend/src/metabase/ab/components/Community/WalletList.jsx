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
  Spin, Tooltip,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { valueFormat } from "metabase/ab/utils/utils";
import LoadingSpinner from "metabase/components/LoadingSpinner/LoadingSpinner";
import Icon from "metabase/components/Icon";

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
          disabled={item.disabled}
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
        <LoadingSpinner />
      ) : (
        <a>{valueFormat(current)}</a>
      );
    }
    return originalElement;
  };

  const totalFilterTip = "In this demo and free version, features of 10 members are shown. Upgrade your plan to explore more project members !";

  return (
    <div className="flex flex-col w-full rounded p1">
      <Card bordered={false} className="">
        <div className="flex flex-row w-full justify-between align-end mb2">
          <Button loading={isLoading} type="text" style={{ padding: 0 }}>
            {isLoading ? (
              <Typography.Text type="secondary">Loading ...</Typography.Text>
            ) : (
              <Typography.Text type="secondary">
                Filtered {data?.total.toLocaleString("en-US")} Addresses <Tooltip title={totalFilterTip}><Icon className="ml1" name={"info"} size={12}/></Tooltip>
              </Typography.Text>
            )}
          </Button>

          <div className="flex flex-row" style={{gap:10}}>
            {actionItems.map(item => {
              return item.label;
            })}
          </div>
          {/* <Dropdown menu={{ items: actionItems }} trigger={["click", "hover"]}>
            <Button type="primary" className=" rounded">
              User Actions
            </Button>
          </Dropdown> */}
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
