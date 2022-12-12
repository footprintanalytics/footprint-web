/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { t } from "ttag";

import ArchiveModal from "metabase/components/ArchiveModal";

import * as Urls from "metabase/lib/urls";
import Questions from "metabase/entities/questions";
import { getUser } from "metabase/selectors/user";


const mapStateToProps = state => ({
  user: getUser(state),
});

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
      user,
    } = this.props;
    if (cardId) {
      archive(cardId);
    } else {
      const card = question.card();
      archive(card.id);
    }
    otherSuccessAction && otherSuccessAction();
    router.replace(`/@${user.name}?model=card`);
  };

  render() {
    const { onClose, question } = this.props;

    const isModel = question.isDataset();

    const title = isModel ? t`Archive this model?` : t`Archive this chart?`;

    const message = isModel
      ? t`This model will be removed from any dashboards or pulses using it.`
      : t`This chart will be removed from any dashboards or pulses using it.`;

    return (
      <ArchiveModal
        title={title}
        message={message}
        onArchive={this.onArchive}
        onClose={onClose}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(ArchiveQuestionModal));
