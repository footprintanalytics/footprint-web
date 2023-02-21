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

const ConfigDiscordSource = props => {
  const formRef = React.useRef(null);
  const [editable, setEditable] = useState(true);
  const onSave = values => {
    setEditable(false);
    // todo 提交表单到 api，成功之后 onNext
    // onNext();
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
        style={{ maxWidth: 1000, minWidth: 500 }}
      >
        <Form.Item
          name="guild_name"
          label="Guild Name"
          rules={[{ required: true }]}
        >
          <Input
            placeholder="Input the name of your discord guild!"
            disabled={!editable}
          />
        </Form.Item>
        <Form.Item
          name="guild_id"
          label="Guild ID"
          rules={[{ required: true }]}
        >
          <Input
            placeholder="Input the id of your discord guild!"
            disabled={!editable}
          />
        </Form.Item>
        <Form.Item
          name="bot_id"
          label="Bot ID(Client ID)"
          rules={[{ required: true }]}
        >
          <Input
            placeholder="Input the id of your discord bot!"
            disabled={!editable}
          />
        </Form.Item>
        <Form.Item
          name="bot_token"
          label="Bot Token"
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

export default ConfigDiscordSource;
