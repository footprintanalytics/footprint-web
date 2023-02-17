/* eslint-disable react/prop-types */
import React from "react";
import { Typography, Card, Button, Form, Input, Select } from "antd";
const { Option } = Select;
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
// import { FormInstance } from 'antd/es/form'

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

const ConfigProject = props => {
  const { onNext } = props;
  const formRef = React.useRef(null);

  const onFinish = values => {
    console.log(values);
    // todo 提交表单到 api,成功之后 onNext
    onNext();
  };
  return (
    <div
      className="flex flex-col w-full"
      style={{
        alignItems: "center",
      }}
    >
      <Card style={{ width: 600 }}>
        <Form
          className=" bg-white rounded-md p-5"
          {...layout}
          labelWrap
          ref={formRef}
          layout="vertical"
          name="control-ref"
          onFinish={onFinish}
          style={{ maxWidth: 1000, minWidth: 500 }}
        >
          <Form.Item
            name="project"
            label="Project"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="chain" label="Chain" rules={[{ required: true }]}>
            <Select placeholder="Select a chain">
              <Option value="Ethereum" disabled={true}>
                Ethereum
              </Option>
              <Option value="Polygon">Polygon</Option>
              <Option value="Solana" disabled={true}>
                Solana
              </Option>
            </Select>
          </Form.Item>
          <Form.List
            name="nft_contract_address"
            initialValue={["0x5c76677fea2bf5dd37e4f1460968a23a537e3ee3"]}
            rules={[]}
          >
            {(fields, { add, remove }, { errors }) => {
              return (
                <>
                  {fields.map((field, index) => (
                    <Form.Item
                      {...formItemLayout}
                      label={index === 0 ? "NFT Collection Address" : ""}
                      required={true}
                      key={field.key}
                    >
                      <Form.Item
                        {...field}
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message:
                              "Please input NFT Collection Address of your project.",
                          },
                          // {
                          //   validator: async (_, nft_contract_address) => {
                          //     if (nft_contract_address && !checkAddressValid(nft_contract_address)) {
                          //       return Promise.reject('Contarct Address fomat error!')
                          //     }
                          //   },
                          // },
                        ]}
                        noStyle
                      >
                        <Input
                          placeholder="NFT Collection Address"
                          style={{ width: "95%" }}
                        />
                      </Form.Item>
                      {fields.length > 1 && fields.length - 1 !== index ? (
                        <MinusCircleOutlined
                          className="dynamic-delete-button ml-10"
                          onClick={() => remove(field.name)}
                        />
                      ) : null}
                      {fields.length - 1 === index ? (
                        <PlusCircleOutlined
                          className="dynamic-add-button ml-10"
                          onClick={() => add()}
                        />
                      ) : null}
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              );
            }}
          </Form.List>
          <Form.Item {...tailLayout}>
            <div className="flex w-full flex-row-reverse">
              <Button htmlType="button" onClick={onNext} className="ml-10">
                Skip
              </Button>
              <Button type="primary" htmlType="submit" className=" bg-blue-500">
                Next
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ConfigProject;
