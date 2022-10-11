/* eslint-disable react/prop-types */
import React from "react";
import Modal from "metabase/components/Modal";
import ModalContent from "metabase/components/ModalContent";
import { getUser } from "metabase/selectors/user";
import connect from "react-redux/lib/connect/connect";
import { refreshCurrentUser } from "metabase/redux/user";
import { Flex } from "grid-styled";
import "./ActivityZkspaceSignupSuccess.css";
import { trackStructEvent } from "metabase/lib/analytics";
import Button from "metabase/components/Button";

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
        <Flex align="center" flexDirection="column">
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
        </Flex>
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
