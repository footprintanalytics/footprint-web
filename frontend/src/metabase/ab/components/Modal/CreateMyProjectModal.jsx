/* eslint-disable react/prop-types */
import React, { useRef } from "react";
import { Form, Input, message, Modal } from "antd";

const CreateMyProjectModal = props => {
  const {
    open,
    setOpen,
    onSuccess,
  } = props;
  const ref = useRef();

  return (
    <Modal
      title="Create a new Project"
      centered
      destroyOnClose
      open={open}
      width={600}
      onCancel={() => setOpen(false)}
      okText="Confirm"
      onOk={async () => {
        await ref.current.validateFields();
        onSuccess(ref.current.getFieldsValue())
        setOpen(false)
      }}
    >
      <div className="flex flex-column pt1">
        <div className="mb4">
          At FGA, you can create unlimited amount of games and choose variety of data onboarding options to start configuring your game analytics for your liking.
        </div>
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
          <Form.Item label={"Project name"} name={"name"} rules={[{ required: true }]} >
            <Input
              placeholder="Input the project name"
              style={{
                width: 360,
              }}
            />
          </Form.Item>
          <Form.Item label={"Description"} name={"description"} >
            <Input.TextArea
              placeholder="Input the project description"
              style={{
                width: 360,
                height: 100,
              }}
            />
          </Form.Item>
          <Form.Item label={"Website"} name={"website"} >
            <Input
              placeholder="Input the project description"
              style={{
                width: 360,
              }}
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default CreateMyProjectModal;
