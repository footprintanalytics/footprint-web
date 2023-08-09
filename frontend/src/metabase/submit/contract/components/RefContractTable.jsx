/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React from "react";
import { Button, Table, Tag, Typography } from "antd";
import dayjs from "dayjs";


const RefContractTable = ({ data}) => {

  const columns = [
    {
      title: "Type",
      width: 200,
      dataIndex: "type",
    },
    {
      title: "Name",
      render: (_, record) => {
        return (
          <>
            <Typography.Text>{record?.data?.protocol}</Typography.Text>
            {/* <br />
            <Typography.Text type="secondary">
              {record.contract_address}
            </Typography.Text> */}
          </>
        );
      },
    },
    {
      title: "Website",
      render: (_, record) => {
        return (
            <Typography.Link>{record?.data?.website}</Typography.Link>
        );
      },
    },
    {
      title: "Submitted at",
      width: 150,
      dataIndex: "createdAt",
      render: text => {
        return dayjs(text).format("YYYY-MM-DD HH:mm");
      },
    },
    {
      title: "Status",
      width: 120,
      dataIndex: "status",
      render: text => {
        switch (text) {
          case "error":
            return <Tag color="error">{text}</Tag>;
          case "submitted":
            return <Tag color="success">{text}</Tag>;
          default:
            return <Tag color="processing">{text}</Tag>;
        }
      },
    },
  ].filter(i => i);

  return (
    <Table
      size="small"
      rowKey="_id"
      columns={columns}
      dataSource={data}
      pagination={false}
    />
  );
};

export default RefContractTable;
