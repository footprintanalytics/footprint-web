/* eslint-disable react/prop-types */
import React from "react";
// import { t } from "ttag";
import { connect } from "react-redux";
import cx from "classnames";

import ExplicitSize from "metabase/components/ExplicitSize";
import Popover from "metabase/components/Popover";
import DebouncedFrame from "metabase/components/DebouncedFrame";
// import Subhead from "metabase/components/type/Subhead";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper";

import NativeQueryEditor from "../NativeQueryEditor";
import QueryVisualization from "../QueryVisualization";
import DataReference from "../dataref/DataReference";
import TagEditorSidebar from "../template_tags/TagEditorSidebar";
import SnippetSidebar from "../template_tags/SnippetSidebar";
import SavedQuestionIntroModal from "../SavedQuestionIntroModal";

import AggregationPopover from "../AggregationPopover";
import BreakoutPopover from "../BreakoutPopover";

import QueryModals from "../QueryModals";
import { ViewSubHeader, ViewTitleHeader } from "./ViewHeader";
import NewQuestionHeader from "./NewQuestionHeader";
import ViewFooter from "./ViewFooter";
import ViewSidebar from "./ViewSidebar";
// import QuestionDataSelector from "./QuestionDataSelector";
import SummarizeSidebar from "./sidebars/SummarizeSidebar";
import FilterSidebar from "./sidebars/FilterSidebar";
import QuestionDetailsSidebar from "./sidebars/QuestionDetailsSidebar";

import { Motion, spring } from "react-motion";

import NativeQuery from "metabase-lib/lib/queries/NativeQuery";
import StructuredQuery from "metabase-lib/lib/queries/StructuredQuery";
// import moment from "moment";
import TagsPanel from "metabase/query_builder/components/view/TagsPanel";
import QuestionEmpty from "metabase/query_builder/containers/QuestionEmpty";
import { questionSideHideAction } from "metabase/redux/config";

import "./View.css";

import QueryViewNotebook from "./View/QueryViewNotebook";
import { deserializeCardFromUrl } from "metabase/lib/card";
import { get } from "lodash";
import ChartTypeSidebarRoot from "metabase/query_builder/components/view/sidebars/ChartTypeSidebarRoot";
import { getUserNativeQueryPermission } from "metabase/selectors/user";
import { setNewGuideInfo } from "metabase/redux/control";
import { getNewGuideInfo } from "metabase/selectors/control";
import { canShowNewGuideStart } from "metabase/containers/newguide/newGuide";
import { snapshot } from "metabase/dashboard/components/utils/snapshot";

const DEFAULT_POPOVER_STATE = {
  aggregationIndex: null,
  aggregationPopoverTarget: null,
  breakoutIndex: null,
  breakoutPopoverTarget: null,
};
const mapStateToProps = state => {
  return {
    user: state.currentUser,
    config: state.config,
    canNativeQuery: getUserNativeQueryPermission(state),
    getNewGuideInfo: getNewGuideInfo(state),
  };
};

@ExplicitSize()
@connect(mapStateToProps, { questionSideHideAction, setNewGuideInfo })
export default class View extends React.Component {
  state = {
    ...DEFAULT_POPOVER_STATE,
  };

  handleAddSeries = e => {
    this.setState({
      ...DEFAULT_POPOVER_STATE,
      aggregationPopoverTarget: e.target,
    });
  };
  handleEditSeries = (e, index) => {
    this.setState({
      ...DEFAULT_POPOVER_STATE,
      aggregationPopoverTarget: e.target,
      aggregationIndex: index,
    });
  };
  handleRemoveSeries = (e, index) => {
    const { query } = this.props;
    query.removeAggregation(index).update(null, { run: true });
  };
  handleEditBreakout = (e, index) => {
    this.setState({
      ...DEFAULT_POPOVER_STATE,
      breakoutPopoverTarget: e.target,
      breakoutIndex: index,
    });
  };
  handleClosePopover = () => {
    this.setState({
      ...DEFAULT_POPOVER_STATE,
    });
  };

  createRightSideBar = () => {
    const {
      question,
      query,
      isResultDirty,
      runQuestionQuery,
      isShowingTemplateTagsEditor,
      isShowingDataReference,
      isShowingChartTypeSidebar,
      isShowingChartSettingsSidebar,
      isShowingSummarySidebar,
      isShowingFilterSidebar,
      isShowingSnippetSidebar,
      isShowingQuestionDetailsSidebar,
      user,
      onOpenModal,
      getNewGuideInfo,
      setNewGuideInfo,
    } = this.props;
    const isEditing = window.location.hash;
    const isStructured = query instanceof StructuredQuery;
    const isNative = query instanceof NativeQuery;
    return (
      isEditing &&
      (isStructured && isShowingSummarySidebar ? (
        <SummarizeSidebar
          question={question}
          onClose={() => {
            this.props.onCloseSummary();
            this.props.onOpenChartType();
          }}
          isResultDirty={isResultDirty}
          runQuestionQuery={runQuestionQuery}
          user={user}
          getNewGuideInfo={getNewGuideInfo}
          setNewGuideInfo={setNewGuideInfo}
        />
      ) : isStructured && isShowingFilterSidebar ? (
        <FilterSidebar
          question={question}
          onClose={this.props.onCloseFilter}
          getNewGuideInfo={getNewGuideInfo}
          setNewGuideInfo={setNewGuideInfo}
          optionDefaultFirstKey={
            canShowNewGuideStart(user) ? "Ethereum" : undefined
          }
        />
      ) : isNative && isShowingTemplateTagsEditor ? (
        <TagEditorSidebar
          {...this.props}
          onClose={this.props.toggleTemplateTagsEditor}
        />
      ) : isNative && isShowingDataReference ? (
        <DataReference
          {...this.props}
          onClose={this.props.toggleDataReference}
        />
      ) : isNative && isShowingSnippetSidebar ? (
        <SnippetSidebar
          {...this.props}
          onClose={this.props.toggleSnippetSidebar}
        />
      ) : isShowingChartTypeSidebar || isShowingChartSettingsSidebar ? (
        <ChartTypeSidebarRoot
          {...this.props}
          onCloseChartType={this.props.onCloseChartType}
          onCloseChartSettings={this.props.onCloseChartSettings}
        />
      ) : isShowingQuestionDetailsSidebar ? (
        <QuestionDetailsSidebar question={question} onOpenModal={onOpenModal} />
      ) : null)
    );
  };

  render() {
    const {
      question,
      query,
      card,
      config,
      isDirty,
      isLiveResizable,
      databases,
      isShowingNewbModal,
      queryBuilderMode,
      mode,
      fitClassNames,
      height,
      user,
      location,
      error,
    } = this.props;
    const {
      aggregationIndex,
      aggregationPopoverTarget,
      breakoutIndex,
      breakoutPopoverTarget,
    } = this.state;

    const hideSide = config && config.questionSideHide;

    // if we don't have a card at all or no databases then we are initializing, so keep it simple
    if (!card || !databases) {
      return (
        <LoadingAndErrorWrapper
          error={error}
          className={fitClassNames}
          loading
        />
      );
    }
    const queryMode = mode && mode.queryMode();
    const ModeFooter = queryMode && queryMode.ModeFooter;
    const isStructured = query instanceof StructuredQuery;
    const isNative = query instanceof NativeQuery;
    const isCreate = !question.card().id && !question.card().original_card_id;
    const isAdmin = user.is_superuser;
    const isOwner =
      isAdmin || isCreate || user.id === question.card().creator_id;

    const id = `html2canvas-${question._card.name}-${question._card.id}`;
    // const fileName = `Footprint-${question._card.name}-${moment().format(
    //   "MM/DD/YYYY",
    // )}`;

    const isEditing = window.location.hash;

    const isNewQuestion =
      query instanceof StructuredQuery &&
      !query.sourceTableId() &&
      !query.sourceQuery();

    if (location.hash) {
      const json = deserializeCardFromUrl(location.hash);
      const initShowHideSide = !get(json, "dataset_query.database") && hideSide;
      if (initShowHideSide) {
        this.props.questionSideHideAction({ hide: false });
      }
    }

    if (isNewQuestion || !query.databaseId()) {
      if (query instanceof NativeQuery) {
        const nativeQuery = {
          type: "native",
          native: { query: "select * from " },
          database: 3,
        };
        question.setDatasetQuery(nativeQuery).update();
        window._editor && window._editor.focus();
      }
      const showUpload = true;
      return <QuestionEmpty showUpload={showUpload} />;
    }

    const topQuery = isStructured && query.topLevelQuery();

    // only allow editing of series for structured queries
    const onAddSeries = topQuery ? this.handleAddSeries : null;
    const onEditSeries = topQuery ? this.handleEditSeries : null;
    const onRemoveSeries =
      topQuery && topQuery.hasAggregations() ? this.handleRemoveSeries : null;
    const onEditBreakout =
      topQuery && topQuery.hasBreakouts() ? this.handleEditBreakout : null;

    const rightSideBar = this.createRightSideBar();

    const isSidebarOpen = rightSideBar;
    const isSave = question.isSaved();

    const isNotebookContainerOpen =
      isEditing && (isNewQuestion || queryBuilderMode === "notebook");

    return (
      <div className={fitClassNames}>
        <div
          className={cx("QueryBuilder flex flex-column bg-white spread")}
          id={id}
        >
          <Motion
            defaultStyle={isNewQuestion ? { opacity: 0 } : { opacity: 1 }}
            style={
              isNewQuestion ? { opacity: spring(0) } : { opacity: spring(1) }
            }
          >
            {({ opacity }) => (
              <div className="flex-no-shrink z3 bg-white relative">
                <ViewTitleHeader
                  {...this.props}
                  style={{
                    opacity,
                    padding: "14px 20px",
                  }}
                  downloadImageAction={() => {
                    snapshot({
                      public_uuid: card.public_uuid,
                      isDashboard: false,
                      user,
                    });
                  }}
                  className="border-bottom"
                  key={location.hash}
                />
                {opacity < 1 && (
                  <NewQuestionHeader
                    className="spread"
                    style={{ opacity: 1 - opacity }}
                  />
                )}
              </div>
            )}
          </Motion>

          {isSave && (
            <div className="px4 pt1 z3 bg-white">
              <TagsPanel
                tagEntityId={question._card.id}
                isEditPermission={isOwner && isSave}
                type="card"
              />
            </div>
          )}

          <div className="flex flex-full relative">
            {query instanceof StructuredQuery && (
              <QueryViewNotebook
                isNotebookContainerOpen={isNotebookContainerOpen}
                {...this.props}
              />
            )}

            <div
              className={cx(
                "flex-full flex flex-column flex-basis-none pr3 pl3",
                {
                  "hide sm-show": isSidebarOpen,
                },
              )}
            >
              {isNative && (
                <div className="z2 hide sm-show border-bottom mb2">
                  <NativeQueryEditor
                    {...this.props}
                    viewHeight={height}
                    isOpen={!card.dataset_query.native.query || isDirty}
                    datasetQuery={card && card.dataset_query}
                  />
                </div>
              )}

              <ViewSubHeader {...this.props} />

              <DebouncedFrame
                className="flex-full"
                style={{ flexGrow: 1 }}
                enabled={!isLiveResizable}
              >
                <QueryVisualization
                  {...this.props}
                  onAddSeries={onAddSeries}
                  onEditSeries={onEditSeries}
                  onRemoveSeries={onRemoveSeries}
                  onEditBreakout={onEditBreakout}
                  noHeader
                  className="spread"
                />
              </DebouncedFrame>

              {ModeFooter && (
                <ModeFooter {...this.props} className="flex-no-shrink" />
              )}

              {isOwner && (
                <ViewFooter {...this.props} className="flex-no-shrink" />
              )}
            </div>

            <ViewSidebar
              side="right"
              isOpen={!!rightSideBar}
              className="chart-edit__right-side-bar"
              finalOpacity={0.98}
            >
              {rightSideBar}
            </ViewSidebar>
          </div>
        </div>

        {isShowingNewbModal && (
          <SavedQuestionIntroModal
            onClose={() => this.props.closeQbNewbModal()}
          />
        )}

        <QueryModals {...this.props} />

        {isStructured && (
          <Popover
            isOpen={!!aggregationPopoverTarget}
            target={aggregationPopoverTarget}
            onClose={this.handleClosePopover}
          >
            <AggregationPopover
              query={query}
              aggregation={
                aggregationIndex >= 0
                  ? query.aggregations()[aggregationIndex]
                  : 0
              }
              onChangeAggregation={aggregation => {
                if (aggregationIndex != null) {
                  query
                    .updateAggregation(aggregationIndex, aggregation)
                    .update(null, { run: true });
                } else {
                  query.aggregate(aggregation).update(null, { run: true });
                }
                this.handleClosePopover();
              }}
              onClose={this.handleClosePopover}
            />
          </Popover>
        )}
        {isStructured && (
          <Popover
            isOpen={!!breakoutPopoverTarget}
            onClose={this.handleClosePopover}
            target={breakoutPopoverTarget}
          >
            <BreakoutPopover
              query={query}
              breakout={
                breakoutIndex >= 0 ? query.breakouts()[breakoutIndex] : 0
              }
              onChangeBreakout={breakout => {
                if (breakoutIndex != null) {
                  query
                    .updateBreakout(breakoutIndex, breakout)
                    .update(null, { run: true });
                } else {
                  query.breakout(breakout).update(null, { run: true });
                }
                this.handleClosePopover();
              }}
              onClose={this.handleClosePopover}
            />
          </Popover>
        )}
      </div>
    );
  }
}
