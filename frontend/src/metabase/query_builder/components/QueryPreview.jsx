/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import "./QueryPreview.css";
import { t } from "ttag";
import { replace } from "react-router-redux";
import { withRouter } from "react-router";
import connect from "react-redux/lib/connect/connect";
import Button from "metabase/core/components/Button";
import { questionSideHideAction } from "metabase/redux/config";
import ConfirmContent from "metabase/components/ConfirmContent";
import Modal from "metabase/components/Modal";
import { compose } from "metabase/lib/redux";
import {
  closeAllChartPopoverAction,
  setShowPreviewChart,
} from "metabase/redux/control";
import NotebookStepPreview from "metabase/query_builder/components/notebook/NotebookStepPreview";
import Icon from "metabase/components/Icon";
import { getUser } from "metabase/selectors/user";
import { getShowPreviewChart } from "metabase/selectors/control";
import { updateNativeEditorSelect } from "metabase/query_builder/utils/handle";
import * as MetabaseAnalytics from "metabase/lib/analytics";
import TableDictionary from "metabase/query_builder/components/TableDictionary";
import TableBeta from "metabase/query_builder/components/TableBeta";
import Question from "metabase-lib/Question";
import NativeQuery from "metabase-lib/queries/NativeQuery";

function QueryPreview(props) {
  const {
    showPreviewChart,
    question,
    replace,
    nativeEditorCursorOffset,
    nativeEditorSelectedText,
    handleQuestionSideHide,
    closeAllChartPopoverAction,
    setShowPreviewChart,
    updateQuestion,
  } = props;

  const [confirmModal, setConfirmModal] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState();
  const query = question?.query();
  const isNative = query instanceof NativeQuery;
  const {
    originId: tableId,
    databaseId,
    description,
    name: tableName,
    databaseName,
  } = showPreviewChart.data || {};

  useEffect(() => {
    const handleQuestion = async (tableId, databaseId) => {
      const question = Question.create({ databaseId, tableId });
      const query = question.query();
      setPreviewQuestion(
        question
          .setQuery(query.limit() < 10 ? query : query.updateLimit(10))
          .setDisplay("table")
          .setSettings({ "table.pivot": false }),
      );
    };
    if (showPreviewChart.show) {
      handleQuestion(tableId, databaseId);
    }
  }, [databaseId, showPreviewChart.show, tableId]);

  const closeAction = () => {
    setShowPreviewChart({ show: false });
  };

  const hideQuestionSide = () => {
    setTimeout(() => {
      handleQuestionSideHide({ hide: true });
    }, 500);
  };

  const afterAction = () => {
    replace(Question.create({ databaseId, tableId }).getUrl());
    closeAction();
    setTimeout(() => {
      closeAllChartPopoverAction({ time: new Date().getTime() });
      hideQuestionSide();
    }, 10);
  };

  const selectAction = () => {
    MetabaseAnalytics.trackStructEvent("query-preview click select");
    if (isNative) {
      updateNativeEditorSelect({
        databaseId,
        tableName,
        columnName: null,
        query,
        question,
        nativeEditorCursorOffset,
        nativeEditorSelectedText,
        databaseName,
        updateQuestion,
      });
      setShowPreviewChart({ show: false });
      return;
    }
    if (!question.isEmpty()) {
      return setConfirmModal(true);
    }
    afterAction();
  };

  return (
    <div className="query-preview">
      <div className="query-preview__head">
        <div className="flex flex-row">
          {tableName && <div className="query-preview__title">{tableName}</div>}
          <div className="flex align-center">
            <TableBeta tableName={tableName} tableId={tableId} />
          </div>
          <TableDictionary tableName={tableName} tableId={tableId} />

          <Button
            className="query-preview__select"
            color="white"
            small
            onClick={selectAction}
          >
            Select
          </Button>
        </div>
        <div
          className="query-preview__close"
          onClick={() => {
            MetabaseAnalytics.trackStructEvent("query-preview click close");
            closeAction();
          }}
        >
          <Icon name="close" color={"black"} size={16} />
        </div>
      </div>
      {/*{description && (
        <div className="query-preview__desc">
          <span style={{ WebkitBoxOrient: "vertical" }}>{description}</span>
        </div>
      )}*/}
      <div className="query-preview__divider" />
      {previewQuestion && (
        <NotebookStepPreview
          className={"query-preview__notebook-step-preview"}
          question={previewQuestion}
          fromQueryPreview
          height={description ? 300 : 340}
          onClose={closeAction}
          isPreview={true}
        />
      )}
      <Modal isOpen={confirmModal}>
        <ConfirmContent
          title={t`You have unsaved changes`}
          message={t`Do you want to leave this page and discard your changes?`}
          onClose={() => {
            setConfirmModal(false);
          }}
          onAction={() => {
            setConfirmModal(false);
            afterAction();
          }}
        />
      </Modal>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    showPreviewChart: getShowPreviewChart(state) || {},
    user: getUser(state),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, {
    replace,
    setShowPreviewChart,
    handleQuestionSideHide: questionSideHideAction,
    closeAllChartPopoverAction,
  }),
)(QueryPreview);
