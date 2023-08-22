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
  Typography,
  Upload,
} from "antd";
import { useQuery } from "react-query";
import slug from "slug";
import {
  CheckOutlined,
  ExclamationCircleOutlined,
  DownOutlined,
  UpOutlined,
  SyncOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { debounce, flatten, toLower, union } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { getRefProtocolList } from "metabase/new-service";
import { getSuffix } from "metabase/containers/news/util/handle";
import { uploadFile } from "metabase/lib/oss";
import { ossPath } from "metabase/lib/ossPath";
import ContractDecoding from "./ContractDecoding";

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
];
const PROTOCOL_CATEGORY_LIST = [
  { value: "NFT", label: "NFT" },
  { value: "DeFi", label: "DeFi" },
  { value: "GameFi", label: "GameFi" },
  { value: "Marketplace", label: "Marketplace" },
  { value: "Others", label: "Others" },
];

const ContractDetailsV3 = ({ onFinish, user, onClosed }) => {
  const [refresh, setRefresh] = useState(0);
  const [contract, setContract] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState({ open: false, param: null });
  const [form] = Form.useForm();
  const [openAddContractSelect, setOpenAddContractSelect] = useState(false);
  const [protocolSlug, setProtocolSlug] = useState();
  const [isMoreOptions, setMoreOptions] = useState(false);

  const getProtocolList = useQuery(
    ["getRefProtocolList"],
    async () => getRefProtocolList(),
    {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  );

  useEffect(() => {
    if (!protocolSlug) {
      form.setFieldsValue({
        email: user?.email,
        website: null,
        projectCategory: null,
        logo: null,
      });
    } else {
      getProtocolList?.data?.forEach(item => {
        if (item.protocol_slug === protocolSlug) {
          form.setFieldsValue({
            email: user?.email,
            website: item.website,
            projectCategory: item.protocol_type,
          });
        }
      });
    }
  }, [protocolSlug]);

  const isValidContractAddress = chain => {
    const contractAddress =
      contract?.find(item => item.chain === chain)?.contractAddress || "";
    if (!contractAddress) {
      return false;
    }
    return isValidAddress(contractAddress);
  };

  const isSameContractAddress = chain => {
    const contractAddress =
      contract?.find(item => item.chain === chain)?.contractAddress || "";
    if (!contractAddress) {
      return false;
    }
    return isSameAddress(contractAddress);
  };

  const isValidAddress = contractAddress => {
    const regex = /^(0x)?[0-9a-fA-F]{40}$/;
    const array = contractAddress.split("\n");
    return array.every(address => regex.test(address));
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
        contractAddress: item.contractAddress.trim().split("\n"),
      };
    });
    const resultContracts = temp?.map(contract => {
      return contract?.contractAddress?.map(address => {
        return {
          chain: contract.chain,
          contractAddress: address,
        };
      });
    });
    return flatten(resultContracts) ?? [];
  };

  const delayedChange = debounce((item, value) => {
    const temp = contract.find(i => i.chain === item.chain);
    temp.contractAddress = value;
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
    if (!temp.contractAddress) {
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
  const moreOptionBtn = () => {
    return (
      <Button
        type="link"
        style={{ padding: "4px 0px" }}
        onClick={() => {
          setMoreOptions(!isMoreOptions);
        }}
      >
        {isMoreOptions ? <UpOutlined /> : <DownOutlined />} More options
      </Button>
    );
  };
  const [imageUploading, setImageUploading] = useState(false);
  const uploadProps = {
    // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    accept: ".png, .jpg, .jpeg, .gif, .svg, .webp",
    // listType: "text",
    showUploadList: false,
    maxCount: 1,
    beforeUpload: async file => {
      console.log("uploadProps beforeUpload", file);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
        return false;
      }
      const fileName = `logo_images/${uuidv4()}-${file.name}`;
      setImageUploading(true)
      await uploadFile({ fileName, file });
      const fileUrl = `https://static.footprint.network/${ossPath(fileName)}`;
      form.setFieldsValue({
        logo: fileUrl,
      });
      setImageUploading(false)
      // return (isImage && isLt2M) || Upload.LIST_IGNORE;
    },
  };
  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          protocolName: null,
          // projectCategory: null,
        }}
        onFinish={async values => {
          const isNewProtocol = !getProtocolList?.data
            ?.map(item => item.protocol_name ?? item.protocol_slug)
            ?.includes(values?.protocolName);
          const isValidContract = contract.every(item =>
            isValidContractAddress(item.chain, contract),
          );
          if (!isValidContract) {
            message.info("Please input valid contract address");
            return;
          }

          try {
            const param = {
              ...values,
              contracts: formatContracts(values.contracts),
              protocolSlug: values.protocolSlug || slug(values.protocolName),
              isNewProtocol,
            };
            onClosed?.(param);
          } catch (error) {
            console.log("ref submit contracts error:\n", error);
          }
        }}
      >
        <Form.Item
          label="Project name"
          rules={[{ required: true, message: "Select project name" }]}
          name="protocolName"
        >
          <AutoComplete
            placeholder="Select project name"
            loading={getProtocolList.isLoading}
            options={getProtocolList?.data?.map(item => ({
              value: item.protocol_name,
            }))}
            dropdownRender={menu =>
              getProtocolList.isLoading ? (
                <div className="p2">Loading...</div>
              ) : (
                menu
              )
            }
            onChange={value => {
              const protocolSlug = getProtocolList?.data?.find(
                item => item.protocol_name === value,
              )?.protocol_slug;
              // form.setFieldValue("protocolSlug", protocolSlug);
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
          <Select
            placeholder="Select project category"
            options={PROTOCOL_CATEGORY_LIST}
          />
        </Form.Item>
        <Form.Item
          label="Website"
          name="website"
          tooltip="Please provide the website of the project you are submitting. This will help us verify the project and mapping more contract for this project."
          rules={[
            () => ({
              required: true,
              validator(_, value) {
                if (
                  value?.startsWith("https://") ||
                  value?.startsWith("http://")
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Please start with https:// or http://"),
                );
              },
            }),
          ]}
        >
          <Input placeholder="https://project-website.com" />
        </Form.Item>
        <Form.Item
          label="Your Email Address"
          tooltip="Please provide your email address so that we can notify you when contracts or protocols are successfully decoded and calculate your contribution value."
          name="email"
          rules={[
            () => ({
              required: false,
              validator(_, value) {
                if (
                  value &&
                  !/^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
                ) {
                  return Promise.reject(
                    new Error("Please input a valid email address"),
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input placeholder="Please input your email address." />
        </Form.Item>
        <Form.Item
          label="Add Contract"
          // rules={[{ required: true, message: "" }]}
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
                    contractAddress: "",
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
              {contract?.map(item => {
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
                    <div className="mb1">
                      Be sure to add one smart contract per line. Errors could
                      cause your contracts to be rejected!
                    </div>
                    <Input.TextArea
                      placeholder={`Input contract address in ${item.chain}`}
                      style={{ height: 160 }}
                      onChange={e => {
                        delayedChange(item, e.target.value);
                      }}
                    />
                    {renderError(item.chain)}
                  </Tabs.TabPane>
                );
              })}
            </Tabs>
          </Form.Item>
        )}
        {isMoreOptions && moreOptionBtn()}
        {isMoreOptions && (
          <div
            style={{
              backgroundColor: "var(--color-bg-light)",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: 10,
            }}
          >
            <Form.Item
              label={
                <>
                  Logo{" "}
                  <Upload {...uploadProps} className="ml1">
                    <Button
                      size="small"
                      icon={
                        imageUploading ? (
                          <SyncOutlined spin />
                        ) : (
                          <UploadOutlined />
                        )
                      }
                    >
                      {imageUploading ? "Uploading" : "Upload"}
                    </Button>
                  </Upload>
                </>
              }
              name="logo"
              rules={[
                () => ({
                  required: false,
                  validator(_, value) {
                    if (
                      value?.startsWith("https://") ||
                      value?.startsWith("http://")
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please start with https:// or http://"),
                    );
                  },
                }),
              ]}
            >
              <Input placeholder="Please provide the Logo of the project" />
            </Form.Item>
            <Form.Item
              label="Twitter"
              name="twitter"
              // tooltip="Please provide the Twitter of the project"
              rules={[
                () => ({
                  required: false,
                  validator(_, value) {
                    if (
                      value?.startsWith("https://") ||
                      value?.startsWith("http://")
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please start with https:// or http://"),
                    );
                  },
                }),
              ]}
            >
              <Input placeholder="Please provide the Twitter of the project" />
            </Form.Item>
            <Form.Item
              label="Discord"
              name="discord"
              // tooltip="Please provide the Discord of the project"
              rules={[
                () => ({
                  required: false,
                  validator(_, value) {
                    if (
                      value?.startsWith("https://") ||
                      value?.startsWith("http://")
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please start with https:// or http://"),
                    );
                  },
                }),
              ]}
            >
              <Input placeholder="Please provide the Discord of the project" />
            </Form.Item>
            <Form.Item
              label="Telegram"
              name="telegram"
              // tooltip="Please provide the Telegram of the project"
              rules={[
                () => ({
                  required: false,
                  validator(_, value) {
                    if (
                      value?.startsWith("https://") ||
                      value?.startsWith("http://")
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please start with https:// or http://"),
                    );
                  },
                }),
              ]}
            >
              <Input placeholder="Please provide the Telegram of the project" />
            </Form.Item>
            <Form.Item
              label="Github"
              name="github"
              // tooltip="Please provide the Github of the project"
              rules={[
                () => ({
                  required: false,
                  validator(_, value) {
                    if (
                      value?.startsWith("https://") ||
                      value?.startsWith("http://")
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please start with https:// or http://"),
                    );
                  },
                }),
              ]}
            >
              <Input placeholder="Please provide the Github of the project" />
            </Form.Item>
          </div>
        )}
        <Form.Item>
          <div className="w-full flex flex-row-reverse justify-between align-center">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            {!isMoreOptions && moreOptionBtn()}
          </div>
        </Form.Item>
      </Form>
      <Modal
        open={isModalOpen?.open}
        centered
        destroyOnClose={true}
        closable={true}
        maskClosable={false}
        width={700}
        footer={null}
        onCancel={() => setIsModalOpen({ open: false, param: null })}
      >
        <ContractDecoding
          param={isModalOpen?.param}
          onSuccess={() => {
            setIsModalOpen({ open: false, param: null });
          }}
        ></ContractDecoding>
      </Modal>
    </div>
  );
};

export default ContractDetailsV3;
