/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { color } from "metabase/lib/colors";
import Utils from "metabase/lib/utils";
import Modal from "metabase/components/Modal";
import ModalContent from "metabase/components/ModalContent";
import { getUser, getUserSubscribeInfo } from "metabase/selectors/user";
import connect from "react-redux/lib/connect/connect";
import { subscribeEdit } from "metabase/new-service";
import { refreshCurrentUser, updateSubscribeInfo } from "metabase/redux/user";
import "./SubscribeModal.css";
import { trackStructEvent } from "metabase/lib/analytics";

const SubscribeModal = ({
  subscribeInfo,
  updateSubscribeInfo,
  user,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const userEmail = user && user.email;

  const isOpen = subscribeInfo.subscribeStatus === "enable";

  const onSubmit = async value => {
    trackStructEvent(`subscribe-modal click submit`);
    const apiParams = {
      subscribeStatus: isOpen ? "disable" : "enable",
      subscribeEmail: isOpen ? "" : value.subscribeEmail,
    };
    try {
      setLoading(true);
      const result = await subscribeEdit(apiParams);
      message.success(isOpen ? "Unsubscribe success." : "Subscribe success.");
      updateSubscribeInfo(result);
      onClose && onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal ModalClass="subscribe-model">
      <ModalContent onClose={onClose} className="subscribe-model__root">
        <Form
          name="control-ref"
          initialValues={{
            subscribeEmail: isOpen ? subscribeInfo.subscribeEmail : userEmail,
          }}
          layout="vertical"
          onFinish={onSubmit}
        >
          <Form.Item
            name="subscribeEmail"
            label="Subscription email"
            rules={[
              () => ({
                validator(_, value) {
                  if (Utils.validEmail(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Must be a valid email address."),
                  );
                },
              }),
            ]}
            style={{ marginBottom: 0, height: 100 }}
          >
            <Input
              placeholder="Email"
              rows={1}
              maxLength={50}
              readonly={isOpen ? "readonly" : false}
            />
          </Form.Item>
          <div className="subscribe-model__tip">
            {isOpen
              ? "You will not receive the latest news notifications after unsubscribing."
              : "You will receive the latest news notification after subscribing."}
          </div>
          <Form.Item>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              className="right"
              loading={loading}
              style={{
                background: color("brand"),
                border: "none",
                width: "100%",
                borderRadius: "4px",
              }}
            >
              {isOpen ? "Unsubscribe" : "Subscribe"}
            </Button>
          </Form.Item>
        </Form>
      </ModalContent>
    </Modal>
  );
};

const mapStateToProps = (state, props) => ({
  user: getUser(state, props),
  subscribeInfo: getUserSubscribeInfo(state, props),
});

const mapDispatchToProps = {
  refreshCurrentUser,
  updateSubscribeInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubscribeModal);
