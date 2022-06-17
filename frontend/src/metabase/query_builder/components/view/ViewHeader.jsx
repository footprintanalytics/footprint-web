/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { t } from "ttag";
import cx from "classnames";
import { connect } from "react-redux";
import { get, set } from "lodash";
import Icon from "metabase/components/Icon";
import * as Urls from "metabase/lib/urls";
// import Link from "metabase/components/Link";
import ButtonBar from "metabase/components/ButtonBar";
// import CollectionBadge from "metabase/questions/components/CollectionBadge";
// import LastEditInfoLabel from "metabase/components/LastEditInfoLabel";
// import SavedQuestionHeaderButton from "metabase/query_builder/components/SavedQuestionHeaderButton/SavedQuestionHeaderButton";
import ViewSection, { ViewHeading, ViewSubHeading } from "./ViewSection";
// import ViewButton from "metabase/query_builder/components/view/ViewButton";
import QuestionDataSource from "./QuestionDataSource";
import QuestionDescription from "./QuestionDescription";
import QuestionLineage from "./QuestionLineage";
import QuestionPreviewToggle from "./QuestionPreviewToggle";
import QuestionNotebookButton from "./QuestionNotebookButton";
import QuestionFilters, { QuestionFilterWidget } from "./QuestionFilters";
import { QuestionSummarizeWidget } from "./QuestionSummaries";
import RunButtonWithTooltip from "../RunButtonWithTooltip";
// import { SavedQuestionHeaderButtonContainer } from "./ViewHeader.styled";
import StructuredQuery from "metabase-lib/lib/queries/StructuredQuery";
import QuestionEmbedWidget, {
  QuestionEmbedWidgetButton,
} from "metabase/query_builder/containers/QuestionEmbedWidget";
import QueryDownloadWidget from "metabase/query_builder/components/QueryDownloadWidget";
import Button from "metabase/components/Button";
import { MODAL_TYPES } from "metabase/query_builder/constants";
import Tooltip from "metabase/components/Tooltip";
// import { upload } from "metabase/dashboard/components/utils/upload";
// import { message } from "antd";
import { Menu, Dropdown } from "antd";
import { VizTableToggle } from "./ViewFooter";
import { getVisualizationRaw } from "metabase/visualizations";
import QueryMoreWidget from "../QueryMoreWidget";
import NeedPermissionModal from "metabase/components/NeedPermissionModal";
import { getUserNativeQueryPermission } from "metabase/selectors/user";
import { HeaderTitle } from "metabase/components/Header";
import TitleAndDescription from "metabase/components/TitleAndDescription";
import { isMac } from "metabase/lib/browser";
import Snippets from "metabase/entities/snippets";
import SnippetCollections from "metabase/entities/snippet-collections";
import { questionSideHideAction } from "metabase/redux/config";
// import SnippetSidebarButton from "./SnippetSidebarButton";
// import NativeVariablesButton from "./NativeVariablesButton";
// import DataReferenceButton from "./DataReferenceButton";
import Favorite from "metabase/containers/explore/components/Favorite";
import DashboardCardDisplayInfo from "metabase/components/DashboardCardDisplayInfo";
import EditBar from "metabase/components/EditBar";
import ActionButton from "metabase/components/ActionButton";
import NativeQueryButton from "metabase/query_builder/components/view/NativeQueryButton";
import MyPopover from "metabase/query_builder/components/MyPopover";
import {
  setShowPreviewChart,
  setShowTemplateChart,
} from "metabase/redux/control";
import { trackStructEvent } from "metabase/lib/analytics";
import { isDefi360 } from "metabase/lib/project_info";
import ConfirmContent from "metabase/components/ConfirmContent";
import Modal from "metabase/components/Modal";
import TaggingModal from "metabase/components/TaggingModal";
import { closeNewGuide } from "metabase/containers/newguide/newGuide";
import { InsertRowAboveOutlined, ScissorOutlined } from "@ant-design/icons";
import QuestionRunningTime from "metabase/query_builder/components/view/QuestionRunningTime";
import ResizeObserver from "resize-observer-polyfill";

const viewTitleHeaderPropTypes = {
  question: PropTypes.object.isRequired,
  originalQuestion: PropTypes.object,

  queryBuilderMode: PropTypes.oneOf(["view", "notebook"]),
  setQueryBuilderMode: PropTypes.func,

  result: PropTypes.object,

  isDirty: PropTypes.bool,
  isRunnable: PropTypes.bool,
  isRunning: PropTypes.bool,
  isResultDirty: PropTypes.bool,
  isNativeEditorOpen: PropTypes.bool,
  isShowingFilterSidebar: PropTypes.bool,
  isShowingSummarySidebar: PropTypes.bool,
  isShowingQuestionDetailsSidebar: PropTypes.bool,
  isObjectDetail: PropTypes.bool,

  runQuestionQuery: PropTypes.func,
  cancelQuery: PropTypes.func,

  onOpenModal: PropTypes.func,
  onEditSummary: PropTypes.func,
  onCloseSummary: PropTypes.func,
  onAddFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  onOpenQuestionDetails: PropTypes.func,
  onCloseQuestionDetails: PropTypes.func,
  onOpenQuestionHistory: PropTypes.func,

  isPreviewable: PropTypes.bool,
  isPreviewing: PropTypes.bool,
  setIsPreviewing: PropTypes.func,

  className: PropTypes.string,
  style: PropTypes.object,
  user: PropTypes.object,
  downloadImageAction: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
    canNativeQuery: getUserNativeQueryPermission(state),
    config: state.config,
  };
};

const mapDispatchToProps = {
  handleQuestionSideHide: questionSideHideAction,
  setShowTemplateChart,
  setShowPreviewChart,
};

@connect(mapStateToProps, mapDispatchToProps)
@Snippets.loadList({ loadingAndErrorWrapper: false })
@SnippetCollections.loadList({ loadingAndErrorWrapper: false })
export class ViewTitleHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFiltersExpanded: props.question && !props.question.isSaved(),
      tagModelOpen: false,
      showEdit: props.question.isSaved(),
      expandEdit: !props.question.isSaved(),
      showVip: false,
      confirmModal: false,
      showSeoTaggingModal: false,
      width: 2000,
    };
  }

  componentDidMount() {
    this.handlerButtonScreenAdapter();
  }

  componentWillUnmount() {
    if (this._ro && this.viewHeaderRef) {
      this._ro.unobserve(this.viewHeaderRef);
      this._ro.disconnect();
      this._ro = null;
    }
  }

  handlerButtonScreenAdapter = () => {
    if (this.viewHeaderRef) {
      this._ro = new ResizeObserver((entries, observer) => {
        if (entries && entries.length > 0) {
          this.setState({
            width: entries[0]?.contentRect?.width || 2000,
          });
        }
      });
      this._ro.observe(this.viewHeaderRef);
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const query = this.props.question.query();
    const nextQuery = nextProps.question.query();
    const filtersCount =
      query instanceof StructuredQuery ? query.filters().length : 0;
    const nextFiltersCount =
      nextQuery instanceof StructuredQuery ? nextQuery.filters().length : 0;
    if (nextFiltersCount > filtersCount) {
      this.expandFilters();
    }
    if (nextProps.question.isSaved()) {
      if (!this.state.showEdit && this.state.expandEdit) {
        this.setState({ showEdit: true, expandEdit: false });
      }
    }
  }

  expandFilters = () => {
    this.setState({ isFiltersExpanded: true });
  };

  collapseFilters = () => {
    this.setState({ isFiltersExpanded: false });
  };

  getEditingButtons() {
    const { onOpenModal } = this.props;

    return [
      <Button
        key="cancel"
        className="Button Button--edit-cancel Button--small mr1"
        onClick={() => this.setState({ confirmModal: true })}
      >
        {t`Cancel`}
      </Button>,
      <ActionButton
        id="edit-bar-save"
        key="save"
        actionFn={() => {
          trackStructEvent(`click Save edit chart`);
          onOpenModal("save");
          closeNewGuide({ key: "saveChart" });
        }}
        className=" Button Button--edit-save Button--primary Button--small"
        normalText={t`Save`}
        activeText={t`Saving…`}
        failedText={t`Save failed`}
        successText={t`Saved`}
      />,
    ];
  }

  isSmallScreen = () => {
    return this.state.width < 1200;
  };

  // eslint-disable-next-line complexity
  render() {
    const {
      className,
      style,
      question,
      onOpenModal,
      originalQuestion,
      // isDirty,
      queryBuilderMode,
      setQueryBuilderMode,
      result,
      isShowingRawTable,
      setUIControls,
      isVisualized,
      isRunnable,
      isRunning,
      isResultDirty,
      isPreviewing,
      // isNativeEditorOpen,
      isObjectDetail,
      runQuestionQuery,
      cancelQuery,
      isShowingSummarySidebar,
      onEditSummary,
      onCloseSummary,
      isShowingFilterSidebar,
      onAddFilter,
      onCloseFilter,
      user,
      // isShowingQuestionDetailsSidebar,
      // onOpenQuestionDetails,
      // onCloseQuestionDetails,
      // onOpenQuestionHistory,
      isShowingChartTypeSidebar,
      onCloseChartType,
      onOpenChartType,
      isShowingChartSettingsSidebar,
      onCloseChartSettings,
      onOpenChartSettings,
      card,
      router,
      location,
      nativeEditorSelectedText,
      // snippetCollections,
      // snippets,
      config,
      resetUIControls,
      setShowTemplateChart,
      setShowPreviewChart,
    } = this.props;
    const { isFiltersExpanded, showSeoTaggingModal } = this.state;
    const isShowingNotebook = queryBuilderMode === "notebook";
    const description = question.description();
    // const lastEditInfo = question.lastEditInfo();

    const isStructured = question.isStructured();
    const isNative = question.isNative();
    const isSaved = question.isSaved();
    const isCreate = !question.card().id && !question.card().original_card_id;
    const isAdmin = user.is_superuser;
    const isOwner =
      isAdmin ||
      isCreate ||
      user.id === question.card().creator_id ||
      question.card().creator_id === undefined;
    const isSummarized =
      isStructured &&
      question
        .query()
        .topLevelQuery()
        .hasAggregations();
    const showFiltersInHeading = !isSummarized && !isFiltersExpanded && isOwner;
    const hideSide = config && config.questionSideHide;
    // const showDuplicate = isSaved && !isResultDirty && result && !result.error;
    // const showDuplicate = false;
    // const showDownloadImage =
    //   isSaved && !isResultDirty && result && !result.error;

    const { visualization } = getVisualizationRaw([
      { card: question.card(), data: result && result.data },
    ]);
    const icon = visualization && visualization.iconName;
    // const showSnippetSidebarButton = !(
    //   snippets &&
    //   snippets.length === 0 &&
    //   snippetCollections &&
    //   snippetCollections.length === 1 &&
    //   snippetCollections[0].can_write === false
    // );
    const enabledPopover = !get(question, "_card.original_card_id");
    const showChartTemplate = !isNative;

    const menuMoreOptions = [];
    if (showChartTemplate) {
      menuMoreOptions.push(
        <Menu.Item>
          <Button
            iconColor="#000000"
            icon="chart_template"
            iconSize={16}
            borderless
            onClick={() => {
              trackStructEvent(`chart click show query-template`);
              setShowTemplateChart({
                show: true,
                databaseId: card.dataset_query.database,
              });
            }}
          >
            Template
          </Button>
        </Menu.Item>,
      );
    }
    if (NativeQueryButton.shouldRender(this.props)) {
      menuMoreOptions.push(
        <Menu.Item>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <NativeQueryButton
              borderless
              question={question}
              canNativeQuery={this.props.canNativeQuery}
              btnString={"View the SQL"}
              data-metabase-event={`Notebook Mode; Convert to SQL Click`}
            />
          </div>
        </Menu.Item>,
      );
    }
    return (
      <React.Fragment>
        {!isSaved && (
          <EditBar
            title={t`You're editing this chart.`}
            buttons={this.getEditingButtons()}
          />
        )}

        <ViewSection className={cx("border-bottom", className)} style={style}>
          <div
            ref={r => (this.viewHeaderRef = r)}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
              }}
            >
              {!isSaved && (
                <Button
                  onlyIcon
                  className="Question-header-btn footprint-mr-s"
                  iconColor="#5A617B"
                  icon={hideSide ? "menu_right" : "menu_left"}
                  iconSize={16}
                  onClick={() => {
                    this.props.handleQuestionSideHide({ hide: !hideSide });
                  }}
                />
              )}
              {!isOwner ? (
                <div className="flex align-center">
                  <ViewHeading className="mr1">
                    {question.displayName()}
                  </ViewHeading>
                  {description && (
                    <Icon
                      name="info"
                      className="text-light mx1 cursor-pointer text-brand-hover"
                      size={18}
                      tooltip={description}
                    />
                  )}
                  <DashboardCardDisplayInfo
                    authorName={card.creator && card.creator.name}
                    date={card.created_at}
                    read={card.statistics && card.statistics.view}
                  />
                </div>
              ) : isSaved ? (
                <div style={{ flex: 1 }}>
                  <div
                    className="flex align-center flex-row"
                    style={{ marginBottom: 8 }}
                  >
                    <HeaderTitle
                      router={router}
                      titleAndDescription={
                        <TitleAndDescription
                          title={question.card().name}
                          description={description}
                        />
                      }
                      titleRightPanel={
                        <DashboardCardDisplayInfo
                          authorName={card.creator && card.creator.name}
                          date={card.created_at}
                          read={card.statistics && card.statistics.view}
                          favorite={card.statistics && card.statistics.favorite}
                        />
                      }
                    />
                  </div>
                  <ViewSubHeading className="flex align-center flex-wrap">
                    {QuestionDataSource.shouldRender({ question }) && (
                      <QuestionDataSource
                        question={question}
                        subHead
                        isSaved={isSaved}
                      />
                    )}
                    {QuestionFilters.shouldRender(this.props) && (
                      <QuestionFilters
                        question={question}
                        expanded={isFiltersExpanded}
                        onExpand={this.expandFilters}
                        onCollapse={this.collapseFilters}
                      />
                    )}
                  </ViewSubHeading>
                </div>
              ) : (
                <div>
                  <div className="flex align-baseline flex-wrap">
                    <ViewHeading className="mr2">
                      {isNative ? (
                        t`New chart`
                      ) : (
                        <QuestionDescription question={question} />
                      )}
                    </ViewHeading>
                    {showFiltersInHeading &&
                      QuestionFilters.shouldRender(this.props) && (
                        <QuestionFilters
                          className="mr2"
                          question={question}
                          expanded={isFiltersExpanded}
                          onExpand={this.expandFilters}
                          onCollapse={this.collapseFilters}
                        />
                      )}
                    {QuestionLineage.shouldRender(this.props) && (
                      <QuestionLineage
                        className="mr2"
                        question={question}
                        originalQuestion={originalQuestion}
                      />
                    )}
                  </div>
                </div>
              )}
              {location.hash && isVisualized && (
                <VizTableToggle
                  key="viz-table-toggle"
                  className="ml1"
                  question={question}
                  isShowingRawTable={isShowingRawTable}
                  onShowTable={isShowingRawTable => {
                    setUIControls({ isShowingRawTable });
                  }}
                />
              )}
              {isRunnable && (
                <RunButtonWithTooltip
                  ml={1}
                  compact
                  result={result}
                  isRunning={isRunning}
                  isDirty={isResultDirty}
                  isPreviewing={isPreviewing}
                  onRun={() => {
                    if (isNative) {
                      const selectedText =
                        window._editor && window._editor.getSelectedText();
                      if (selectedText) {
                        const temporaryCard = question
                          .query()
                          .setQueryText(selectedText)
                          .question()
                          .card();
                        runQuestionQuery({
                          overrideWithCard: temporaryCard,
                          shouldUpdateUrl: false,
                        });
                      } else {
                        runQuestionQuery();
                      }
                    } else {
                      runQuestionQuery({
                        shouldUpdateUrl: false,
                        ignoreCache: true,
                      });
                    }
                    setShowPreviewChart({ show: false });
                    setShowTemplateChart({ show: false });
                  }}
                  onCancel={() => cancelQuery()}
                  getTooltip={() => {
                    if (isNative) {
                      return (
                        (nativeEditorSelectedText
                          ? t`Run selected text`
                          : t`Run chart`) +
                        " " +
                        (isMac() ? t`(⌘ + enter)` : t`(Ctrl + enter)`)
                      );
                    } else {
                      return "";
                    }
                  }}
                />
              )}
              {!isSaved && isRunnable && isNative && (
                <QuestionRunningTime {...this.props} />
              )}
              <div
                className={cx("ml-auto flex align-center html2canvas-filter", {
                  "flex-column": this.isSmallScreen(),
                })}
              >
                {this.state.expandEdit && (
                  <React.Fragment>
                    <div className={"ml-auto flex align-center"}>
                      {isOwner &&
                        QuestionFilterWidget.shouldRender(this.props) && (
                          <Button
                            disabled={queryBuilderMode !== "view"}
                            onlyIcon
                            className={`ml1 Question-header-btn-new ${
                              isShowingChartSettingsSidebar
                                ? "Question-header-btn--primary-new"
                                : ""
                            }`}
                            onClick={
                              isShowingChartSettingsSidebar
                                ? onCloseChartSettings
                                : onOpenChartSettings
                            }
                          >
                            <div className="flex align-center">
                              <ScissorOutlined
                                style={{ fontSize: "16px" }}
                                className="mr1"
                              />
                              Column
                            </div>
                          </Button>
                        )}
                      {isOwner &&
                        QuestionFilterWidget.shouldRender(this.props) && (
                          <MyPopover
                            name="filter"
                            enabled={enabledPopover}
                            placement="bottom"
                            delayModel
                            delayShow={!!result}
                            next="summarize"
                          >
                            <Button
                              disabled={queryBuilderMode !== "view"}
                              onlyIcon
                              className={`ml1 Question-header-btn-new ${
                                isShowingFilterSidebar
                                  ? "Question-header-btn--primary-new"
                                  : ""
                              }`}
                              iconColor="#7A819B"
                              icon="filter"
                              iconSize={16}
                              onClick={() => {
                                trackStructEvent(`click Filter edit chart`);
                                isShowingFilterSidebar
                                  ? onCloseFilter()
                                  : onAddFilter();
                              }}
                            >
                              Filter
                            </Button>
                          </MyPopover>
                        )}
                      {isOwner &&
                        QuestionSummarizeWidget.shouldRender(this.props) && (
                          <MyPopover
                            name="summarize"
                            enabled={enabledPopover}
                            placement="bottom"
                            delayModel
                            next="visualization"
                          >
                            <Button
                              disabled={queryBuilderMode !== "view"}
                              onlyIcon
                              className={`ml1 Question-header-btn-new ${
                                isShowingSummarySidebar
                                  ? "Question-header-btn--primary-new"
                                  : ""
                              }`}
                              iconColor="#7A819B"
                              icon="insight"
                              iconSize={16}
                              onClick={() => {
                                trackStructEvent(`click Summary edit chart`);
                                isShowingSummarySidebar
                                  ? onCloseSummary()
                                  : onEditSummary();
                              }}
                            >
                              Summarize
                            </Button>
                          </MyPopover>
                        )}
                    </div>
                    <div
                      className={cx("ml-auto flex align-center", {
                        mt1: this.isSmallScreen(),
                      })}
                    >
                      {!result || isObjectDetail ? null : (
                        <MyPopover
                          name="visualization"
                          enabled={enabledPopover}
                          placement="bottom"
                          delayModel
                          next="advanced"
                        >
                          <Button
                            disabled={queryBuilderMode !== "view"}
                            onlyIcon
                            className={`ml1 Question-header-btn-new ${
                              isShowingChartTypeSidebar
                                ? "Question-header-btn--primary-new"
                                : ""
                            }`}
                            iconColor="#7A819B"
                            icon={icon}
                            iconSize={16}
                            onClick={() => {
                              trackStructEvent(
                                `click Visualization edit chart`,
                              );
                              isShowingChartTypeSidebar
                                ? onCloseChartType()
                                : onOpenChartType();
                            }}
                          >
                            Visualization
                          </Button>
                        </MyPopover>
                      )}
                      {isOwner &&
                        QuestionNotebookButton.shouldRender({ question }) && (
                          <MyPopover
                            name="advanced"
                            enabled={enabledPopover}
                            placement="bottom"
                            delayModel
                          >
                            <Button
                              onlyIcon
                              className={`ml1 Question-header-btn-new ${
                                isShowingNotebook
                                  ? "Question-header-btn--primary-new"
                                  : ""
                              }`}
                              iconColor="#7A819B"
                              icon="advanced"
                              iconSize={16}
                              onClick={() => {
                                trackStructEvent(`click Advanced edit chart`);
                                resetUIControls();
                                setQueryBuilderMode(
                                  isShowingNotebook ? "view" : "notebook",
                                );
                              }}
                            >
                              Advanced
                            </Button>
                          </MyPopover>
                        )}
                      {(isAdmin || user.groups.includes("Inner")) && (
                        <Button
                          onlyIcon
                          className="ml1 Question-header-btn-new"
                          iconColor="#7A819B"
                          iconSize={16}
                          onClick={() => {
                            router.push(`/chart/buffet${location.hash}`);
                            this.props.handleQuestionSideHide({ hide: false });
                          }}
                        >
                          <div className="flex align-center">
                            <InsertRowAboveOutlined
                              style={{ fontSize: "16px" }}
                              className="mr1"
                            />
                            Indicator
                          </div>
                        </Button>
                      )}
                      {menuMoreOptions.length > 0 && (
                        <Dropdown
                          overlay={<Menu>{menuMoreOptions}</Menu>}
                          placement="bottomRight"
                          trigger={["click"]}
                        >
                          <Button
                            onlyIcon
                            className="Question-header-btn-new"
                            iconColor="#7A819B"
                            icon="edit_more"
                            iconSize={16}
                            ml={1}
                          ></Button>
                        </Dropdown>
                      )}
                      {question.query().database() && isNative && isSaved && (
                        <Tooltip tooltip={t`Explore results`}>
                          <Button
                            onlyIcon
                            className="ml1 Question-header-btn"
                            iconColor="#7A819B"
                            icon="sql_preview"
                            iconSize={16}
                            onClick={() => {
                              const url = question
                                .composeThisQuery()
                                .setDisplay("table")
                                .setSettings({})
                                .getUrl();
                              router.push(url);
                            }}
                          />
                        </Tooltip>
                      )}
                      {this.state.showVip && (
                        <NeedPermissionModal
                          title="Upgrade your account to access SQL query"
                          onClose={() => this.setState({ showVip: false })}
                          afterChangeLocation={() => {
                            this.setState({ showVip: false });
                          }}
                        />
                      )}
                    </div>
                  </React.Fragment>
                )}
                {!this.state.expandEdit && (
                  <React.Fragment>
                    {!isDefi360() && (
                      <Tooltip tooltip={t`Add to favorite list`}>
                        <Favorite
                          onlyIcon
                          className="ml1 Question-header-btn-with-text"
                          like={
                            -1
                            // card && card.statistics && card.statistics.favorite
                          }
                          isLike={card.isFavorite}
                          type="card"
                          id={card.id}
                          uuid={card.public_uuid}
                        />
                      </Tooltip>
                    )}
                    {this.state.showEdit && isOwner && (
                      <Tooltip tooltip={t`Edit`}>
                        <Button
                          onlyIcon
                          className={`ml1 Question-header-btn ${
                            this.state.expandEdit
                              ? "Question-header-btn--primary-new"
                              : ""
                          }`}
                          iconColor="#7A819B"
                          icon="pencil"
                          iconSize={16}
                          onClick={() => {
                            set(question, "_card.original_card_id", card.id);
                            question.update(null, {
                              reload: false,
                              shouldUpdateUrl: true,
                            });
                          }}
                        />
                      </Tooltip>
                    )}
                    {(!!card.public_uuid || isOwner || isAdmin) && (
                      <Tooltip tooltip={t`Duplicate this chart`}>
                        <Button
                          onlyIcon
                          className="ml1 Question-header-btn-with-text"
                          iconColor="#7A819B"
                          icon="duplicate"
                          iconSize={16}
                          color={"#7A819B"}
                          onClick={() => onOpenModal(MODAL_TYPES.CLONE)}
                        >
                          {card && card.statistics && `${card.statistics.copy}`}
                        </Button>
                      </Tooltip>
                    )}
                    {(!!card.public_uuid || isOwner || isAdmin) && (
                      <Tooltip tooltip={t`Snapshot`}>
                        <Button
                          onlyIcon
                          className="ml1 Question-header-btn"
                          iconColor="#7A819B"
                          icon="camera"
                          iconSize={16}
                          onClick={this.props.downloadImageAction}
                        />
                      </Tooltip>
                    )}
                    {(!!card.public_uuid || isOwner || isAdmin) &&
                      QueryDownloadWidget.shouldRender({
                        result,
                        isResultDirty,
                      }) && (
                        <QueryDownloadWidget
                          className="ml1"
                          key="download"
                          card={question.card()}
                          result={result}
                        />
                      )}
                    {(!!card.public_uuid || isOwner) &&
                      QuestionEmbedWidget.shouldRender({
                        question,
                        isAdmin,
                        user,
                      }) && (
                        <QuestionEmbedWidgetButton
                          key="question-embed-widget-trigger"
                          onClick={params => onOpenModal("embed", params)}
                        />
                      )}
                    {(!!card.public_uuid || isOwner || isAdmin) && (
                      <QueryMoreWidget
                        className="ml1"
                        key="more"
                        isAdmin={isAdmin}
                        isOwner={isOwner}
                        onOpenModal={onOpenModal}
                        user={user}
                        setShowSeoTagging={() =>
                          this.setState({ showSeoTaggingModal: true })
                        }
                      />
                    )}
                  </React.Fragment>
                )}
              </div>
            </div>
            {!isSaved && isOwner && (
              <div
                className="flex align-center flex-wrap"
                style={{ marginTop: "12px" }}
              >
                {isSummarized && (
                  <QuestionDataSource
                    question={question}
                    subHead
                    isSaved={isSaved}
                    data-metabase-event={`Chart Data Source Click`}
                  />
                )}
                {!showFiltersInHeading &&
                  QuestionFilters.shouldRender(this.props) && (
                    <QuestionFilters
                      question={question}
                      expanded={isFiltersExpanded}
                      onExpand={this.expandFilters}
                      onCollapse={this.collapseFilters}
                    />
                  )}
              </div>
            )}
          </div>
        </ViewSection>
        <Modal isOpen={this.state.confirmModal}>
          <ConfirmContent
            title={t`You have unsaved changes`}
            message={t`Do you want to leave this page and discard your changes?`}
            onClose={() => this.setState({ confirmModal: false })}
            onAction={() => {
              this.setState({ confirmModal: false });
              let url = "";
              if (originalQuestion) {
                url = originalQuestion.getUrl();
              } else {
                url = Urls.newQuestion({
                  type: isNative ? "native" : "query",
                });
              }
              router.replace(url);
            }}
          />
        </Modal>
        {showSeoTaggingModal && (
          <TaggingModal
            onClose={() => this.setState({ showSeoTaggingModal: false })}
            id={card.id}
            creatorId={card.creator_id}
            tagType="seo"
            type="card"
          />
        )}
      </React.Fragment>
    );
  }
}

ViewTitleHeader.propTypes = viewTitleHeaderPropTypes;

const viewSubHeaderPropTypes = {
  isPreviewable: PropTypes.bool,
  isPreviewing: PropTypes.bool,
  setIsPreviewing: PropTypes.func,
};

export class ViewSubHeader extends React.Component {
  render() {
    const { isPreviewable, isPreviewing, setIsPreviewing } = this.props;

    const middle = [];
    const left = [];
    const right = [];

    if (isPreviewable) {
      right.push(
        <QuestionPreviewToggle
          key="preview"
          className="ml2"
          isPreviewing={isPreviewing}
          setIsPreviewing={setIsPreviewing}
        />,
      );
    }

    return left.length > 0 || middle.length > 0 || right.length > 0 ? (
      <ViewSection pt={1}>
        <ButtonBar
          className="flex-full"
          left={left}
          center={middle}
          right={right}
        />
      </ViewSection>
    ) : null;
  }
}

ViewSubHeader.propTypes = viewSubHeaderPropTypes;
