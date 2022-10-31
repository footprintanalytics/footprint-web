/* eslint-disable react/prop-types */
import React from "react";
import Modal from "metabase/components/Modal";
import ModalContent from "metabase/components/ModalContent";
import { getUser } from "metabase/selectors/user";
import connect from "react-redux/lib/connect/connect";
import { refreshCurrentUser } from "metabase/redux/user";
import { Flex } from "grid-styled";
import "./ActivityZkspaceFirstModal.css";
import { trackStructEvent } from "metabase/lib/analytics";
import Button from "metabase/components/Button";

const ActivityZkspaceFirstModal = ({ onClose, onClick }) => {
  const onConfirm = value => {
    trackStructEvent(`kcc-first-modal click to Get`);
    onClick();
  };

  const onModalClose = value => {
    trackStructEvent(`kcc-first-modal click to close`);
    onClose();
  };

  return (
    <Modal ModalClass="zkspace-first-model">
      <ModalContent
        onClose={onModalClose}
        className="zkspace-first-model__root"
      >
        <div className="zkspace-first-model__logo">
          <img
            src="https://static.footprint.network/activity/kcc/img_logo_kcc_fp.png"
            alt={"img-logo"}
          />
        </div>
        <Flex align="center" flexDirection="column">
          <div className="zkspace-first-model__title">
            {"Create Your Charts \n and Win KCC Beowulf NFT!"}
          </div>
          <span
            style={{
              color: "#ffffff",
              fontSize: "18px",
              marginTop: 10,
              fontWeight: "bold",
            }}
          >
            Time: 10:00:00 (UTC+0) on Oct. 31 to 10:00:00 (UTC+0) on Nov. 6, 2022
          </span>
          <Button
            className="zkspace-first-model__button"
            borderless
            onClick={onConfirm}
          >
            Sign in to Get
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
)(ActivityZkspaceFirstModal);
