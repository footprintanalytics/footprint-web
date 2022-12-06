/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import "./index.css";
import React from "react";
import { Table, Form, Row, Col, Button, Typography, Tag } from "antd";
import { useQuery } from "react-query";
import { getContractSubmittedList } from "metabase/new-service";
import dayjs from "dayjs";

const SubmitContract = props => {
  const { isLoading, data } = useQuery(
    ["getContractSubmittedList"],
    async () => getContractSubmittedList(),
    { refetchOnWindowFocus: false, retry: 0 },
  );

  const columns = [
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
      title: "Project",
      dataIndex: "protocol_name",
    },
    {
      title: "Status",
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
      dataIndex: "submitted_at",
      render: text => {
        return dayjs(text).format("YYYY-MM-DD HH:mm");
      },
    },
  ];

  return (
    <div className="SubmitContract">
      <h1>
        Welcome to submit more contracts to help us better display the data you
        want
      </h1>
      <p>Contract submissions normally take a few days to get processed</p>
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item>
              <Button
                type="primary"
                onClick={() => {
                  props.router.push("/submit/contract/add");
                }}
              >
                Add contract
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        size="small"
        rowKey="_id"
        loading={isLoading}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </div>
  );
};

export default SubmitContract;
