/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Modal, Select } from "antd";

const InputContractModal = props => {
  const {
    tableCallback,
    open,
    setOpen
  } = props;
  const ref = useRef();
  const [contractType, setContractType] = useState();
  const [contract, setContract] = useState();

  useEffect(() => {
    setContractType(null)
    setContract(null)
  }, [open])

  return (
    <Modal
      title="Inut Contract"
      centered
      destroyOnClose
      open={open}
      width={400}
      onCancel={() => setOpen(false)}
      okText="Confirm"
      onOk={async () => {
        await ref.current.validateFields();
        console.log("contrdddd", contract, contractType)
        tableCallback({
          contract,
          contractType,
        })
        setOpen(false)
      }}
    >
      <div className="flex flex-column pt1">
        <Form
          ref={ref}
          preserve={false}
          wrapperCol={{
            flex: 1,
          }}
          labelAlign="left"
          labelWrap
          labelCol={{
            flex: '140px',
          }}
          style={{
            width: "100%",
            maxWidth: 600,
          }}
          initialValues={{
          }}
        >
          <Form.Item label={"Contract Type"} name={"contractType"} rules={[{ required: true }]} >
            <Select
              style={{
                width: 200,
              }}
              onChange={value => {
                setContractType(value)
              }}
              placeholder="Select Contract Type"
              options={[{value: "ERC20", label: "ERC20"}, {value: "ERC1155", label: "ERC1155"}]}
            />
          </Form.Item>
          <Form.Item label={"Contract"} name={"contract"} rules={[{ required: true }]} >
            <Input placeholder="Input contract" onChange={e => {
              setContract(e.target.value)
            }}/>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default InputContractModal;
