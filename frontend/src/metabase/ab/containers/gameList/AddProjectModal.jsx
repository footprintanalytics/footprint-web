/* eslint-disable react/prop-types */
import React, {useState, useEffect, useRef} from "react";
import {Select, Form, Modal, Input, message} from "antd";
import {postProject} from "metabase/new-service";

const AddProjectModal = props => {
  const {
    successCallback,
    open,
    setOpen
  } = props;
  const ref = useRef();

  const postProjectApi = async (params) => {
    const hide = message.loading("Loading...", 20000);
    try {
      await postProject({
        "names": [params?.name],
        "userId": 158,
        "ecosystemId": 415
      })
      hide();
      message.success("Project add success")
      successCallback();
    } catch (e) {
      hide();
    } finally {
      hide();
    }
  }

  return (
    <Modal
      title="Add Project"
      centered
      destroyOnClose
      open={open}
      width={600}
      onCancel={() => setOpen(false)}
      okText="Confirm"
      onOk={async () => {
        await ref.current.validateFields();
        postProjectApi(ref.current.getFieldsValue())
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
          <Form.Item label={"Project name"} name={"name"} rules={[{ required: true }]} tooltip="A name to recognize game project">
            <Input
              placeholder="Input the project name"
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

export default AddProjectModal;
