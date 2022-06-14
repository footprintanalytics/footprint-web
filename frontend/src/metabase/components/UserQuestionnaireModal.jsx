/* eslint-disable react/prop-types */
import React from "react";
import { Flex } from "grid-styled";
import { Button, Form, Select, Modal } from "antd";
import { color } from "metabase/lib/colors";

const UserIdentityArray = [
  {
    name: "Crypto investor",
    value: "cryptoInvestor",
  },
  {
    name: "Analyst",
    value: "analyst",
  },
  {
    name: "Developer",
    value: "developer",
  },
  {
    name: "Researcher",
    value: "researcher",
  },
  {
    name: "Miner",
    value: "miner",
  },
  {
    name: "VC",
    value: "vc",
  },
];

const UserInterestingArray = [
  {
    name: "Pricing",
    value: "pricing",
  },
  {
    name: "DeFi",
    value: "defi",
  },
  {
    name: "NFT",
    value: "nft",
  },
  {
    name: "Gaming",
    value: "gaming",
  },
  {
    name: "Investing",
    value: "investing",
  },
  {
    name: "Building project",
    value: "buildingProject",
  },
  {
    name: "Industry analysis",
    value: "industryAnalysis",
  },
];

const UserQuestionnaireModal = ({ onSubmit, onClose, visible }) => {
  return (
    <Modal
      title="Questionnaire"
      visible={visible}
      footer={null}
      maskClosable={false}
      onCancel={onClose}
    >
      <Flex flexDirection="column">
        <Form name="control-ref" onFinish={onSubmit}>
          <Form.Item
            name="identity"
            label="Who are you"
            rules={[{ required: true }]}
          >
            <Select
              size="large"
              placeholder="Please select your identity"
              onChange={() => {}}
              style={{ width: "100%" }}
              allowClear
            >
              {UserIdentityArray.map(item => {
                return (
                  <Select.Option key={item.value} value={item.value}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="interests"
            label="What's your interest"
            rules={[{ required: true }]}
          >
            <Select
              mode="tags"
              size="large"
              placeholder="Please select your interest"
              onChange={() => {}}
              style={{ width: "100%" }}
            >
              {UserInterestingArray.map(item => {
                return (
                  <Select.Option key={item.value} value={item.value}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item style={{ textAlign: "center" }}>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              className="right"
              style={{
                background: color("brand"),
                border: "none",
                width: 300,
              }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </Modal>
  );
};

export default UserQuestionnaireModal;
