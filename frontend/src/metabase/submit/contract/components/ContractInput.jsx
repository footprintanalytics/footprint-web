/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React, { useEffect, useState } from "react";
import { Button, Input, message, Select } from "antd";
import Icon from "metabase/components/Icon";
import "./ContractInput.css";

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

  return (
    <div className="contract-input">
      <div className="contract-input__table">{
        contractData?.map((item, index) => {
          console.log("item" + index, item)
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
                <div className="contract-input__table-ul-li" style={{ flex: 3 }}>
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
                        abi: e.target.value,
                      };
                    }
                    return item;
                  }))
                }}
              />
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
