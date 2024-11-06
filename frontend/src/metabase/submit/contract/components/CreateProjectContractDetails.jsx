/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React, { useState, useEffect } from "react";
import {
  AutoComplete,
  Button,
  Form,
  Input,
  message,
  Select,
  Tabs,
  Modal,
  Tooltip,
  Upload,
  Spin, Tag,
} from "antd";
import { useQuery } from "react-query";
import slug from "slug";
import {
  CheckOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
  DownOutlined,
  UpOutlined,
  SyncOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { debounce, flatten, get, toLower, union } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { getRefProtocolList } from "metabase/new-service";
import { uploadFile } from "metabase/lib/oss";
import { ossPath } from "metabase/lib/ossPath";
import ContractDecoding from "./ContractDecoding";
import InputContractModal from "metabase/submit/contract/components/InputContractModal";

const CHAIN_LIST = [
  { value: "Ethereum", label: "Ethereum" },
  { value: "Polygon", label: "Polygon" },
  { value: "Optimism", label: "Optimism" },
  { value: "BNB Chain", label: "BNB Chain" },
  { value: "Arbitrum", label: "Arbitrum" },
  { value: "Avalanche", label: "Avalanche" },
  { value: "Cronos", label: "Cronos" },
  { value: "Harmony", label: "Harmony" },
  { value: "zkSync Era", label: "zkSync Era" },
  { value: "Sui", label: "Sui" },
  { value: "Combo", label: "Combo" },
  { value: "Rootstock", label: "Rootstock" },
  { value: "Ronin", label: "Ronin" },
];

const CreateProjectContractDetails = ({ onFinish, user, onClosed, projectObject }) => {
  const [refresh, setRefresh] = useState(0);
  const [contract, setContract] = useState([]);
  const [form] = Form.useForm();
  const [openAddContractSelect, setOpenAddContractSelect] = useState(false);

  const isValidContractAddress = chain => {
    const contractAddress =
      contract?.find(item => item.chain === chain)?.address || "";
    if (!contractAddress) {
      return false;
    }
    return isValidAddress(contractAddress);
  };

  const isSameContractAddress = chain => {
    const contractAddress =
      contract?.find(item => item.chain === chain)?.address || "";
    if (!contractAddress) {
      return false;
    }
    return isSameAddress(contractAddress);
  };

  const isValidAddress = contractAddress => {
    const regex = /^(0x)?[0-9a-fA-F]{40,}$/;
    const array = contractAddress.split("\n");
    return array.every(address => regex.test(get(address.split(","),"[0]")));
  };

  const isSameAddress = contractAddress => {
    const array = contractAddress.split("\n").map(i => i.toLowerCase());
    const result = union(array);
    return result.length !== array.length && array.length > 1;
  };

  const formatContracts = contracts => {
    const temp = contracts?.map(item => {
      return {
        ...item,
        address: item.address.trim().split("\n"),
      };
    });
    const resultContracts = temp?.map(contract => {
      return contract?.address?.map(address => {
        const array = address.split(",");
        const addr = get(array, "[0]");
        const standard = get(array, "[1]");
        return {
          chain: contract.chain,
          address: addr,
          standard: standard,
        };
      });
    });
    return flatten(resultContracts) ?? [];
  };

  const delayedChange = debounce((item, value) => {
    const temp = contract.find(i => i.chain === item.chain);
    temp.address = value;
    temp.isValid = isValidAddress(value);
    setContract(contract);
    form.setFieldValue("contracts", contract);
    setRefresh(refresh + 1);
  }, 500);

  const getError = chain => {
    const temp = contract?.find(i => i.chain === chain);
    if (!temp) {
      return null;
    }
    if (!temp.address) {
      return "You must provide at least one smart contract address for each chain selected.";
    }
    if (!isValidContractAddress(chain)) {
      return `The smart contract does not look correct on the ${chain} protocol. Please check your submission and try again.`;
    }
    if (isSameContractAddress(chain)) {
      return "The contract addresses is duplicate. Please check your submission and try again.";
    }

    return null;
  };

  const renderError = chain => {
    const error = getError(chain);
    if (error) {
      return <div style={{ color: "#ff4d4f" }}>{error}</div>;
    }
    return null;
  };

  const isValidStandard = (contracts) => {
    const array = ["ERC1155", "ERC721", "ERC20"];
    return contracts?.map(i => i?.standard).every(i => array.includes(i));
  }

  useEffect(() => {
    if (projectObject) {
      const output = {
        chain: [],
        contracts: []
      };
      projectObject?.contractAddress?.forEach(item => {
        if (!output.chain.includes(item.chain)) {
          output.chain.push(item.chain);
        }

        output.contracts.push({
          address: `${item.address},${item.standard}`,
          chain: item.chain,
          isValid: true
        });
      });
      const addressItemValues = {};
      //处理上部分tab
      const newContracts = output.contracts.reduce((acc, current) => {
        const existing = acc.find(item => item.chain === current.chain);

        if (existing) {
          existing.address += `\n${current.address}`;
        } else {
          acc.push({...current});
        }

        return acc;
      }, []);
      setContract(newContracts);
      //处理下部分输入的内容
      output.chain.forEach((chainName, index) => {
        const addresses = output.contracts
          .filter(contract => contract.chain === chainName)
          .map(contract => contract.address)
          .join('\n');

        addressItemValues[`addressItem${index}`] = addresses;
      });
      console.log("addressItemValues", JSON.stringify(output), JSON.stringify(addressItemValues))
      form.setFieldsValue({
        ...addressItemValues,
      })
    }
  }, [projectObject])

  const getInitialValues = () => {
    if (projectObject) {
      const output = {
        chain: [],
        contracts: []
      };

      projectObject?.contractAddress?.forEach(item => {
        if (!output.chain.includes(item.chain)) {
          output.chain.push(item.chain);
        }

        output.contracts.push({
          address: `${item.address},${item.standard}`,
          chain: item.chain,
          isValid: false
        });
      });
      console.log("output", output)
      return output;
    }
    return {};
  }

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...getInitialValues(),
        }}
        onFinish={async values => {
          console.log("values121212212", values);
          const isValidContract = contract.every(item =>
            isValidContractAddress(item.chain, contract),
          );
          const projectId = projectObject?.id;
          const projectIdObject = projectId ? { projectId }: {};
          if (!isValidContract) {
            message.info("Please input valid contract address");
            return;
          }
          try {
            const param = {
              ...values,
              contracts: formatContracts(values.contracts),
              ...projectIdObject,
            };

            if (!isValidStandard(param.contracts)) {
              message.info("Please input valid standard. e.g.0x123456789ABCDEF,ERC1155");
              return;
            }
            console.log("param", param)
            onClosed?.(param);
          } catch (error) {
            console.log("ref submit contracts error:\n", error);
          }
        }}
      >
        {!projectObject && (
          <Form.Item
            label="Project Name"
            name="projectName"
            required={true}
            rules={[{ required: true, message: 'Please input your project name!' }]}
            style={{marginBottom: 20}}
          >
            <Input
              placeholder="Project Name"
              style={{ width: "100%" }}
            />
          </Form.Item>
        )}
        {
          projectObject && <h2>Project Name: {projectObject?.name}</h2>
        }
        <Form.Item
          className="mt-4"
          label="Project Contracts"
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
              setOpenAddContractSelect(false);
              if (contract.length > value.length) {
                setContract(contract.filter(i => value.includes(i.chain)));
              } else {
                setContract([
                  ...contract,
                  {
                    chain: value[value.length - 1],
                    address: "",
                  },
                ]);
              }
            }}
            onDropdownVisibleChange={visible =>
              setOpenAddContractSelect(visible)
            }
          />
        </Form.Item>
        {contract?.length > 0 && (
          <Form.Item
            label=""
            // rules={[{ required: true, message: "" }]}
            name="contracts"
          >
            <Tabs>
              {contract?.map((item, index) => {
                return (
                  <Tabs.TabPane
                    key={item.chain}
                    tab={
                      <div>
                        {`${item.chain} `}
                        {item.isValid ? (
                          <CheckOutlined style={{ color: "#389e0d" }} />
                        ) : (
                          <Tooltip title={getError(item.chain)}>
                            <ExclamationCircleOutlined
                              style={{ color: "#f5222d" }}
                            />
                          </Tooltip>
                        )}
                      </div>
                    }
                  >
                    <div className="mb1" style={{ fontSize: 12, whiteSpace: "pre-line" }}>
                      {
                        "Please provide the project contract address and token standard in the following format. Separate each entry with a comma. e.g. 0x123456789ABCDEF,ERC1155\n" +
                          "\n" +
                          "Make sure to verify the information is correct before submitting or else there is a chance your request will not go through\n"
                      }
                    </div>
                    {/*0x1092eb9c78833c6e0b4b9875eb84585814f613cf,ERC1155*/}
                    <Form.Item
                      label=""
                      // rules={[{ required: true, message: "" }]}
                      name={`addressItem${index}`}
                    >
                      <Input.TextArea
                        placeholder={`0x123456789ABCDEF,ERC1155`}
                        style={{ height: 160 }}
                        onChange={e => {
                          delayedChange(item, e.target.value);
                        }}
                      />
                    </Form.Item>
                    {renderError(item.chain)}
                  </Tabs.TabPane>
                );
              })}
            </Tabs>
          </Form.Item>
        )}
        <Form.Item>
          <div className="w-full flex flex-row-reverse justify-between align-center">
            <div className="flex align-center gap-2 mt4">
              <Button type="primary" htmlType="submit">
                {`${projectObject ? 'Edit': "Create"}`} Project
              </Button>
            </div>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateProjectContractDetails;
