/* eslint-disable react/prop-types */
import React from "react";
import Modal from "metabase/components/Modal";
import ModalContent from "metabase/components/ModalContent";
import { getUser } from "metabase/selectors/user";
import connect from "react-redux/lib/connect/connect";
import { refreshCurrentUser } from "metabase/redux/user";
import { Flex } from "grid-styled";
import "./ActivityZkspaceSignupSuccess.css";
import { getOssUrl } from "metabase/lib/image";
import { trackStructEvent } from "metabase/lib/analytics";
import Button from "metabase/components/Button";

const ZkspaceSignupSuccessModal = ({ onClick }) => {
  const onConfirm = value => {
    trackStructEvent(`zkspace-signup-modal click create A Chart`);
    onClick();
  };

  return (
    <Modal ModalClass="zkspace-signup-success-model">
      <ModalContent
        onClose={() => {
          trackStructEvent(`zkspace-signup-modal click close`);
          onClick();
        }}
        className="zkspace-signup-success-model__root"
      >
        <div className="zkspace-signup-success-model__logo">
          <img
            src="https://static.footprint.network/activity-zkspace/img-logo-white.png"
            alt={"img-logo"}
          />
          <span className="zkspace-signup-success-model__line" />
          <img
            src="https://static.footprint.network/activity-zkspace/img-logo-zkspace.png"
            alt={"img-logo-zkspace"}
          />
        </div>
        <Flex align="center" flexDirection="column">
          <img
            src={getOssUrl("/activity-zkspace/img-signup-success-middle.png")}
            style={{
              width: "188px",
              height: "150px",
              objectFit: "fill",
              margin: "20px 0",
            }}
            alt={""}
          />

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
