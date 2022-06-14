import React, { Component } from "react";
import PropTypes from "prop-types";

import ModalContent from "metabase/components/ModalContent";
import "./QuestionSavedModal.css";
import { trackStructEvent } from "metabase/lib/analytics";

export default class QuestionSavedModal extends Component {
  static propTypes = {
    addToDashboardFn: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    showShareModal: PropTypes.func.isRequired,
    saveType: PropTypes.string,
  };

  render() {
    const isDashboard = this.props.saveType === "dashboard";

    return (
      <ModalContent
        id="QuestionSavedModal"
        onClose={() => {
          this.props.onClose && this.props.onClose();
          trackStructEvent("question-save-modal click close");
        }}
        className="Modal-content Modal-content--small question-save-modal"
      >
        <div className="question-save-modal__title">
          {isDashboard
            ? "Share your dashboard now"
            : "Share or add the chart to your dashboard"}
        </div>
        <div className="question-save-modal__content">
          Your {isDashboard ? "dashboard" : "chart"} has been generated, we’ve
          saved it to your {isDashboard ? "dashboard" : "chart"} list.
        </div>
        <div className="question-save-modal__buttons">
          <button
            className="Button question-save-modal__share"
            onClick={() => {
              this.props.showShareModal && this.props.showShareModal();
              trackStructEvent("question-save-modal click share");
            }}
          >
            Share {isDashboard ? "dashboard" : "chart"}
          </button>
          {!isDashboard && (
            <button
              className="Button question-save-modal__add-dashboard"
              onClick={() => {
                this.props.addToDashboardFn && this.props.addToDashboardFn();
                trackStructEvent("question-save-modal click add-dashboard");
              }}
            >
              Add to dashboard
            </button>
          )}
        </div>
      </ModalContent>
    );
  }
}
