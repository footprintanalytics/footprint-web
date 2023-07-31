/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, Input, Form, message, Modal, Switch, Divider } from "antd";
import { Link } from "react-router";
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};

const ConfigChannel = props => {
  const { onChannelEditFinish, channel, setOpenDrawer } = props;
  const formRef = React.useRef(null);
  const [editable, setEditable] = useState(!channel?.configured);
  const [loading, setLoading] = useState(false);
  const onSave = values => {
    // setEditable(false);
    // setLoading(true);
    console.log("form value", values);
    onChannelEditFinish?.(values);
  };
  const onEdit = value => {
    // setEditable(true);
  };
  const initialValues = {};
  channel?.details?.map(i => {
    initialValues[i.key] = i.value;
  });

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
        initialValues={initialValues}
        layout="vertical"
        name="control-ref"
        onFinish={onSave}
        style={{ maxWidth: 1000, minWidth: 300, width: "100%" }}
      >
        {channel?.details?.map(i => {
          if (!i.extend) {
            return <></>;
          }
          i.type = i.type === "string" ? "text" : i.type;
          return (
            <div key={i.key}>
              {i.type === "text" && (
                <Form.Item
                  key={i.key}
                  name={i.key}
                  label={i.title}
                  rules={[{ required: i.required }]}
                >
                  <Input
                    defaultValue={i.value}
                    value={i.value}
                    disabled={i.notEdit}
                    allowClear
                    placeholder={`Input the ${i.title}.`}
                    type={i.private ? "password" : i.type}
                  />
                </Form.Item>
              )}

              {i.type === "boolean" && (
                <Form.Item
                  key={i.key}
                  name={i.key}
                  valuePropName="checked"
                  label={i.title}
                  rules={[{ required: i.required }]}
                >
                  <Switch disabled={i.notEdit} />
                </Form.Item>
              )}
            </div>
          );
        })}
        <Divider key={"divider"}></Divider>
        <Form.Item {...tailLayout} key={"Buttons"}>
          <div className="flex w-full flex-row-reverse">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-blue-500 ml-10"
              disabled={!editable}
            >
              Save
            </Button>
            {/* <Button htmlType="button" onClick={onEdit} disabled={editable}>
              Edit
            </Button> */}
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ConfigChannel;
