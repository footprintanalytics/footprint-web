/* eslint-disable react/prop-types */
import React from "react";
import Modal from "metabase/components/Modal";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import "./SubmitModal.css";
import ModalContent from "metabase/components/ModalContent";
import { Button, Form, Input, message } from "antd";
import { trackStructEvent } from "metabase/lib/analytics";
import {
  userinfoProfile,
  zkspaceCreateUserAddress,
} from "metabase/new-service";

const SubmitModal = props => {
  const { onClose, successAction } = props;

  const onCancel = () => {
    onClose && onClose();
  };

  const onSubmit = async data => {
    console.log("onSubmit", data);
    trackStructEvent(`nft-activity-submit-modal click submit`);
    if (!data.userAddress || data.userAddress.trim().length !== 42) {
      message.info("Please input 42-bit length Ethereum address.");
      return;
    }
    const hide = message.loading("Loading...", 0);
    try {
      const {
        userIdIsExist,
        userAddressIsExist,
      } = await zkspaceCreateUserAddress({ ...data, type: "nftOnePage" });
      if (userIdIsExist) {
        message.info("You have already submitted an address");
        // setShowZkspaceSubmitAddr(email);
        // setHadSubmitAddress(true);
      } else if (userAddressIsExist) {
        message.info(
          "This address has already been submitted, please fill in another address",
        );
      } else {
        trackStructEvent(`zkspace-landing click submit success`);
        // setShowZkspaceSubmitAddr(email);
        // setHadSubmitAddress(true);
        message.info("You submit success");
        if (data.twitter || data.telegram || data.discord) {
          await userinfoProfile({
            twitter: data.twitter,
            telegram: data.telegram,
            discord: data.discord,
          });
        }
        successAction && successAction();
      }
    } finally {
      hide();
    }
  };
  return (
    <Modal className="nft-activity-submit__modal" dismissOnClickOutside={false}>
      <ModalContent
        className="Modal-content Modal-content--small"
        onClose={onCancel}
        closeClassName="nft-activity-submit__modal-close"
      >
        <div className="nft-activity-submit__modal-container">
          <h1>Moon Men</h1>
          <h2>Submit your information to win NFT</h2>
          <Form name="control-ref" layout="vertical" onFinish={onSubmit}>
            <Form.Item
              className="nft-activity-submit__modal-container-item"
              name="userAddress"
              label="Ethereum wallet address*"
            >
              <Input placeholder="Address" rows={1} maxLength={42} />
            </Form.Item>
            <Form.Item
              className="nft-activity-submit__modal-container-item"
              name="twitter"
              label="Twitter*"
            >
              <Input
                placeholder="@Footprint_Data or https://twitter.com/Footprint_Data"
                rows={1}
                maxLength={100}
              />
            </Form.Item>
            <Form.Item
              className="nft-activity-submit__modal-container-item"
              name="discord"
              label="Discord*"
            >
              <Input
                placeholder="@FootprintOfficial#5374 or https://discord.gg/3HYaR6USM7"
                rows={1}
                maxLength={100}
              />
            </Form.Item>
            <Form.Item
              className="nft-activity-submit__modal-container-item"
              name="telegram"
              label="Telegram*"
            >
              <Input
                placeholder="@FootprintAnalytics or https://t.me/joinchat/4-ocuURAr2thODFh"
                rows={1}
                maxLength={100}
              />
            </Form.Item>
            <h4>The information will be synchronised in your profile</h4>
            <Form.Item>
              <Button
                className="nft-activity-submit__modal-container-button"
                type="primary"
                size="large"
                htmlType="submit"
              >
                {"Submit"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </ModalContent>
    </Modal>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state, props),
  };
};

export default connect(mapStateToProps, null)(SubmitModal);
