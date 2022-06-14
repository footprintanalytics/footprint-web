/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";

import { CSSTransitionGroup } from "react-transition-group";

import Form, { FormField, FormFooter } from "metabase/containers/Form";
import ModalContent from "metabase/components/ModalContent";
import Radio from "metabase/components/Radio";

import * as Q_DEPRECATED from "metabase/lib/query";
import { generateQueryDescription } from "metabase/lib/query/description";

import validate from "metabase/lib/validate";

import { t } from "ttag";

import "./SaveQuestionModal.css";
import { createThumb } from "metabase/dashboard/components/utils/thumb";
import { formatDashboardChartSaveTitle } from "metabase/lib/formatting";
import { get } from "lodash";
import { getPersonalCollectionId } from "metabase/lib/collection";
import {
  canShowNewGuideStart,
  setShowNewGuideDone,
} from "metabase/containers/newguide/newGuide";
import { assocIn } from "icepick";

export default class SaveQuestionModal extends Component {
  static propTypes = {
    card: PropTypes.object.isRequired,
    originalCard: PropTypes.object,
    tableMetadata: PropTypes.object, // can't be required, sometimes null
    onCreate: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    multiStep: PropTypes.bool,
    user: PropTypes.object,
  };

  validateName = (name, context) => {
    if (context.form.saveType.value !== "overwrite") {
      // We don't care if the form is valid when overwrite mode is enabled,
      // as original question's data will be submitted instead of the form values
      return validate.required()(name);
    }
  };

  handleSubmit = async details => {
    // TODO Atte Keinäenn 31/1/18 Refactor this
    // I think that the primary change should be that
    // SaveQuestionModal uses Question objects instead of directly modifying card objects –
    // but that is something that doesn't need to be done first)
    // question
    //     .setDisplayName(details.name.trim())
    //     .setDescription(details.description ? details.description.trim() : null)
    //     .setCollectionId(details.collection_id)
    let { card, originalCard, onCreate, onSave, user } = this.props;

    const publicAnalyticPermission = user && user.publicAnalytic === "write";
    const collectionId = !publicAnalyticPermission
      ? getPersonalCollectionId(user)
      : details.saveType === "overwrite"
      ? originalCard.collection_id
      : details.collection_id;

    card = {
      ...card,
      name:
        details.saveType === "overwrite"
          ? originalCard.name
          : details.name.trim(),
      // since description is optional, it can be null, so check for a description before trimming it
      description:
        details.saveType === "overwrite"
          ? originalCard.description
          : details.description
          ? details.description.trim()
          : null,
      collection_id: collectionId,
    };

    // graph.y_axis.auto_split always default to false;
    if (
      details.saveType === "create" &&
      !("graph.y_axis.auto_split" in card?.visualization_settings) &&
      card?.create_method !== "preview"
    ) {
      card = assocIn(
        card,
        ["visualization_settings", "graph.y_axis.auto_split"],
        false,
      );
    }

    if (details.saveType === "create") {
      const res = await onCreate({
        ...card,
        create_method: canShowNewGuideStart(user)
          ? "new_guide"
          : card?.create_method,
      });
      setShowNewGuideDone(true);
      await this.thumb({ id: res.id, public_uuid: res.public_uuid });
    } else if (details.saveType === "overwrite") {
      card.id = this.props.originalCard.id;
      await this.thumb({ id: card.id, public_uuid: card.public_uuid });
      await onSave(card);
    }
  };

  async thumb({ id, public_uuid }) {
    if (!id || !public_uuid) {
      return;
    }
    await createThumb({
      elementId: "#html2canvas-Card",
      fileName: `card/${id}.png`,
      type: "chart",
      publicUuid: public_uuid,
      captureElementHeight: "630px",
      cssAdjustments: [
        {
          selector: "#html2canvas-Dashboard",
          css: "height: 630px",
        },
        {
          selector: "#html2canvas-Card",
          css: "width: 1200px",
        },
      ],
    });
  }

  render() {
    const {
      card,
      originalCard,
      initialCollectionId,
      tableMetadata,
      user,
    } = this.props;

    const isStructured = Q_DEPRECATED.isStructured(card.dataset_query);
    const create_method = get(card, "create_method");

    const initialName =
      card.name || isStructured
        ? generateQueryDescription(tableMetadata, card.dataset_query.query)
        : "";

    const initialValues = {
      name:
        create_method === "template"
          ? `${card.name} - Template`
          : create_method === "preview"
          ? `${card.name} - Preview`
          : initialName,
      description: card.description || "",
      collection_id:
        card.collection_id === undefined
          ? initialCollectionId
          : card.collection_id,
      saveType: originalCard ? "overwrite" : "create",
    };

    const title = this.props.multiStep
      ? t`First, save your chart`
      : t`Save chart`;

    const showSaveType = !card.id && !!originalCard;

    const publicAnalyticPermission = user && user.publicAnalytic === "write";

    return (
      <ModalContent
        id="SaveQuestionModal"
        title={title}
        onClose={this.props.onClose}
      >
        <Form
          initialValues={initialValues}
          fields={[
            { name: "saveType" },
            {
              name: "name",
              validate: this.validateName,
            },
            { name: "description" },
            { name: "collection_id" },
          ]}
          onSubmit={this.handleSubmit}
          overwriteOnInitialValuesChange
        >
          {({ values, Form }) => (
            <Form>
              <FormField
                name="saveType"
                title={t`Replace or save as new?`}
                type={SaveTypeInput}
                hidden={!showSaveType}
                originalCard={originalCard}
              />
              <CSSTransitionGroup
                transitionName="saveQuestionModalFields"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}
              >
                {values.saveType === "create" && (
                  <div className="saveQuestionModalFields">
                    <FormField
                      autoFocus
                      name="name"
                      title={t`Name`}
                      placeholder={t`What is the name of your card?`}
                      normalize={name => formatDashboardChartSaveTitle(name)}
                    />
                    <FormField
                      name="description"
                      type="text"
                      title={t`Description`}
                      placeholder={t`It's optional but oh, so helpful`}
                    />
                    {publicAnalyticPermission ? (
                      <FormField
                        name="collection_id"
                        title={t`Which collection should this go in?`}
                        type="collection"
                      />
                    ) : null}
                  </div>
                )}
              </CSSTransitionGroup>
              <FormFooter submitTitle={t`Save`} onCancel={this.props.onClose} />
            </Form>
          )}
        </Form>
      </ModalContent>
    );
  }
}

const SaveTypeInput = ({ field, originalCard }) => (
  <Radio
    {...field}
    options={[
      {
        name: t`Replace original chart, "${originalCard && originalCard.name}"`,
        value: "overwrite",
      },
      { name: t`Save as new chart`, value: "create" },
    ]}
    vertical
  />
);
