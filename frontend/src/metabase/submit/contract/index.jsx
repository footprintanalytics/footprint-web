import "./index.css";
import React from "react";
import { Table, Form, Input, Select, Row, Col, Button } from "antd";

const SubmitContract = () => {
  const columns = [
    {
      title: "Contract",
      dataIndex: "contract",
      key: "contract",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Project",
      dataIndex: "project",
      key: "project",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Submitted at",
      dataIndex: "submittedAt",
      key: "submittedAt",
    },
  ];

  const data = [
    {
      key: "1",
      contract: "VegOutHareClub",
      address: "0x948c78e96be10aaf90741cb28ae4793df9f93066",
      project: "Veg Out Hare Club",
      status: "success",
      submittedAt: "2022-11-12 13:22:33",
    },
    {
      key: "2",
      contract: "VegOutHareClub",
      address: "0x948c78e96be10aaf90741cb28ae4793df9f93066",
      project: "Veg Out Hare Club",
      status: "success",
      submittedAt: "2022-11-12 13:22:33",
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
              <Button type="primary">Add contract</Button>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="Search your contracts">
              <Input placeholder="Enter project, contract, address" />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item label="Status">
              <Select
                placeholder="Select status"
                options={[{ value: "success", label: "success" }]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  );
};

export default SubmitContract;
