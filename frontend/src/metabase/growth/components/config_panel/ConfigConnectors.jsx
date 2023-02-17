/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, Input, Select, Form, Card } from "antd";
const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};
const connectors = [
  { title: "Google Analytics", disable: false },
  { title: "Twitter", disable: true },
  { title: "Discord", disable: true },
  { title: "Appsfly", disable: true },
];
const ConfigConnectors = props => {
  const { onNext } = props;
  const formRef = React.useRef(null);
  const [connector, setConnector] = useState(connectors[0].title);
  const onFinish = values => {
    console.log(values);
    // todo 提交表单到 api,成功之后 onNext
    onNext();
  };
  const getConnectorProp = selectConnector => {
    switch (selectConnector) {
      case "Google Analytics":
        return (
          <>
            <Form.Item
              name="ga_json_key"
              label="Server Account JSON Key"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </>
        );
    }
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
          <Form.Item name="connector" label="Connector Type">
            <Select
              placeholder="Select a connector"
              defaultValue={connector}
              onChange={value => {
                setConnector(value);
              }}
            >
              {connectors.map(i => {
                return (
                  <Option key={i.title} value={i.title} disabled={i.disable}>
                    {i.title}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="connector_name"
            label="Connector Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Input the name of this new connector!" />
          </Form.Item>
          <>{connector && getConnectorProp(connector)}</>
          <Form.Item {...tailLayout}>
            <div className="flex w-full flex-row-reverse">
              <Button htmlType="button" onClick={onNext} className="ml-10">
                Skip
              </Button>
              <Button type="primary" htmlType="submit" className="bg-blue-500">
                Next
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ConfigConnectors;
