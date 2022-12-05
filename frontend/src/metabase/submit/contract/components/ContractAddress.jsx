/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React, { useState } from "react";
import { Form, Button, Input, Select, Alert, List } from "antd";
import { useMutation } from "react-query";
import { getContractSubmittedByAddress } from "metabase/new-service";
import { CheckCircleOutlined } from "@ant-design/icons";
import { toLower } from "lodash";

const CHAIN_LIST = [
  { value: "Ethereum", label: "Ethereum" },
  { value: "xDAI", label: "xDAI" },
  { value: "Polygon", label: "Polygon" },
  { value: "Optimism", label: "Optimism" },
  { value: "BNB Chain", label: "BNB Chain" },
  { value: "Arbitrum", label: "Arbitrum" },
  { value: "Avalanche", label: "Avalanche" },
];

const ContractAddress = ({ onFinish }) => {
  const [disabled, setDisabled] = useState(true);
  const addressReg = /^0x[0-9a-fA-F]{40}$/;

  const { isLoading, mutateAsync, data } = useMutation(
    getContractSubmittedByAddress,
  );

  return (
    <Form
      layout="vertical"
      initialValues={{
        chain: CHAIN_LIST[0].value,
        contractAddress: "",
      }}
      onFinish={values => {
        onFinish({
          ...values,
          contractAddress: toLower(values.contractAddress),
          contractExists: data || {},
        });
      }}
      onValuesChange={async (_, values) => {
        if (!addressReg.test(values.contractAddress)) return;
        await mutateAsync({
          ...values,
          contractAddress: toLower(values.contractAddress),
        });
        setDisabled(false);
      }}
    >
      <Form.Item
        label="Blockchain"
        rules={[{ required: true, message: "" }]}
        name="chain"
      >
        <Select options={CHAIN_LIST} />
      </Form.Item>
      <Form.Item
        label="Contract Address"
        rules={[{ required: true, len: 42, pattern: addressReg, message: "" }]}
        name="contractAddress"
      >
        <Input
          placeholder="Enter contract address"
          suffix={
            !disabled && <CheckCircleOutlined style={{ color: "#52c41a" }} />
          }
        />
      </Form.Item>
      {data?.protocolName || data?.contractName ? (
        <Form.Item>
          <Alert
            message="Seems like this contract already exists"
            description={
              <List itemLayout="horizontal">
                {data.protocolName ? (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <span
                          style={{ color: "rgba(0,0,0,.45)", fontWeight: 400 }}
                        >
                          Project Name
                        </span>
                      }
                      description={
                        <span style={{ color: "#303440" }}>
                          {data.protocolName}
                        </span>
                      }
                    />
                  </List.Item>
                ) : null}
                {data.contractName ? (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <span
                          style={{ color: "rgba(0,0,0,.45)", fontWeight: 400 }}
                        >
                          Contract Name
                        </span>
                      }
                      description={
                        <span style={{ color: "#303440" }}>
                          {data.contractName}
                        </span>
                      }
                    />
                  </List.Item>
                ) : null}
              </List>
            }
            type="warning"
            showIcon
          />
        </Form.Item>
      ) : null}
      <Form.Item>
        <Button
          loading={isLoading}
          disabled={disabled}
          type="primary"
          htmlType="submit"
        >
          Still to submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ContractAddress;
