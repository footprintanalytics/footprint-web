/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import { loadFgaProjectList } from "metabase/redux/control";

const BuyModal = props => {
  const { open, onCancel, onFinish, router, location, user, force, loadFgaProjectList } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (open) {
      const email = user && user.email.endsWith("footprint.network") && user.email.length === 60 ? "" : (user?.email || "")
      form.setFieldsValue({
        email: email,
      })
    } else {
    }
  }, [open]);
  return (
    <Modal
      title=""
      open={open}
      destroyOnClose
      footer={null}
      width={500}
      closable={!force}
      maskClosable={!force}
      // onOk={handleOk}
      onCancel={onCancel}
    >
      <div className="flex flex-col justify-center">
        <h2 className="text-centered">Thank you for choosing Footprint!</h2>
        <span className="mt2">We have received your requirements. Please leave your email or Telegram contact information, and our dedicated solution architect will reach out to you shortly.</span>
      </div>
      <Form
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 18,
        }}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        className="p4"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            () => ({
              required: true,
              validator(_, value) {
                if (
                  !/^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
                ) {
                  return Promise.reject(
                    new Error("Please input a valid email address"),
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input placeholder="Your email. e.g. yourname@example.com"/>
        </Form.Item>
        <Form.Item
          name="telegram"
          label="Telegram"
        >
          <Input placeholder="Username or phone number"/>
        </Form.Item>
        <Form.Item>
          <div className="flex justify-end mt4">
            <Button type="primary" htmlType="submit" style={{ width: 200, height: 40 }}>
              Submit
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

const mapDispatchToProps = {
  loadFgaProjectList: loadFgaProjectList,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BuyModal));
