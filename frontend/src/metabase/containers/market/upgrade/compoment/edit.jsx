/* eslint-disable react/prop-types */
import React from "react";
import { Button, Form, Select, Input } from "antd";
import ModalContent from "metabase/components/ModalContent";
import { color } from "metabase/lib/colors";
import Modal from "metabase/components/Modal";

const EditUserUpgradeModal = props => {
  const { item, onSubmit, onClose } = props;
  const { email, type, id } = item;

  const handleChange = () => {};

  const renderTypeSelectData = () => {
    return (
      <React.Fragment>
        <Select.Option
          value="business"
          // disabled={type === "enterprise"}
        >
          business
        </Select.Option>
        {/* <Select.Option value="enterprise">enterprise</Select.Option> */}
      </React.Fragment>
    );
  };

  const isPositiveInteger = s => {
    const re = /^[0-9]+$/;
    return re.test(s);
  };

  return (
    <Modal>
      <ModalContent onClose={onClose} className="user-upgrade-model__root">
        <Form
          name="control-ref"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 24,
          }}
          initialValues={{
            email: email,
          }}
          onFinish={value => onSubmit(value, id)}
        >
          <Form.Item name="email" label="Email">
            <div>{email}</div>
          </Form.Item>
          <Form.Item name="currentType" label="CurrentType">
            <div>{type}</div>
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[
              () => ({
                validator(_, value) {
                  if (value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Must be a valid type."));
                },
              }),
            ]}
          >
            <Select
              initialValues=""
              style={{ width: 120 }}
              onChange={handleChange}
            >
              {renderTypeSelectData()}
            </Select>
          </Form.Item>
          <Form.Item
            name="days"
            label="Days"
            rules={[
              () => ({
                validator(_, value) {
                  if (value && isPositiveInteger(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Must be a valid days."));
                },
              }),
            ]}
          >
            <Input style={{ width: 120 }} />
          </Form.Item>
          <div style={{ padding: 20 }} />
          <Form.Item>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              className="right"
              style={{
                background: color("brand"),
                border: "none",
                width: "100%",
                borderRadius: 8,
              }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default EditUserUpgradeModal;
