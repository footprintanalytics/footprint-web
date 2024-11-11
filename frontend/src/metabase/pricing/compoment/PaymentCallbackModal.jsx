/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React from "react";
import Modal from "metabase/components/Modal";
import ModalContent from "metabase/components/ModalContent";
import "./PaymentModal.css";
import { Typography, Button } from "antd";

const PaymentCallbackModal = ({ onClose, isModal, onCompletedClick, open }) => {
  const renderContent = () => {
    return (
      <div className="flex flex-column">
        <div className="payment-model__title">
          Your transaction has started
          <br />
          another window...
        </div>
        <p className="payment-model__desc">
          After the transaction is completed, click the button below to look up
          the transaction is successful.
          <br />
          <br />
          If you have any questions, please{" "}
          <Typography.Link
            href="https://t.me/joinchat/4-ocuURAr2thODFh"
            target="_blank"
            rel="nofollow"
            underline
          >
            contact us
          </Typography.Link>
          .
        </p>
        <div className="payment-model__pay-button">
          <Button
            type="primary"
            size="large"
            onClick={() => {
              if (onCompletedClick) {
                onCompletedClick();
              } else {
                window.location.reload()
              }
            }}
          >
            I have completed the payment
          </Button>
        </div>
      </div>
    )
  }

  if (!isModal) {
    return renderContent();
  }

  if (!open) {
    return null
  }

  return (
    <Modal ModalClass="payment-model payment-callback-model" >
      <ModalContent
        onClose={onClose}
        className="payment-model__root"
        formModal={false}
      >
        {renderContent()}
      </ModalContent>
    </Modal>
  );
};

export default PaymentCallbackModal;
