/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React from "react";
import { Button, Table, Tag, Tooltip, Typography } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const RefContractTable = ({ data }) => {
  const columns = [
    // {
    //   title: "Type",
    //   width: 200,
    //   dataIndex: "type",
    // },
    {
      title: "Name",
      render: (_, record) => {
        return (
          <>
            <Typography.Text>
              {record?.data?.protocol_name ??
                record?.data?.protocol ??
                record?.data?.protocol_slug}
            </Typography.Text>
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
        return <Typography.Link>{record?.data?.website}</Typography.Link>;
      },
    },
    {
      title: (
        <Tooltip title="Submitted by user.">
          Submitted Contracts <QuestionCircleOutlined />
        </Tooltip>
      ),
      render: (_, record) => {
        return (
          <Typography.Text>
            Total: {record?.data?.contracts?.length ?? 0}
          </Typography.Text>
        );
      },
    },
    {
      title: (
        <Tooltip title="Mapping from the website of this project.">
          Mapping Contracts <QuestionCircleOutlined />
        </Tooltip>
      ),
      render: (_, record) => {
        return (
          <Typography.Text>
            Total: {record?.data?.contracts?.length ?? 0}
          </Typography.Text>
        );
      },
    },
    {
      title: (
        <Tooltip title="Finally adopted and stored in the database..">
          Adopted contracts <QuestionCircleOutlined />
        </Tooltip>
      ),
      render: (_, record) => {
        return (
          <Typography.Text>
            Total: {record?.data?.contracts?.length ?? 0}
          </Typography.Text>
        );
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
    {
      title: "Submitted by",
      width: 240,
      render: (_, record) => {
        return <Typography.Text>{record?.email}</Typography.Text>;
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
