/* eslint-disable react/prop-types */
import React from "react";
import connect from "react-redux/lib/connect/connect";
import { push } from "react-router-redux";
import Modal from "metabase/components/Modal";
import ModalContent from "metabase/components/ModalContent";
import { getUser } from "metabase/selectors/user";
import { refreshCurrentUser } from "metabase/redux/user";
import "./ActivityZkspaceSubmitModal.css";
import { trackStructEvent } from "metabase/lib/analytics";
import { getOssUrl } from "metabase/lib/image";
import Button from "metabase/core/components/Button";

const ActivityZkspaceSubmitModal = ({ onClose, onChangeLocation, onClick }) => {
  const onModalClose = value => {
    trackStructEvent(`kcc-submit-modal click close`);
    onClose();
  };

  /*  const onSubmit = async data => {
    trackStructEvent(`kcc-submit-modal click submit`);
    const hide = message.loading("Loading...", 0);
    try {
      const { isExist } = await zkspaceCreateUserAddress(data);
      if (isExist) {
        message.info("You have already submitted an address")
      }
      onClose();
    } finally {
      hide();
    }
  };*/

  return (
    <Modal ModalClass="zkspace-submit-model">
      <ModalContent
        onClose={onModalClose}
        className="zkspace-submit-model__root"
      >
        <div className="zkspace-submit-model__logo">
          <img
            src="https://static.footprint.network/activity/kcc/img_logo_kcc_fp.png"
            alt={"img-logo"}
          />
        </div>
        <div className="flex flex-column align-center">
          <img
            src={getOssUrl("/activity/kcc/img_gold_success.png")}
            style={{
              width: "212px",
              height: "178px",
              objectFit: "fill",
              margin: "10px 0",
            }}
            alt={""}
          />
          <div className={"zkspace-submit-model__title"}>Congratulations!</div>
          <div className={"zkspace-submit-model__desc"}>Task Completed!</div>
          <div className={"zkspace-submit-model__tip"}>
            Submit your address and you will get NFT soon!
          </div>
          <Button
            className="zkspace-submit-model__button"
            borderless
            onClick={() => {
              trackStructEvent(`kcc-submit-modal click Submit`);
              onChangeLocation("/kcc");
              onClose();
            }}
          >
            Submit
          </Button>
          {/*<Form onFinish={onSubmit}>
            <Form.Item
              name="userAddress"
              rules={[
                () => ({
                  validator(_, value) {
                    if (value && value.trim().length === 42) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Please input 42-bit length Ethereum wallet address."));
                  },
                }),
              ]}
            >
              <Input className="zkspace-submit-model__address" maxLength={42} />
            </Form.Item>
            <div style={{ textAlign: "center" }}>
              <Button
                className="zkspace-submit-model__button"
                borderless
              >
                Submit your address now
              </Button>
            </div>
          </Form>*/}
        </div>
      </ModalContent>
    </Modal>
  );
};

const mapStateToProps = (state, props) => ({
  user: getUser(state, props),
});

const mapDispatchToProps = {
  refreshCurrentUser,
  onChangeLocation: push,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActivityZkspaceSubmitModal);
