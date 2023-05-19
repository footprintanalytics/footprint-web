/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React from "react";
import { Button, Table, Tag, Typography } from "antd";
import dayjs from "dayjs";


const ContractTable = ({ data, onReviewAction, showAction, isReviewLoading }) => {

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
      title: "Protocol Slug",
      width: 200,
      dataIndex: "protocol_slug",
    },
    {
      title: "Category",
      width: 120,
      dataIndex: "project_category",
    },
    {
      title: "Website",
      width: 300,
      dataIndex: "website",
    },
    {
      title: "Status",
      width: 120,
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
    showAction ? {
      title: "UserId",
      width: 100,
      dataIndex: "submit_user_id",
    } : null,
    {
      title: "Submitted at",
      width: 150,
      dataIndex: "submitted_at",
      render: text => {
        return dayjs(text).format("YYYY-MM-DD HH:mm");
      },
    },
    showAction ? {
      title: "",
      key: "action",
      align: "right",
      width: 200,
      render: (_, record) => {
        console.log("record", record)
        return record.status === "pending" && (
          <div className="flex justify-evenly">
            <Button disabled={isReviewLoading} size="small" type="primary" onClick={() => onReviewAction(record, "approved")}>Pass</Button>
            <Button disabled={isReviewLoading} size="small" type="default" onClick={() => onReviewAction(record, "reject")}>Reject</Button>
          </div>
        );
      },
    } : null
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

export default ContractTable;
