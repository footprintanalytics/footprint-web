/* eslint-disable react/prop-types */
import "./index.css";
import React from "react";
import { Table, Form, Row, Col, Button } from "antd";
import { useQuery } from "react-query";
import { getContractSubmittedList } from "metabase/new-service";

const SubmitContract = props => {
  const { isLoading, data } = useQuery(
    ["getContractSubmittedList"],
    async () => getContractSubmittedList(),
    { refetchOnWindowFocus: false, retry: 0 },
  );

  const columns = [
    {
      title: "Contract address",
      dataIndex: "contract_address",
      key: "contract_address",
    },
    {
      title: "Project name",
      dataIndex: "project_name",
      key: "project_name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "pending", value: "pending" },
        { text: "reject", value: "reject" },
        { text: "approved", value: "approved" },
      ],
      onFilter: () => {},
    },
    {
      title: "Submitted at",
      dataIndex: "submitted_at",
      key: "submitted_at",
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
        loading={isLoading}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </div>
  );
};

export default SubmitContract;
