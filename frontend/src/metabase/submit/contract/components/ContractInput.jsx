/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React, { useEffect, useState } from "react";
import { Button, Input, message, Select } from "antd";
import Icon from "metabase/components/Icon";
import "./ContractInput.css";
import { get, union } from "lodash";

const ContractInput = ({ item, onChange }) => {
  const [contractData, setContractData] = useState([{
    address: null,
    name: null,
    standard: null,
    abi: null, //optional
  }]);

  useEffect(() => {
    onChange(contractData);
  }, [contractData]);


  const isFillContractAddress = address => {
    return address?.length > 0;
  };

  const isValidContractAddress = address => {
    return isValidAddress(address);
  };

  const isSameContractAddress = () => {
    return isSameAddress(contractData?.map(i => i.address).join("\n"));
  };

  const isStringABI = (abi) => {
    return abi?.startsWith("\"") || abi?.startsWith("{");
  };

  const isValidABI = (abi) => {
    if (!abi) {
      return false;
    }
    try {
      JSON.parse(abi);
      return false;
    } catch (e) {
      return true;
    }
  }

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

  const getError = contract => {
    if (!contract) {
      return null;
    }
    if (!isFillContractAddress(contract.address)) {
      return "Please fill in the new contract address.";
    }
    if (!isValidContractAddress(contract.address)) {
      return `The smart contract does not look correct on the ${item.chain} protocol. Please check your submission and try again.`;
    }
    if (isSameContractAddress()) {
      return "The contract addresses is duplicate. Please check your submission and try again.";
    }
    if (isStringABI(contract.abi)) {
      return "ABI expects an array input. Please provide data in array format.";
    }
    if (isValidABI(contract.abi)) {
      return "The ABI is not formatted correctly. It should be entered as a JSON.";
    }

    return null;
  };

  const renderError = contract => {
    const error = getError(contract);
    if (error) {
      return <div style={{ color: "#ff4d4f" }}>{error}</div>;
    }
    return null;
  };

  return (
    <div className="contract-input">
      <div className="contract-input__table">{
        contractData?.map((item, index) => {
          return (
            <div className="contract-input__table-inner" key={index}>
              <div className="flex justify-between">
                <span>Contact {index + 1}</span>

                <div
                  className="p-1 cursor-pointer flex items-center justify-center"
                  onClick={() => {
                    if (contractData.length === 1) {
                      message.error("At least one contact is required");
                      return;
                    }
                    setContractData(contractData.filter((_, i) => i !== index));
                  }}
                >
                  <Icon name={"delete"} size={16} color={"#888"} />
                </div>
              </div>
              <div className="contract-input__table-ul">
                <div className="contract-input__table-ul-li form-required" style={{ flex: 3.5 }}>
                  <Input
                    placeholder="Address (Required)"
                    value={item.address}
                    onChange={e => {
                      setContractData(contractData.map((item, i) => {
                        if (i === index) {
                          return {
                            ...item,
                            address: e.target.value,
                          };
                        }
                        return item;
                      }))
                    }}
                  />
                </div>
                <div className="contract-input__table-ul-li" style={{ flex: 1.1 }}>
                  <Input
                    placeholder="Name"
                    value={item.name}
                    onChange={e => {
                      setContractData(contractData.map((item, i) => {
                        if (i === index) {
                          return {
                            ...item,
                            name: e.target.value?.trim(),
                          };
                        }
                        return item;
                      }))
                    }}
                  />
                </div>
                <div className="contract-input__table-ul-li" style={{ flex: 1 }}>
                  <Select
                    placeholder="Standard"
                    value={item.standard}
                    options={[
                      { label: "ERC20", value: "ERC20" },
                      { label: "ERC721", value: "ERC721" },
                      { label: "ERC1155", value: "ERC1155" },
                    ]}
                    onChange={value => {
                      setContractData(contractData.map((item, i) => {
                        if (i === index) {
                          return {
                            ...item,
                            standard: value?.trim(),
                          };
                        }
                        return item;
                      }))
                    }}

                  />
                </div>
              </div>
              <div style={{padding: "0 0 0 10px"}}>
                <Input.TextArea
                  placeholder="ABI (JSON)"
                  value={item.abi}
                  rows={3}
                  spellCheck={false}
                  onChange={e => {
                    setContractData(contractData.map((item, i) => {
                      if (i === index) {
                        return {
                          ...item,
                          abi: e.target.value?.trim(),
                        };
                      }
                      return item;
                    }))
                  }}
                />
              </div>
              {renderError(contractData[index])}
            </div>
          );
        })
      }
      </div>

      <div className="contract-input__bottom">
        <div className="contract-input__add-button">
          <Button
            primary
            onClick={() => {
              setContractData([...contractData, {
                address: "",
                name: "",
                standard: "",
                abi: "",
              }]);
            }}
          >
            Add Another Address
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContractInput;
