/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React, { Component } from "react";
import QueryBuilder from "./QueryBuilder";
import QuestionSide from "../components/QuestionSide";
import { connect } from "react-redux";
import {
  setIsCancelFeedbackBlockAction,
  setShowTemplateChart,
} from "metabase/redux/control";
import userCancelFeedbackUtil from "metabase/dashboard/components/utils/userCancelFeedbackUtil";
import { replace } from "react-router-redux";
import QueryTemplate from "metabase/query_builder/components/QueryTemplate";
import * as Urls from "metabase/lib/urls";
import {
  getNativeEditorCursorOffset,
  getNativeEditorSelectedText,
  getQuestion,
  getUiControls,
} from "metabase/query_builder/selectors";
import {
  getShowTemplateChart,
  getShowPreviewChart,
} from "metabase/selectors/control";
import { canAutoShowTemplateChart } from "metabase/query_builder/components/QueryTemplateUtil";
import { get } from "lodash";
import { canShowNewGuideStart } from "metabase/containers/newguide/newGuide";
import { getUser } from "metabase/home/selectors";
import QueryPreview from "metabase/query_builder/components/QueryPreview";

const mapStateToProps = state => {
  return {
    config: state.config,
    uiControls: getUiControls(state),
    showTemplateChart: getShowTemplateChart(state) || {},
    question: getQuestion(state),
    user: getUser(state),
    showPreviewChart: getShowPreviewChart(state) || {},
    nativeEditorCursorOffset: getNativeEditorCursorOffset(state),
    nativeEditorSelectedText: getNativeEditorSelectedText(state),
    ...state.qb.uiControls,
  };
};

const mapDispatchToProps = {
  setIsCancelFeedbackBlockAction,
  setShowTemplateChart,
  replace,
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Question extends Component {
  UNSAFE_componentWillMount() {
    this.props.setIsCancelFeedbackBlockAction({
      isUserFeedbackBlock: this.isCancelFeedbackBlock,
    });
  }

  isCancelFeedbackBlock = () => {
    const scene = "new-question-leave";
    return {
      isBlock:
        location.pathname === "/question" &&
        userCancelFeedbackUtil.canBlock(scene, true),
      scene,
    };
  };

  componentWillUnmount = () => {
    this.props.setIsCancelFeedbackBlockAction({
      isUserFeedbackBlock: undefined,
    });
  };

  loadTemplateData = async ({ databaseId }) => {
    if (canAutoShowTemplateChart()) {
      this.props.setShowTemplateChart({ show: true, databaseId });
    }
  };

  replaceNewQuestion = card => {
    this.props.replace(
      Urls.newQuestion({ ...card, create_method: "template" }),
    );
    this.closeQueryTemplate();
  };

  closeQueryTemplate = () => {
    this.props.setShowTemplateChart({ show: false });
  };

  UNSAFE_componentWillReceiveProps(newProps) {
    const {
      isShowingTemplateTagsEditor,
      isShowingDataReference,
      isShowingNewbModal,
      isShowingChartTypeSidebar,
      isShowingChartSettingsSidebar,
      isShowingSummarySidebar,
      // isShowingFilterSidebar,
      isShowingSnippetSidebar,
      isShowingQuestionDetailsSidebar,
      queryBuilderMode,
      showTemplateChart,
    } = newProps;
    if (
      (queryBuilderMode === "notebook" ||
        isShowingTemplateTagsEditor ||
        isShowingDataReference ||
        isShowingNewbModal ||
        isShowingChartTypeSidebar ||
        isShowingChartSettingsSidebar ||
        isShowingSummarySidebar ||
        // isShowingFilterSidebar ||
        isShowingSnippetSidebar ||
        isShowingQuestionDetailsSidebar) &&
      showTemplateChart.show
    ) {
      this.closeQueryTemplate();
    }
  }

  render() {
    const {
      location,
      params,
      config,
      showTemplateChart,
      question,
      user,
      showPreviewChart,
    } = this.props;

    const hideSide = config && config.questionSideHide;
    const isNewQuestion = !get(question, "_card.original_card_id");
    const isNative = question && question.isNative();
    const userNewGuide = canShowNewGuideStart(user);
    const showTemplate =
      showTemplateChart.show &&
      location.hash &&
      isNewQuestion &&
      !isNative &&
      !userNewGuide;
    const hasQuery = location.hash || params.slug;

    const questionSideStyle = {
      minWidth: hideSide && hasQuery ? 0 : 360,
      width: hideSide && hasQuery ? 0 : 360,
    };

    const showCustomBuilder = location.pathname.includes(
      "/chart/custom-upload",
    );

    const showSide =
      (location.hash || location.query.dbId || showCustomBuilder) && user;

    return (
      <div className="Question">
        {showSide ? (
          <div className="Question-side" style={questionSideStyle}>
            <QuestionSide closeTemplateData={() => this.closeQueryTemplate()} />
          </div>
        ) : null}
        <div className="Question-main">
          {showTemplate ? (
            <QueryTemplate
              databaseId={showTemplateChart.databaseId}
              replaceNewQuestion={this.replaceNewQuestion}
              closeAction={() => {
                this.closeQueryTemplate();
              }}
            />
          ) : null}
          <QuestionMain
            hasQuery={hasQuery}
            showCustomBuilder={showCustomBuilder}
            {...this.props}
          />
          {showPreviewChart.show && <QueryPreview {...this.props} />}
        </div>
      </div>
    );
  }
}

const QuestionMain = props => {
  const { showCustomBuilder, children, hasQuery } = props;
  if (showCustomBuilder) return children;
  if (hasQuery) {
    return <QueryBuilder {...props} />;
  }
  return null;
};
