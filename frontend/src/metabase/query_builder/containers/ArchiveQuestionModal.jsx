/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { t } from "ttag";

import ArchiveModal from "metabase/components/ArchiveModal";

// import * as Urls from "metabase/lib/urls";
import Questions from "metabase/entities/questions";

const mapDispatchToProps = {
  archive: id => Questions.actions.setArchived({ id }, true),
};

class ArchiveQuestionModal extends Component {
  onArchive = () => {
    const {
      cardId,
      question,
      archive,
      router,
      otherSuccessAction,
    } = this.props;
    if (cardId) {
      archive(cardId);
    } else {
      const card = question.card();
      archive(card.id);
    }
    // router.push(Urls.collection(card.collection));
    router.push("/mine");

    otherSuccessAction && otherSuccessAction();
  };

  render() {
    const { onClose } = this.props;
    return (
      <ArchiveModal
        title={t`Delete this chart?`}
        message={t`This chart will be removed from any dashboards or pulses using it.`}
        onArchive={this.onArchive}
        onClose={onClose}
      />
    );
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(withRouter(ArchiveQuestionModal));
