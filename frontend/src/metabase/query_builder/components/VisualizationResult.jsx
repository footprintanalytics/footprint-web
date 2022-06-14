/* eslint "react/prop-types": "warn" */

import React, { Component } from "react";
import { t, jt } from "ttag";
import cx from "classnames";
import { connect } from "react-redux";
import ErrorMessage from "metabase/components/ErrorMessage";
import Visualization from "metabase/visualizations/components/Visualization";
import { datasetContainsNoResults } from "metabase/lib/dataset";
import { DatasetQuery } from "metabase-types/types/Card";
import { CreateAlertModalContent } from "metabase/query_builder/components/AlertModals";
import Modal from "metabase/components/Modal";
import { ALERT_TYPE_ROWS } from "metabase-lib/lib/Alert";
import StructuredQuery from "metabase-lib/lib/queries/StructuredQuery";
// import { get } from "lodash";
import { getUserClearWatermarkPermission } from "metabase/selectors/user";
import type { Question } from "metabase-lib/lib/Question";

type Props = {
  className?: string,
  question: Question,
  isObjectDetail: boolean,
  result: any,
  results: any[],
  isDirty: boolean,
  lastRunDatasetQuery: DatasetQuery,
  navigateToNewCardInsideQB: any => void,
  rawSeries: any,
  user: any,
  clearWatermark: boolean,

  onOpenChartSettings: () => void,
  onUpdateWarnings: () => void,
  onUpdateVisualizationSettings: (settings: any) => void,
  query?: StructuredQuery,
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
    clearWatermark: getUserClearWatermarkPermission(state),
  };
};

@connect(mapStateToProps)
export default class VisualizationResult extends Component {
  props: Props;
  state = {
    showCreateAlertModal: false,
  };

  showCreateAlertModal = () => {
    this.setState({ showCreateAlertModal: true });
  };

  onCloseCreateAlertModal = () => {
    this.setState({ showCreateAlertModal: false });
  };

  render() {
    const {
      question,
      isDirty,
      navigateToNewCardInsideQB,
      result,
      rawSeries,
      className,
      user,
      clearWatermark,
    } = this.props;
    const { showCreateAlertModal } = this.state;
    const isOwner = user.is_superuser || user.id === question.card().creator_id;

    const noResults = datasetContainsNoResults(result.data);
    if (noResults) {
      const supportsRowsPresentAlert = question.alertType() === ALERT_TYPE_ROWS;

      // successful query but there were 0 rows returned with the result
      return (
        <div className={cx(className, "flex")}>
          <ErrorMessage
            type="noRows"
            title={t`No results!`}
            message={t`This may be the answer you’re looking for. If not, try removing or changing your filters to make them less specific.`}
            action={
              <div>
                {supportsRowsPresentAlert && !isDirty && (
                  <p>
                    {jt`You can also ${(
                      <a className="link" onClick={this.showCreateAlertModal}>
                        {t`get an alert`}
                      </a>
                    )} when there are some results.`}
                  </p>
                )}
                <button
                  className="Button"
                  onClick={() => window.history.back()}
                >
                  {t`Back to previous results`}
                </button>
              </div>
            }
          />
          {showCreateAlertModal && (
            <Modal full onClose={this.onCloseCreateAlertModal}>
              <CreateAlertModalContent
                onCancel={this.onCloseCreateAlertModal}
                onAlertCreated={this.onCloseCreateAlertModal}
              />
            </Modal>
          )}
        </div>
      );
    } else {
      return (
        <Visualization
          className={className}
          rawSeries={rawSeries}
          onChangeCardAndRun={arg => {
            const { unAuth } = arg;
            const isOwner =
              unAuth ||
              user.is_superuser ||
              user.id === question.card().creator_id;
            isOwner && navigateToNewCardInsideQB(arg);
          }}
          clickable={isOwner}
          isEditing={true}
          isQueryBuilder={true}
          showTitle={false}
          metadata={question.metadata()}
          hideWatermark={clearWatermark}
          onOpenChartSettings={this.props.onOpenChartSettings}
          onUpdateWarnings={this.props.onUpdateWarnings}
          onUpdateVisualizationSettings={
            this.props.onUpdateVisualizationSettings
          }
          query={this.props.query}
          showDataUpdateTime={true}
        />
      );
    }
  }
}
