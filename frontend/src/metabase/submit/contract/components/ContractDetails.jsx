/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React from "react";
import {
  Form,
  Button,
  Input,
  Select,
  Checkbox,
  Tooltip,
  AutoComplete,
} from "antd";
import { useMutation, useQuery } from "react-query";
import {
  getContractProtocolByAddress,
  submitContract,
} from "metabase/new-service";
import { toLower } from "lodash";
import slug from "slug";

const PROTOCOL_CATEGORY_LIST = [
  { value: "NFT", label: "NFT" },
  { value: "DeFi", label: "DeFi" },
  { value: "GameFi", label: "GameFi" },
  { value: "Others", label: "Others" },
];

const ContractDetails = ({ formData, onFinish }) => {
  const [form] = Form.useForm();

  const contractProtocolByAddress = useQuery(
    ["getContractProtocolByAddress", formData],
    async () => getContractProtocolByAddress(formData),
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!formData.chain && !!formData.contractAddress,
    },
  );

  const contractSource = useQuery(
    ["getContractSource", formData.contractAddress],
    async () => {
      const url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${formData.contractAddress}&apikey=M51KVY1GP9PJK67V7JACYHUB1IKQBN17RN`;
      return (await fetch(url)).json();
    },
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!formData.contractAddress,
      onSuccess: data => {
        if (!data.result?.length) return;
        form.setFieldsValue({
          abi: data.result[0].ABI,
          contractName: data.result[0].ContractName,
        });
      },
    },
  );

  const { isLoading, mutateAsync } = useMutation(submitContract);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        protocolName: "",
        projectCategory: PROTOCOL_CATEGORY_LIST[0].value,
        abi: "",
        resubmitReason: "",
        contractName: "",
        isDynamic: false,
        isFactory: false,
      }}
      onFinish={async values => {
        await mutateAsync({
          ...formData,
          ...values,
          protocolSlug: slug(values.protocolName),
          isNewProtocol: false,
          abi: JSON.parse(values.abi),
          isDynamic: values.isDynamic || false,
          isFactory: values.isFactory || false,
        });
        onFinish();
      }}
    >
      <Form.Item
        label="Project name"
        rules={[{ required: true, message: "" }]}
        name="protocolName"
      >
        <AutoComplete
          placeholder="Enter project name"
          loading={contractProtocolByAddress.isLoading}
          options={contractProtocolByAddress.data?.map(item => ({
            value: item.protocolName,
          }))}
          filterOption={(inputValue, option) =>
            toLower(option.value).indexOf(toLower(inputValue)) !== -1
          }
        />
      </Form.Item>
      <Form.Item
        label="Project category"
        rules={[{ required: true, message: "" }]}
        name="projectCategory"
      >
        <Select options={PROTOCOL_CATEGORY_LIST} />
      </Form.Item>
      <Form.Item
        label="Contract Name"
        rules={[{ required: true, message: "" }]}
        name="contractName"
      >
        <Input placeholder="Enter contract name" />
      </Form.Item>
      <Form.Item
        label="ABI"
        rules={[{ required: true, message: "" }]}
        name="abi"
      >
        <Input.TextArea
          placeholder="Enter ABI"
          rows={4}
          spellCheck={false}
          loading={contractSource.isLoading}
        />
      </Form.Item>
      <Form.Item
        label="Reason"
        rules={[{ required: true, message: "" }]}
        name="resubmitReason"
      >
        <Input.TextArea placeholder="This contract already exists on Footprint. Contract resubmissions should be handled carefully and may get rejected." />
      </Form.Item>
      <Form.Item
        name="isDynamic"
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
        style={{ marginBottom: 0 }}
        shouldUpdate={(prevValues, currentValues) => {
          return prevValues.isDynamic !== currentValues.isDynamic;
        }}
      >
        {({ getFieldValue }) => {
          return getFieldValue("isDynamic") ? (
            <Form.Item name="isFactory" valuePropName="checked">
              <Checkbox>
                <Tooltip title="Turn it on to automatically decode all contracts created by the same address. Turn it off to decode all contracts with the same bytecode.">
                  Is it created by a factory contract?
                </Tooltip>
              </Checkbox>
            </Form.Item>
          ) : null;
        }}
      </Form.Item>
      <Form.Item>
        <Button loading={isLoading} type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ContractDetails;
