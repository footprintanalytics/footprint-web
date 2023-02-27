/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, Input, Form } from "antd";
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};

const ConfigAppsFlyerSource = props => {
  const { onAddConnector } = props;
  const formRef = React.useRef(null);
  const [editable, setEditable] = useState(true);
  const onSave = values => {
    setEditable(false);
    // todo 提交表单到 api，成功之后 onNext

    onAddConnector("af");
  };
  const onEdit = value => {
    setEditable(true);
  };

  return (
    <div
      className="flex flex-col w-full p-5"
      style={{
        alignItems: "center",
      }}
    >
      <Form
        {...layout}
        labelWrap
        ref={formRef}
        layout="vertical"
        name="control-ref"
        onFinish={onSave}
        style={{ maxWidth: 1000, minWidth: 300, width: "100%" }}
      >
        <Form.Item name="app_id" label="App ID" rules={[{ required: true }]}>
          <Input
            placeholder="Input the app id of your project in AppsFlyer!"
            disabled={!editable}
          />
        </Form.Item>
        <Form.Item
          name="api_token"
          label="Api Token"
          rules={[{ required: true }]}
        >
          <Input type="password" disabled={!editable} />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <div className="flex w-full flex-row-reverse">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-500 ml-10"
              disabled={!editable}
            >
              Save
            </Button>
            <Button htmlType="button" onClick={onEdit} disabled={editable}>
              Edit
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ConfigAppsFlyerSource;
