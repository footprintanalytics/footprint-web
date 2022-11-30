/* eslint-disable react/prop-types */
/* eslint-disable curly */
import "./index.css";
import React, { useState } from "react";
import {
  Steps,
  Form,
  Button,
  Input,
  Select,
  Alert,
  List,
  Checkbox,
  Tooltip,
} from "antd";
import { useMutation, useQuery } from "react-query";
import {
  getContractSubmittedByAddress,
  getContractProtocolByAddress,
  submitContract,
} from "metabase/new-service";
import { CheckCircleOutlined } from "@ant-design/icons";
import { lowerCase } from "lodash";

const CHAIN_LIST = [
  { value: "Ethereum", label: "Ethereum" },
  { value: "xDAI", label: "xDAI" },
  { value: "Polygon", label: "Polygon" },
  { value: "Optimism", label: "Optimism" },
  { value: "BNB Chain", label: "BNB Chain" },
  { value: "Arbitrum", label: "Arbitrum" },
  { value: "Avalanche", label: "Avalanche" },
];

const PROTOCOL_CATEGORY_LIST = [
  { value: "NFT", label: "NFT" },
  { value: "DeFi", label: "DeFi" },
  { value: "GameFi", label: "GameFi" },
  { value: "Others", label: "Others" },
];

const SubmitContractAdd = props => {
  const [current, setCurrent] = useState(1);
  const [formData, setFormData] = useState({});

  const ContractAddress = () => {
    const [disabled, setDisabled] = useState(true);

    const { isLoading, mutateAsync } = useMutation(
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
          setFormData({
            ...formData,
            ...values,
            contractAddress: lowerCase(values.contractAddress),
          });
          setCurrent(1);
        }}
        onValuesChange={async (_, values) => {
          if (!/^0x[0-9a-fA-F]{40}$/.test(values.contractAddress)) return;
          await mutateAsync({
            ...values,
            contractAddress: lowerCase(values.contractAddress),
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
          rules={[
            {
              required: true,
              len: 42,
              pattern: /^0x[0-9a-fA-F]{40}$/,
              message: "",
            },
          ]}
          name="contractAddress"
        >
          <Input
            placeholder="Enter contract address"
            suffix={
              !disabled && <CheckCircleOutlined style={{ color: "#52c41a" }} />
            }
          />
        </Form.Item>
        {/* <Form.Item>
          <Alert
            message="Seems like this contract already exists"
            description={
              <List itemLayout="horizontal">
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
                        Veg Out Hare Club
                      </span>
                    }
                  />
                </List.Item>
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
                      <span style={{ color: "#303440" }}>VegOutHareClub</span>
                    }
                  />
                </List.Item>
              </List>
            }
            type="warning"
            showIcon
          />
        </Form.Item> */}
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

  const ContractDetails = () => {
    const [disabled, setDisabled] = useState(true);

    const { data } = useQuery(
      ["getContractProtocolByAddress"],
      async () => getContractProtocolByAddress(formData),
      { refetchOnWindowFocus: false, retry: 0, enabled: formData.chain },
    );

    const { isLoading, mutateAsync } = useMutation(submitContract);

    return (
      <Form
        layout="vertical"
        initialValues={{
          ...formData,
          protocolSlug: "",
          protocolName: "",
          projectCategory: PROTOCOL_CATEGORY_LIST[0].value,
          abi: "",
          resubmitReason: "",
          isNewProtocol: false,
          isFactory: false,
          isDynamic: false,
        }}
        onFinish={async values => {
          await mutateAsync({ ...formData, ...values });
          props.router.push("/submit/contract/success");
        }}
        onValuesChange={async (_, values) => {
          // if (!/^0x[0-9a-fA-F]{40}$/.test(values.contractAddress)) return;
          // await mutateAsync({
          //   ...values,
          //   contractAddress: lowerCase(values.contractAddress),
          // });
          // setDisabled(false);
        }}
      >
        <Form.Item
          label="Project name"
          rules={[{ required: true, message: "" }]}
          name="protocolName"
        >
          <Input placeholder="Enter project name" />
        </Form.Item>
        <Form.Item
          label="Project category"
          rules={[{ required: true, message: "" }]}
          name="projectCategory"
        >
          <Select options={PROTOCOL_CATEGORY_LIST} />
        </Form.Item>
        <Form.Item
          label="Contract Address"
          rules={[{ required: true, message: "" }]}
          name="contractAddress"
        >
          <Input
          // disabled
          />
        </Form.Item>
        <Form.Item
          label="ABI"
          rules={[{ required: true, message: "" }]}
          name="abi"
        >
          <Input.TextArea placeholder="Enter ABI" rows={4} spellCheck={false} />
        </Form.Item>
        <Form.Item
          label="Reason"
          rules={[{ required: true, message: "" }]}
          name="resubmitReason"
        >
          <Input.TextArea placeholder="This contract already exists on Footprint. Contract resubmissions should be handled carefully and may get rejected." />
        </Form.Item>
        <Form.Item
          name="isFactory"
          valuePropName="checked"
          style={{ marginBottom: 0 }}
        >
          <Checkbox>
            <Tooltip title="Turn it on to automatically detect other contract instances with the same ABI.">
              Are there several instances of this contract?
            </Tooltip>
          </Checkbox>
        </Form.Item>
        <Form.Item
          // shouldUpdate={(prevValues, currentValues) => {
          //   console.log(prevValues.isFactory, currentValues.isFactory);
          //   return prevValues.isFactory !== currentValues.isFactory;
          // }}
          // dependencies={["isFactory"]}
          name="isDynamic"
          valuePropName="checked"
        >
          {/* {({ getFieldValue }) => {
            console.log(getFieldValue("isFactory"));
            return getFieldValue("isFactory") ? ( */}
          <Checkbox>
            <Tooltip title="Turn it on to automatically decode all contracts created by the same address. Turn it off to decode all contracts with the same bytecode.">
              Is it created by a factory contract?
            </Tooltip>
          </Checkbox>
          {/* ) : null; */}
          {/* }} */}
        </Form.Item>
        <Form.Item>
          <Button loading={isLoading} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <div className="SubmitContract">
      <div className="SubmitContract__add">
        <h1>Submit smart contracts for decoding</h1>
        <p>2 steps to add new contracts to Footprint</p>
        <Steps current={current} className="SubmitContract__steps">
          <Steps.Step title="Contract Address" />
          <Steps.Step title="Contract Details" />
        </Steps>
        {current === 0 ? <ContractAddress /> : <ContractDetails />}
      </div>
    </div>
  );
};

export default SubmitContractAdd;
