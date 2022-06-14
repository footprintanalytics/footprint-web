/* eslint-disable react/prop-types */
import React from "react";
import Modal from "metabase/components/Modal";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import Button from "metabase/components/Button";
import "./NewGuideStartModal.css";
import { setShowNewGuideDone } from "metabase/containers/newguide/newGuide";
import ModalContent from "metabase/components/ModalContent";
import { trackStructEvent } from "metabase/lib/analytics";

const NewGuideStartModal = props => {
  const { onClose, startAction } = props;

  const steps = [
    "Select data for the chart.",
    "Filter data by the field you want.",
    "Select the aggregate function to get the metrics you want.",
    "Save the chart",
  ];

  const onCancel = () => {
    onClose && onClose();
  };

  return (
    <Modal normal dismissOnClickOutside={false} onClose={onCancel}>
      <ModalContent className="Modal-content Modal-content--small new-guide-start__modal">
        <div className="new-guide-start">
          <div className="new-guide-start__title">
            Follow these steps to create a simple chart
          </div>
          <ol className="new-guide-start__list">
            {steps.map((step, inx) => {
              return (
                <li key={step} className="new-guide-start__item">
                  <div className="new-guide-start__item-inx">{inx + 1}</div>
                  <span>{step}</span>
                </li>
              );
            })}
          </ol>
          <div className="new-guide-start__buttons">
            <Button
              className="new-guide-start__buttons-skip"
              borderless
              onClick={() => {
                setShowNewGuideDone(true);
                onCancel();
                trackStructEvent("new-guide-start click skip");
              }}
            >
              Skip
            </Button>
            <Button
              className="new-guide-start__buttons-start"
              borderless
              onClick={() => {
                startAction();
                trackStructEvent("new-guide-start click start");
              }}
            >
              {`Let's get started!`}
            </Button>
          </div>
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

export default connect(mapStateToProps, null)(NewGuideStartModal);
