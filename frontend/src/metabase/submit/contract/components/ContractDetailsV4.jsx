/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React, { useEffect, useState } from "react";
import { AutoComplete, Button, Form, Input, message, Modal, Select, Spin, Tabs, Tooltip, Upload } from "antd";
import { useQuery } from "react-query";
import slug from "slug";
import {
  CheckOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  SyncOutlined,
  UploadOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { debounce, flatten, get, isEmpty, some, toLower, union } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { getRefProtocolList } from "metabase/new-service";
import { uploadFile } from "metabase/lib/oss";
import { ossPath } from "metabase/lib/ossPath";
import ContractDecoding from "./ContractDecoding";
import InputContractModal from "metabase/submit/contract/components/InputContractModal";
import ContractInput from "metabase/submit/contract/components/ContractInput";

export const CHAIN_LIST = [
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
  { value: "Nautilus", label: "Nautilus" },
  { value: "opBNB", label: "opBNB" },
  { value: "Fantom", label: "Fantom" },
  { value: "Celo", label: "Celo" },
  { value: "DFK", label: "DFK" },
  { value: "Moonriver", label: "Moonriver" },
  { value: "Moonbeam", label: "Moonbeam" },
  { value: "Boba", label: "Boba" },
  { value: "ThunderCore", label: "ThunderCore" },
  { value: "Home Verse", label: "Home Verse" },
  { value: "MCH Verse", label: "MCH Verse" },
  { value: "Oasys", label: "Oasys" },
  { value: "Merlin", label: "Merlin" },
  { value: "Rootstock", label: "Rootstock" },
  { value: "Core", label: "Core" },
];

const PROTOCOL_CATEGORY_LIST = [
  { value: "NFT", label: "NFT" },
  { value: "DeFi", label: "DeFi" },
  { value: "GameFi", label: "GameFi" },
  { value: "Marketplace", label: "Marketplace" },
  { value: "Others", label: "Others" },
];

const ContractDetailsV4 = ({ onFinish, user, onClosed, hideEmail, protocolCategoryList, hideMoreOptions, hideProjectName, projectName, projectId, fromFgaAddProject, backAction, key }) => {
  const [refresh, setRefresh] = useState(0);
  const [open, setOpen] = useState();
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
    if (getProtocolList?.data && projectName) {
      form.setFieldsValue({
        protocolName: projectName,
      })
      const protocolSlug = getProtocolList?.data?.find(
        item => item.protocol_name === projectName,
      )?.protocol_slug;
      setProtocolSlug(protocolSlug);
    }
  }, [projectName, getProtocolList?.data])

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

  const isValidABI = chain => {
    const contractData =
      contract?.find(item => item.chain === chain)?.contractData || [];
    return contractData?.every(i => {
      if (isEmpty(i.abi)) {
        return true;
      }
      if (!i.abi.startsWith("[")) {
        return false
      }
      try {
        const data = JSON.parse(i.abi);
        for (const item of data) {
          // eslint-disable-next-line no-prototype-builtins
          if (item.hasOwnProperty('inputs') && item.hasOwnProperty('outputs') && item.hasOwnProperty('name')) {
            return true
          }
        }
      } catch (e) {
        return false;
      }
    });
  }

  const isFillContractAddress = chain => {
    const contractData =
      contract?.find(item => item.chain === chain)?.contractData || [];
    if (some(contractData, i => i.address)) {
      return true;
    }
    return false;
  };

  const isValidContractAddress = chain => {
    const contractData =
      contract?.find(item => item.chain === chain)?.contractData || [];
    if (some(contractData, i => !i.address)) {
      return false;
    }
    return isValidAddress(contractData?.map(i => i.address).join("\n"));
  };

  const isSameContractAddress = chain => {
    const contractData =
      contract?.find(item => item.chain === chain)?.contractData || [];
    if (some(contractData, i => !i.address)) {
      return false;
    }
    return isSameAddress(contractData?.map(i => i.address).join("\n"));
  };

  const isValidAddress = contractAddress => {
    if (!contractAddress) {
      return false
    }
    const regex = /^(0x)?[0-9a-fA-F]{40,}$/;
    const array = contractAddress?.split("\n");
    return array.every(address => regex.test(get(address?.split(","),"[0]")));
  };
  const isValidAddressArray = contractAddressArray => {
    const regex = /^(0x)?[0-9a-fA-F]{40,}$/;
    return contractAddressArray.map(i => i.contract).every(address => regex.test(address));
  };

  const isSameAddress = contractAddress => {
    const array = contractAddress?.split("\n").map(i => i.toLowerCase());
    const result = union(array);
    return result.length !== array.length && array.length > 1;
  };

  function createAbi(abi) {
    let abiArray = null;
    try {
      abiArray = JSON.parse(abi);
    } catch (e) {
    }
    return abiArray;
  }

  const formatContracts = contracts => {
    const temp = contracts?.map(item => {
      return {
        ...item,
        contractAddress: item.contractAddress?.trim()?.split("\n"),
      };
    });
    const resultContracts = temp?.map(contract => {
      return contract?.contractData?.map(item => {
        return {
          chain: contract.chain,
          contractAddress: item.address,
          contractName: item.name,
          standard: item.standard,
          abi: createAbi(item.abi),
        };
      });
    });
    return flatten(resultContracts) ?? [];
  };

  const delayedChange = debounce((item, contractData) => {
    const temp = contract.find(i => i.chain === item.chain);
    temp.contractData = contractData;
    temp.isValid = isValidAddress(contractData[0].address);
    setContract(contract);
    form.setFieldValue("contracts", contract);
    setRefresh(refresh + 1);
  }, 500);

  const getError = chain => {
    const temp = contract?.find(i => i.chain === chain);
    // console.log("temptemptemp", temp, temp?.chain, temp?.contractData, temp?.contractData?.filter(i => !isEmpty(i.address)))
    if (!temp) {
      return null;
    }
    if (!isFillContractAddress(chain)) {
      return "Please fill in the new contract address.";
    }
    // if (temp?.contractData?.filter(i => !isEmpty(i.address))?.length > 0) {
    //   return "You must provide at least one smart contract address for each chain selected.";
    // }
    if (!isValidContractAddress(chain)) {
      return `The smart contract does not look correct on the ${chain} protocol. Please check your submission and try again.`;
    }
    if (isSameContractAddress(chain)) {
      return "The contract addresses is duplicate. Please check your submission and try again.";
    }

    return null;
  };

  const renderContract = (item) => {
    const temp = contract.find(i => i.chain === item.chain);
    return (
      <div>
        <Button onClick={() => {
        }}>Add</Button>
        {temp.contractAddressArray?.map((c) => {
          return (
            <div key={c.contract} className="flex">
              {c.contract}{"|"}{c.contractType}
              <Button onClick={() => {
                temp.contractAddressArray = [...(temp.contractAddressArray?.filter(con => con.contract !== c.contract) || [])];
                temp.isValid = isValidAddressArray(temp.contractAddressArray);
                setContract(contract);
                form.setFieldValue("contracts", contract);
                setRefresh(refresh + 1);
              }}>Delete</Button>
            </div>
          )
        })}
        <InputContractModal open={open} setOpen={setOpen} tableCallback={({contract, contractType}) => {
          // setContracts()

          temp.contractAddressArray = [...(temp.contractAddressArray || []), {contract, contractType}];
          temp.isValid = isValidAddressArray(temp.contractAddressArray);
          setContract((c) => c);
          form.setFieldValue("contracts", contract);
          setRefresh(refresh + 1);
        }}/>
      </div>
    )
  }

  /*const renderError = chain => {
    const error = getError(chain);
    if (error) {
      return <div style={{ color: "#ff4d4f" }}>{error}</div>;
    }
    return null;
  };*/
  const moreOptionBtn = () => {
    return (
      <Button
        type="link"
        style={{ padding: "4px 0px" }}
        onClick={() => {
          setMoreOptions(!isMoreOptions);
        }}
      >
        {isMoreOptions ? <UpOutlined /> : <DownOutlined />}{" "}
        {`More options ${
          !isMoreOptions
            ? "(Logo, Twitter, Discord, Telegram, Github, Description)"
            : ""
        }`}
      </Button>
    );
  };
  const [imageUploading, setImageUploading] = useState(false);
  const uploadProps = {
    accept: ".png, .jpg, .jpeg, .gif, .svg, .webp",
    showUploadList: false,
    maxCount: 1,
    beforeUpload: async file => {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
        return false;
      }
      const fileName = `logo_images/${uuidv4()}-${file.name}`;
      setImageUploading(true);
      await uploadFile({ fileName, file });
      const fileUrl = `https://static.footprint.network/${ossPath(fileName)}`;
      form.setFieldsValue({
        logo: fileUrl,
      });
      setImageUploading(false);
    },
  };

  const isValidStandard = (contracts) => {
    const array = ["ERC1155", "ERC721", "ERC20"];
    return contracts?.map(i => i?.standard).every(i => array.includes(i));
  }

  const getEmail = () => {
    return user?.email;
  }

  const eventChains = [
    'Ethereum',
    'Cronos',
    'Core',
    'Arbitrum',
    'Avalanche',
    'BNB Chain',
    'Harmony',
    'Merlin',
    'Optimism',
    'Polygon',
    'Oasys',
    'Fantom',
    'zkSync Era',
    'Ronin',
    'Rootstock',
  ]

  const callChains = [
    'Ethereum',
    'Polygon',
    'BNB Chain',
    'Arbitrum',
    'Fantom',
    'Merlin',
    'Optimism',
    'zkSync Era',
  ]

  const getABITip = (chain) => {
    console.log("bbbbbb", callChains.includes(chain))
    if (eventChains.includes(chain) && callChains.includes(chain)) {
      return `\nAfter submitting ${chain}'s ABI, you can use events & calls. `
    }
    if (eventChains.includes(chain)) {
      return `\nAfter submitting ${chain}'s ABI, you can use events. `
    }
    if (callChains.includes(chain)) {
      return `\nAfter submitting ${chain}'s ABI, you can use calls. `
    }
    return ""
  }

  return (
    <div key={key}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          protocolName: null,
          // projectCategory: null,
        }}
        onFinish={async values => {
          const protocolName = projectName || values?.protocolName;
          const isNewProtocol = !getProtocolList?.data
            ?.map(item => item.protocol_name ?? item.protocol_slug)
            ?.includes(protocolName);
          const isValidContract = contract.every(item =>
            isValidContractAddress(item.chain, contract),
          );
          const projectIdObject = projectId ? { projectId }: {};
          if (!isValidContract) {
            message.info("Please input valid contract address");
            return;
          }
          const isValidABIs = contract.every(item =>
            isValidABI(item.chain, contract),
          );
          if (!isValidABIs) {
            message.info("Please input valid ABI (JSON)");
            return;
          }
          try {
            const param = {
              ...values,
              username: user?.name,
              email: getEmail(),
              contracts: formatContracts(values.contracts),
              protocolSlug:
                protocolSlug ||
                values.protocolSlug ||
                slug(protocolName),
              protocolName: protocolName,
              ...projectIdObject,
              isNewProtocol,
            };

            if (fromFgaAddProject && !isValidStandard(param.contracts)) {
              message.info("Please input valid standard. e.g.0x123456789ABCDEF,ERC1155");
              return;
            }
            onClosed?.(param);
          } catch (error) {
            console.log("ref submit contracts error:\n", error);
          }
        }}
      >
        {projectName && (<div style={{ margin: "10px 0" }}>Project: {projectName}</div>)}
        <Form.Item
          hidden={hideProjectName}
          label={
            <>
              Project name{" "}
              {getProtocolList.isLoading && (
                <Spin
                  className=" ml-10"
                  size="small"
                  indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />}
                ></Spin>
              )}
            </>
          }
          rules={[{ required: !hideProjectName, message: "Select project name" }]}
          name="protocolName"
        >
          <AutoComplete
            placeholder={
              getProtocolList.isLoading ? "Loading..." : "Select project name"
            }
            disabled={getProtocolList.isLoading}
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
              toLower(option.value)
                .trim()
                .replace(" ", "")
                .indexOf(toLower(inputValue).trim().replace(" ", "")) !== -1
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
            options={protocolCategoryList || PROTOCOL_CATEGORY_LIST}
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
        {/*<Form.Item
          hidden={hideEmail}
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
        </Form.Item>*/}
        <Form.Item
          label="Add Contract"
          rules={[{ required: !!fromFgaAddProject, message: "" }]}
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
                    <div className="mb1" style={{ fontSize: 12, whiteSpace: "pre-line" }}>
                      {
                        fromFgaAddProject ? "Please provide the project contract address and token standard in the following format. Separate each entry with a comma. e.g. 0x123456789ABCDEF,ERC1155\n" +
                          "\n" +
                          "Make sure to verify the information is correct before submitting or else there is a chance your request will not go through\n" :
                        "Be sure to add smart contracts. Errors could cause your contracts to be rejected!" + getABITip(item.chain)
                      }
                    </div>
                    {/*0x1092eb9c78833c6e0b4b9875eb84585814f613cf,ERC1155*/}
                    <ContractInput
                      item={item}
                      onChange={contractData => {
                        delayedChange(item, contractData);
                      }}
                    />
                    {/*{renderError(item.chain)}*/}
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
                      !value ||
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
              <Input placeholder="Please provide the logo url of the project" />
            </Form.Item>
            <Form.Item
              label="Twitter"
              name="twitter"
              rules={[
                () => ({
                  required: false,
                  validator(_, value) {
                    if (
                      !value ||
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
              <Input placeholder="Please provide the twitter url of the project,such as https://twitter.com/Footprint_Data" />
            </Form.Item>
            <Form.Item
              label="Discord"
              name="discord"
              rules={[
                () => ({
                  required: false,
                  validator(_, value) {
                    if (
                      !value ||
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
              <Input placeholder="Please provide the discord invite url of the project,such as https://discord.gg/***" />
            </Form.Item>
            <Form.Item
              label="Telegram"
              name="telegram"
              rules={[
                () => ({
                  required: false,
                  validator(_, value) {
                    if (
                      !value ||
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
              <Input placeholder="Please provide the telegram join url of the project,such as https://t.me/joinchat/***" />
            </Form.Item>
            <Form.Item
              label="Github"
              name="github"
              rules={[
                () => ({
                  required: false,
                  validator(_, value) {
                    if (
                      !value ||
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
              <Input placeholder="Please provide the github url of the project" />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input placeholder="Please provide the description of the project" />
            </Form.Item>
          </div>
        )}
        <Form.Item>
          <div className="w-full flex flex-row-reverse justify-between align-center">
            <div className="flex align-center gap-2 mt-1">
              {backAction && (
                <div style={{ width: 120 }}>
                  <Button onClick={backAction}>Go Back</Button>
                </div>
              )}
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
            {!hideMoreOptions && !isMoreOptions && moreOptionBtn()}
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

export default ContractDetailsV4;
