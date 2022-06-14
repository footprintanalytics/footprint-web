/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Flex } from "grid-styled";
import { Button, Form, Input, Modal } from "antd";
import { color } from "metabase/lib/colors";

const BindUserWithWalletAddressModal = ({
  onSubmit,
  onClose,
  visible,
  errorMessage,
}) => {
  const [error, setError] = useState();
  useEffect(() => {
    if (errorMessage) {
      setError(errorMessage);
    }
  }, [errorMessage]);
  return (
    <Modal
      title=""
      visible={visible}
      footer={null}
      maskClosable={false}
      onCancel={onClose}
      ModalClass="z-index-top"
    >
      <Flex flexDirection="column">
        <Form onFinish={onSubmit} layout="vertical">
          <Form.Item style={{ textAlign: "center" }} className="mt2">
            <span className=" footprint-title1" style={{ fontSize: "24px" }}>
              Merge with existing account?
            </span>
          </Form.Item>
          <Form.Item style={{ textAlign: "left" }}>
            <span className=" footprint-secondary-text1">
              If you have an existing email-based account,you may want to merge
              it with your new Ethereum-based account; this will allow you to
              see all your existing work when you sign in with Ethereum.
              <div style={{ color: "red", fontWeight: "600" }}>
                Please note: you can close this window to skip merge
                accounts,but you won`t be able to merge accounts in the future.
              </div>
            </span>
          </Form.Item>

          {error && (
            <div
              className="bg-error p1 rounded text-white text-bold text-center mb1"
              style={{ textAlign: "center" }}
            >
              {error}
            </div>
          )}
          <Form.Item
            name="Email"
            label="Email"
            style={{ marginBottom: 0, height: 80 }}
          >
            <Input
              placeholder="Email"
              rows={1}
              maxLength={50}
              onChange={() => {
                setError("");
              }}
            />
          </Form.Item>
          <Form.Item
            name="Password"
            label="Password"
            style={{ marginBottom: 0, height: 80 }}
          >
            <Input.Password
              placeholder="Enter Password"
              onChange={() => {
                setError("");
              }}
            />
          </Form.Item>
          <Form.Item style={{ textAlign: "center" }}>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              className="right"
              style={{
                background: color("brand"),
                border: "none",
                width: "100%",
              }}
            >
              Sign in and Merge
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </Modal>
  );
};

export default BindUserWithWalletAddressModal;
