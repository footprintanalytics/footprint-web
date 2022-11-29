/* eslint-disable react/prop-types */
import React from "react";
import connect from "react-redux/lib/connect/connect";
import Modal from "metabase/components/Modal";
import ModalContent from "metabase/components/ModalContent";
import { getUser } from "metabase/selectors/user";
import { refreshCurrentUser } from "metabase/redux/user";
import "./ActivityZkspaceSignupSuccess.css";
import { trackStructEvent } from "metabase/lib/analytics";
import Button from "metabase/core/components/Button";

const ZkspaceSignupSuccessModal = ({ onClick }) => {
  const onConfirm = value => {
    trackStructEvent(`kcc-signup-modal click create A Chart`);
    onClick();
  };

  return (
    <Modal ModalClass="zkspace-signup-success-model">
      <ModalContent
        onClose={() => {
          trackStructEvent(`kcc-signup-modal click close`);
          onClick();
        }}
        className="zkspace-signup-success-model__root"
      >
        <div className="zkspace-signup-success-model__logo">
          <img
            src="https://static.footprint.network/activity/kcc/img_logo_kcc_fp.png"
            alt={"img-logo"}
          />
        </div>
        <div className="flex flex-column align-center">
          <div className={"zkspace-signup-success-model__title"}>
            One Step Closer to Winning NFT!
          </div>
          <Button
            className="zkspace-signup-success-model__button"
            borderless
            onClick={onConfirm}
          >
            {"Create A Chart Now >"}
          </Button>
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ZkspaceSignupSuccessModal);
