/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

import { t } from "ttag";
import _ from "underscore";

import { MODAL_TYPES } from "metabase/query_builder/constants";

import Modal from "metabase/components/Modal";

import SaveQuestionModal from "metabase/containers/SaveQuestionModal";
import QuestionSavedModal from "metabase/components/QuestionSavedModal";
import AddToDashSelectDashModal from "metabase/containers/AddToDashSelectDashModal";
import EditQuestionInfoModal from "metabase/query_builder/components/view/EditQuestionInfoModal";

import CollectionMoveModal from "metabase/containers/CollectionMoveModal";
import ArchiveQuestionModal from "metabase/query_builder/containers/ArchiveQuestionModal";

import QuestionHistoryModal from "metabase/query_builder/containers/QuestionHistoryModal";
import { CreateAlertModalContent } from "metabase/query_builder/components/AlertModals";
import EntityCopyModal from "metabase/entities/containers/EntityCopyModal";
import Questions from "metabase/entities/questions";
import ShareModal from "metabase/containers/home/components/ShareModal";
import { copyCard } from "metabase/new-service";
import * as Urls from "metabase/lib/urls";
import { getPersonalCollectionId } from "metabase/lib/collection";
import NeedPermissionModal from "metabase/components/NeedPermissionModal";
import { getProject } from "metabase/lib/project_info";

export default class QueryModals extends React.Component {
  state = {
    showVip: false,
  };

  showAlertsAfterQuestionSaved = () => {
    const { questionAlerts, user, onCloseModal, onOpenModal } = this.props;

    const hasAlertsCreatedByCurrentUser = _.any(
      questionAlerts,
      alert => alert.creator.id === user.id,
    );

    if (hasAlertsCreatedByCurrentUser) {
      // TODO Atte Keinänen 11/10/17: The question was replaced and there is already an alert created by current user.
      // Should we show pop up the alerts list in this case or do nothing (as we do currently)?
      onCloseModal();
    } else {
      // HACK: in a timeout because save modal closes itself
      setTimeout(() => onOpenModal(MODAL_TYPES.CREATE_ALERT));
    }
  };

  onAfterChangePublicUuid = ({ newUuid }) => {
    this.props.card.public_uuid = newUuid;
  };

  render() {
    const {
      modal,
      question,
      onCloseModal,
      onOpenModal,
      user,
      onlyEmbed,
    } = this.props;
    const publicAnalyticPermission = user && user.publicAnalytic === "write";
    return (
      <>
        {modal === MODAL_TYPES.SAVE ? (
          <Modal form onClose={onCloseModal}>
            <SaveQuestionModal
              card={this.props.card}
              user={user}
              originalCard={this.props.originalCard}
              tableMetadata={this.props.tableMetadata}
              initialCollectionId={this.props.initialCollectionId}
              onSave={async card => {
                // if saving modified question, don't show "add to dashboard" modal
                await this.props.onSave(card);
                onCloseModal();
              }}
              onCreate={async card => {
                const res = await this.props.onCreate(card);
                onOpenModal(MODAL_TYPES.SAVED);
                return res;
              }}
              onClose={onCloseModal}
            />
          </Modal>
        ) : modal === MODAL_TYPES.SAVED ? (
          <Modal normal onClose={onCloseModal}>
            <QuestionSavedModal
              onClose={onCloseModal}
              addToDashboardFn={() => {
                onOpenModal(MODAL_TYPES.ADD_TO_DASHBOARD);
              }}
              showShareModal={() => {
                onOpenModal("embed");
              }}
            />
          </Modal>
        ) : modal === MODAL_TYPES.ADD_TO_DASHBOARD_SAVE ? (
          <Modal onClose={onCloseModal}>
            <SaveQuestionModal
              card={this.props.card}
              user={user}
              originalCard={this.props.originalCard}
              tableMetadata={this.props.tableMetadata}
              initialCollectionId={this.props.initialCollectionId}
              onSave={async card => {
                await this.props.onSave(card);
                onOpenModal(MODAL_TYPES.ADD_TO_DASHBOARD);
              }}
              onCreate={async card => {
                const res = await this.props.onCreate(card);
                onOpenModal(MODAL_TYPES.ADD_TO_DASHBOARD);
                return res;
              }}
              onClose={onCloseModal}
              multiStep
            />
          </Modal>
        ) : modal === MODAL_TYPES.ADD_TO_DASHBOARD ? (
          <Modal onClose={onCloseModal}>
            <AddToDashSelectDashModal
              card={this.props.card}
              onClose={onCloseModal}
              onChangeLocation={this.props.onChangeLocation}
            />
          </Modal>
        ) : modal === MODAL_TYPES.CREATE_ALERT ? (
          <Modal full onClose={onCloseModal}>
            <CreateAlertModalContent
              onCancel={onCloseModal}
              onAlertCreated={onCloseModal}
            />
          </Modal>
        ) : modal === MODAL_TYPES.SAVE_QUESTION_BEFORE_ALERT ? (
          <Modal onClose={onCloseModal}>
            <SaveQuestionModal
              card={this.props.card}
              user={user}
              originalCard={this.props.originalCard}
              tableMetadata={this.props.tableMetadata}
              onSave={async card => {
                await this.props.onSave(card, false);
                this.showAlertsAfterQuestionSaved();
              }}
              onCreate={async card => {
                const res = await this.props.onCreate(card, false);
                this.showAlertsAfterQuestionSaved();
                return res;
              }}
              onClose={onCloseModal}
              multiStep
              initialCollectionId={this.props.initialCollectionId}
            />
          </Modal>
        ) : modal === MODAL_TYPES.SAVE_QUESTION_BEFORE_EMBED ? (
          <Modal onClose={onCloseModal}>
            <SaveQuestionModal
              card={this.props.card}
              user={user}
              originalCard={this.props.originalCard}
              tableMetadata={this.props.tableMetadata}
              onSave={async card => {
                await this.props.onSave(card, false);
                onOpenModal(MODAL_TYPES.EMBED);
              }}
              onCreate={async card => {
                const res = await this.props.onCreate(card, false);
                onOpenModal(MODAL_TYPES.EMBED);
                return res;
              }}
              onClose={onCloseModal}
              multiStep
              initialCollectionId={this.props.initialCollectionId}
            />
          </Modal>
        ) : modal === MODAL_TYPES.HISTORY ? (
          <Modal onClose={onCloseModal}>
            <QuestionHistoryModal
              questionId={this.props.card.id}
              onClose={onCloseModal}
              onReverted={() => {
                this.props.reloadCard();
                onCloseModal();
              }}
            />
          </Modal>
        ) : modal === MODAL_TYPES.MOVE ? (
          <Modal onClose={onCloseModal}>
            <CollectionMoveModal
              title={t`Which collection should this be in?`}
              initialCollectionId={getPersonalCollectionId(user)}
              onClose={onCloseModal}
              onMove={collection => {
                const card = question
                  .setCollectionId(collection && collection.id)
                  .card();

                this.props.onSave(card);
                onCloseModal();
              }}
            />
          </Modal>
        ) : modal === MODAL_TYPES.ARCHIVE ? (
          <Modal onClose={onCloseModal}>
            <ArchiveQuestionModal question={question} onClose={onCloseModal} />
          </Modal>
        ) : modal === MODAL_TYPES.EDIT ? (
          <Modal onClose={onCloseModal}>
            <EditQuestionInfoModal
              question={question}
              publicAnalyticPermission={publicAnalyticPermission}
              onClose={onCloseModal}
              onSave={card => this.props.onSave(card, false)}
            />
          </Modal>
        ) : modal ===
          MODAL_TYPES.EMBED /*{" "}
        <Modal full onClose={onCloseModal}>
          <QuestionEmbedWidget card={this.props.card} onClose={onCloseModal} />
        </Modal>
        */ ? (
          <ShareModal
            resource={{
              open: true,
              public_uuid: this.props.card.public_uuid,
              type: "card",
              name: this.props.card.name,
              id: this.props.card.id,
              creatorId: this.props.card.creator_id,
              onlyEmbed,
            }}
            onAfterChangePublicUuid={this.onAfterChangePublicUuid}
            onClose={onCloseModal}
          />
        ) : modal === MODAL_TYPES.CLONE ? (
          <Modal onClose={onCloseModal}>
            <EntityCopyModal
              entityType="questions"
              entityObject={{
                ...this.props.card,
                collection_id: getPersonalCollectionId(user),
              }}
              form={
                publicAnalyticPermission
                  ? Questions.forms.details
                  : Questions.forms.details_without_collection
              }
              copy={async formValues => {
                const { canCreate } = this.props;
                if (!canCreate) {
                  this.setState({ showVip: true });
                  return;
                }
                const cardId = this.props.card.id;
                const params = {
                  collection_position: null,
                  ...formValues,
                  description: formValues.description || null,
                };
                if (user && !publicAnalyticPermission) {
                  params.collection_id = getPersonalCollectionId(user);
                }
                const data = await copyCard({
                  cardId: cardId,
                  params: { ...params, project: getProject() },
                });
                this.props.reloadUserVip();
                return { payload: { object: data } };
              }}
              onClose={onCloseModal}
              onSaved={async card => {
                if (card.id) {
                  this.props.onChangeLocation(Urls.question(card));
                } else {
                  throw card;
                }
                onCloseModal && onCloseModal();
              }}
            />
          </Modal>
        ) : null}
        {this.state.showVip && (
          <NeedPermissionModal
            title="Your account has reached the limit of number of query, please upgrade the account to unlock more"
            onClose={() => this.setState({ showVip: false })}
          />
        )}
      </>
    );
  }
}
