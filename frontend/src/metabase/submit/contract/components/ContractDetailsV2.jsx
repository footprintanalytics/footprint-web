/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React, { useState } from "react";
import { Button, Form, Input, message, Select, Tabs } from "antd";
import { useMutation, useQuery } from "react-query";
import { batchSubmitContract, getContractProtocolByAddress, getProtocolInfoByAddress } from "metabase/new-service";
import { debounce, flatten, toLower, union } from "lodash";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const PROTOCOL_CATEGORY_LIST = [
  { value: "NFT", label: "NFT" },
  { value: "DeFi", label: "DeFi" },
  { value: "GameFi", label: "GameFi" },
  { value: "Others", label: "Others" },
];


const CHAIN_LIST = [
  { value: "Ethereum", label: "Ethereum" },
  { value: "Polygon", label: "Polygon" },
  { value: "Optimism", label: "Optimism" },
  { value: "BNB Chain", label: "BNB Chain" },
  { value: "Arbitrum", label: "Arbitrum" },
  { value: "Avalanche", label: "Avalanche" },
  { value: "Cronos", label: "Cronos" },
  { value: "Harmony", label: "Harmony" },
];

const ContractDetailsV2 = ({ onFinish }) => {
  const [refresh, setRefresh] = useState(0);
  const [contract, setContract] = useState([]);
  const [disableCategory, setDisableCategory] = useState(false);
  const [disableWebsite, setDisableWebsite] = useState(false);
  const [form] = Form.useForm();
  const [openAddContractSelect, setOpenAddContractSelect] = useState(false);
  const [protocolSlug, setProtocolSlug] = useState();
  console.log("contractx", contract)
  const contractProtocolByAddress = useQuery(
    ["getContractProtocolByAddress"],
    async () => getContractProtocolByAddress(),
    {
      refetchOnWindowFocus: false,
      retry: 0,
      onSuccess: () => {
        // if (isNewProtocol) return;
        // form.setFieldsValue({
        //   protocolName: formData?.contractExists?.protocolName,
        // });
      },
    },
  );

  useQuery(
    ["getContractProtocolByAddress", protocolSlug],
    async () => getProtocolInfoByAddress({ protocolSlug }),
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!protocolSlug,
      onSuccess: data => {
        form.setFieldsValue({
          projectCategory: data.projectCategory,
          website: data.website,
        });
        setDisableCategory(!!data.projectCategory)
        setDisableWebsite(!!data.website)
      },
    },
  );

  const { isLoading, mutateAsync } = useMutation(batchSubmitContract);

  const isValidContractAddress = (chain) => {
    const contractAddress = contract?.find(item => item.chain === chain)?.contractAddress?.trim() || "";
    if (!contractAddress) {
      return false;
    }
    return isValidAddress(contractAddress);
  }

  const isSameContractAddress = (chain) => {
    const contractAddress = contract?.find(item => item.chain === chain)?.contractAddress?.trim() || "";
    if (!contractAddress) {
      return false;
    }
    return isSameAddress(contractAddress);
  }

  const isValidAddress = (contractAddress) => {
    const regex = /^(0x)?[0-9a-fA-F]{40}$/;
    const array = contractAddress.split("\n");
    return array.every(address => regex.test(address))
  }

  const isSameAddress = (contractAddress) => {
    const array = contractAddress.split("\n").map(i => i.toLowerCase());
    const result = union(array)
    console.log("result11", result, array)
    return result.length !== array.length && array.length > 1
  }

  const formatContracts = (contracts) => {
    const temp = contracts.map(item => {
      return {
        ...item,
        contractAddress: item.contractAddress.trim().split("\n")
      }
    })
    const resultContracts = temp.map(contract => {
      return contract.contractAddress.map(address => {
        return {
          chain: contract.chain,
          contractAddress: address,
        }
      })
    })
    return flatten(resultContracts);
  }

  const delayedChange = debounce((item, value) => {
    const temp = contract.find(i => i.chain === item.chain)
    temp.contractAddress = value;
    temp.isValid = isValidAddress(value);
    console.log("delayedChange contract", contract)
    setContract(contract)
    form.setFieldValue("contracts", contract)
    setRefresh(refresh + 1)
    console.log("delayedChange", value)
  }, 500);


  const renderError = (chain) => {
    const temp = contract?.find(i => i.chain === chain)
    console.log("temp", temp)
    if (!temp) {
      return null;
    }
    if (!temp.contractAddress) {
      return (<div style={{ color: "#ff4d4f" }}>You must provide at least one smart contract address for each chain selected.</div>)
    }
    if (!isValidContractAddress(chain)) {
      return (<div style={{ color: "#ff4d4f" }}>The smart contract does not look correct on the {chain} protocol. Please check your submission and try again.</div>)
    }
    if (isSameContractAddress(chain)) {
      return (<div style={{ color: "#ff4d4f" }}>The contact addresses is duplicate. Please check your submission and try again.</div>)
    }

    return null;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        protocolName: null,
        projectCategory: null,
      }}
      onFinish={async values => {
        console.log("values", values)
        const isValidContract = contract.every(item => isValidContractAddress(item.chain, contract));
        if (!isValidContract) {
          message.info("Please input valid contract address");
          return ;
        }

        console.log("api info", {...values, contracts: formatContracts(values.contracts)})
        try {
          await mutateAsync({
            ...values,
            contracts: formatContracts(values.contracts),
          })
          onFinish();
        } catch (error) {}
      }}
    >
      <Form.Item
        label="Project name"
        rules={[{ required: true, message: "Select project name" }]}
        name="protocolName"
      >
        <Select
          placeholder="Select project name"
          loading={contractProtocolByAddress.isLoading}
          options={contractProtocolByAddress?.data?.map(item => ({
            value: item.protocolName,
          }))}
          dropdownRender={(menu) =>
            contractProtocolByAddress.isLoading ? (<div className="p2">Loading...</div>) : (menu)
          }
          onChange={value => {
            const protocolSlug = contractProtocolByAddress?.data?.find(item => item.protocolName === value)?.protocolSlug;
            form.setFieldValue("protocolSlug", protocolSlug);
            setProtocolSlug(protocolSlug);
          }}
          filterOption={(inputValue, option) =>
            toLower(option.value).indexOf(toLower(inputValue)) !== -1
          }
        />
      </Form.Item>
      <Form.Item
        label="Project category"
        rules={[{ required: true, message: "Select project category" }]}
        name="projectCategory"
      >
        <Select disabled={disableCategory} placeholder="Select project category" options={PROTOCOL_CATEGORY_LIST} />
      </Form.Item>
      <Form.Item
        label="Website"
        name="website"
        rules={[
          () => ({
            required: true,
            validator(_, value) {
              if (value?.startsWith("https://") || value?.startsWith("http://")) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Please start with https:// or http://"));
            },
          }),
        ]}
      >
        <Input disabled={disableWebsite} placeholder="https://your-website.com" />
      </Form.Item>
      <Form.Item
        label="Add Contact"
        rules={[{ required: true, message: "" }]}
        name="chain"
      >
        <Select
          placeholder="Select chain"
          options={CHAIN_LIST}
          open={openAddContractSelect}
          filterOption={(inputValue, option) =>
            toLower(option.value).indexOf(toLower(inputValue)) !== -1
          }
          mode="multiple"
          onChange={value => {
            setOpenAddContractSelect(false)
            if (contract.length > value.length) {
              setContract(contract.filter(i => value.includes(i.chain)))
            } else {
              setContract([...contract, {
                chain: value[value.length - 1],
                contractAddress: "",
              }])
            }
          }}
          onDropdownVisibleChange={(visible) => setOpenAddContractSelect(visible)}
        />
      </Form.Item>
      <Form.Item
        label=""
        rules={[{ required: true, message: "" }]}
        name="contracts"
      >
        <Tabs>
          {contract?.map(item => {
            return (
              <Tabs.TabPane
                key={item.chain}
                tab={
                  <div>
                    {`${item.chain} `}
                    {item.isValid? <CheckOutlined style={{ color: "#389e0d" }}/> : <CloseOutlined style={{ color: "#f5222d" }}/>}
                  </div>
                }>
                <Input.TextArea placeholder={`Input contract address in ${item.chain}`} style={{ height: 160 }} onChange={e => {
                  delayedChange(item, e.target.value)
                }}/>
                {renderError(item.chain)}
              </Tabs.TabPane>
            )
          })}
        </Tabs>
      </Form.Item>

      <Form.Item name="protocolSlug" style={{ display: "none" }}/>

      <Form.Item>
        <Button loading={isLoading} type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ContractDetailsV2;
