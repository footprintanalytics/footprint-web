/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React from "react";
import { Table, Tag, Typography } from "antd";
import dayjs from "dayjs";


const ContractTable = ({ data }) => {

  const columns = [
    {
      title: "Chain",
      width: 200,
      dataIndex: "chain",
    },
    {
      title: "Contract",
      render: (_, record) => {
        return (
          <>
            <Typography.Text>{record.contract_name}</Typography.Text>
            <br />
            <Typography.Text type="secondary">
              {record.contract_address}
            </Typography.Text>
          </>
        );
      },
    },
    {
      title: "Website",
      width: 250,
      dataIndex: "website",
    },
    {
      title: "Category",
      width: 150,
      dataIndex: "project_category",
    },
    {
      title: "Status",
      width: 200,
      dataIndex: "status",
      // filters: [
      //   { text: "pending", value: "pending" },
      //   { text: "reject", value: "reject" },
      //   { text: "approved", value: "approved" },
      // ],
      // onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: text => {
        switch (text) {
          case "reject":
            return <Tag color="error">{text}</Tag>;
          case "approved":
            return <Tag color="success">{text}</Tag>;
          default:
            return <Tag color="processing">{text}</Tag>;
        }
      },
    },
    {
      title: "Submitted at",
      width: 200,
      dataIndex: "submitted_at",
      render: text => {
        return dayjs(text).format("YYYY-MM-DD HH:mm");
      },
    },
  ];

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

export default ContractTable;
