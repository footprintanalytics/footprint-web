import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { t } from "ttag";
import cx from "classnames";

import { ScissorOutlined } from "@ant-design/icons";
import * as Urls from "metabase/lib/urls";
import { SERVER_ERROR_TYPES } from "metabase/lib/errors";
import MetabaseSettings from "metabase/lib/settings";

import Link from "metabase/core/components/Link";
import ViewButton from "metabase/query_builder/components/view/ViewButton";
import { get, set } from "lodash";
import { usePrevious } from "metabase/hooks/use-previous";
import { useToggle } from "metabase/hooks/use-toggle";
import { MODAL_TYPES } from "metabase/query_builder/constants";
import SavedQuestionHeaderButton
  from "metabase/query_builder/components/SavedQuestionHeaderButton/SavedQuestionHeaderButton";

import Button from "metabase/core/components/Button";
import RunButtonWithTooltip from "../RunButtonWithTooltip";
import TableBeta from "../TableBeta";
import TableDictionary from "../TableDictionary";
import ToggleCreateType from "../ToggleCreateType";
import ActionButton from "../../../components/ActionButton";
import TaggingModal from "../../../components/TaggingModal";
import { trackStructEvent } from "../../../lib/analytics";
import EditBar from "../../../components/EditBar";
import TableUpgrade from "../TableUpgrade";
import Modal from "../../../components/Modal";
import ConfirmContent from "../../../components/ConfirmContent";
import { HeadBreadcrumbs } from "./HeaderBreadcrumbs";
import QuestionDescription from "./QuestionDescription";
import QuestionNotebookButton from "./QuestionNotebookButton";
import QuestionFilters, { FilterHeader, QuestionFilterWidget } from "./QuestionFilters";
import { QuestionSummarizeWidget } from "./QuestionSummaries";
import NativeQueryButton from "./NativeQueryButton";
import {
  AdHocLeftSideRoot,
  AdHocViewHeading,
  HeaderDivider,
  SavedQuestionHeaderButtonContainer,
  SavedQuestionLeftSideRoot,
  ViewHeaderActionPanel,
  ViewHeaderContainer,
  ViewHeaderIconButtonContainer,
  ViewHeaderMainLeftContentContainer,
} from "./ViewHeader.styled";
import QuestionRunningTime from "./QuestionRunningTime";
import { closeNewGuide } from "../../../containers/newguide/newGuide";
import { Dropdown, Menu } from "antd";
import NeedPermissionModal from "../../../components/NeedPermissionModal";
import DashboardCardDisplayInfo from "../../../components/DashboardCardDisplayInfo";
import Tooltip from "../../../components/Tooltip";
import Favorite from "../../../containers/explore/components/Favorite";
import QueryDownloadWidget from "../QueryDownloadWidget";
import QuestionEmbedWidget from "../../containers/QuestionEmbedWidget";
import QueryMoreWidget from "../QueryMoreWidget";
import QueryDownloadWidgetFP from "../QueryDownloadWidgetFP";
import SqlOptimize from "../../../components/SqlOptimize";

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
  isNavBarOpen: PropTypes.bool,
  isShowingSummarySidebar: PropTypes.bool,
  isShowingQuestionDetailsSidebar: PropTypes.bool,
  isObjectDetail: PropTypes.bool,
  isAdditionalInfoVisible: PropTypes.bool,

  runQuestionQuery: PropTypes.func,
  cancelQuery: PropTypes.func,
  updateQuestion: PropTypes.func,

  onOpenModal: PropTypes.func,
  onEditSummary: PropTypes.func,
  onCloseSummary: PropTypes.func,
  onOpenQuestionDetails: PropTypes.func,

  className: PropTypes.string,
  style: PropTypes.object,
  router: PropTypes.any,
  questionSideHideAction: PropTypes.func,
  closeNewGuide: PropTypes.func,
  card: PropTypes.object,
  onCloseSidebars: PropTypes.func,
};

export function ViewTitleHeader(props) {
  const { question, className, style, isNavBarOpen, updateQuestion, isRunnable, router, originalQuestion, card, onCloseSidebars } = props;

  const [
    areFiltersExpanded,
    { turnOn: expandFilters, turnOff: collapseFilters },
  ] = useToggle(!question?.isSaved());

  const previousQuestion = usePrevious(question);

  const [confirmModal, setConfirmModal] = useState(false);
  const [showSeoTaggingModal, setShowSeoTaggingModal] = useState(false);

  useEffect(() => {
    if (!question.isStructured() || !previousQuestion?.isStructured()) {
      return;
    }

    const filtersCount = question.query().filters().length;
    const previousFiltersCount = previousQuestion.query().filters().length;

    if (filtersCount > previousFiltersCount) {
      expandFilters();
    }
  }, [previousQuestion, question, expandFilters]);

  const isStructured = question.isStructured();
  const isNative = question.isNative();
  const isSaved = question.isSaved();
  const isDataset = question.isDataset();

  const isSummarized =
    isStructured && question.query().topLevelQuery().hasAggregations();

  const onQueryChange = useCallback(
    newQuery => {
      updateQuestion(newQuery.question(), { run: true });
    },
    [updateQuestion],
  );

  const getEditingButtons = () => {
    const { onOpenModal } = props;

    return [
      <Button
        key="cancel"
        className="Button Button--edit-cancel Button--small mr1"
        onClick={() => setConfirmModal(true)}
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
          onCloseSidebars();
        }}
        className=" Button Button--edit-save Button--primary Button--small"
        normalText={t`Save`}
        activeText={t`Saving…`}
        failedText={t`Save`}
        successText={t`Saved`}
      />,
    ];
  }
  return (
    <>
      {!isSaved && (
        <EditBar
          title={t`You're editing this chart.`}
          buttons={getEditingButtons()}
        />
      )}
      {!isSaved && (
        <TableUpgrade
          tableName={question
            ?.query()
            ?.table()
            ?.displayName()}
          tableId={question?.query()?.table()?.id}
          card={question?.card()}
        />
      )}
      <ViewHeaderContainer
        className={className}
        style={style}
        data-testid="qb-header"
        isNavBarOpen={isNavBarOpen}
      >
        {isSaved ? (
          <SavedQuestionLeftSide {...props} />
        ) : (
          <AhHocQuestionLeftSide
            {...props}
            isNative={isNative}
            isSummarized={isSummarized}
            isRunnable={isRunnable}
            router={router}
            isSaved={isSaved}
            isDataset={isDataset}
            areFiltersExpanded={areFiltersExpanded}
            onExpandFilters={expandFilters}
            onCollapseFilters={collapseFilters}
            onQueryChange={onQueryChange}
          />
        )}
        <ViewTitleHeaderRightSide
          {...props}
          isSaved={isSaved}
          isDataset={isDataset}
          isNative={isNative}
          isSummarized={isSummarized}
          areFiltersExpanded={areFiltersExpanded}
          onExpandFilters={expandFilters}
          onCollapseFilters={collapseFilters}
          onQueryChange={onQueryChange}
        />
      </ViewHeaderContainer>
      {QuestionFilters.shouldRender(props) && (
        <FilterHeader
          {...props}
          expanded={areFiltersExpanded}
          question={question}
          onQueryChange={onQueryChange}
        />
      )}
      <Modal isOpen={confirmModal}>
        <ConfirmContent
          title={t`You have unsaved changes`}
          message={t`Do you want to leave this page and discard your changes?`}
          onClose={() => setConfirmModal(false)}
          onAction={() => {
            setConfirmModal(false);
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
          onClose={() => setShowSeoTaggingModal(false)}
          id={card.id}
          creatorId={card.creator_id}
          tagType="seo"
          type="card"
        />
      )}
    </>
  );
}

SavedQuestionLeftSide.propTypes = {
  question: PropTypes.object.isRequired,
  isObjectDetail: PropTypes.bool,
  isAdditionalInfoVisible: PropTypes.bool,
  isShowingQuestionDetailsSidebar: PropTypes.bool,
  onOpenQuestionInfo: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  card: PropTypes.object,
};

function SavedQuestionLeftSide(props) {
  const {
    question,
    isObjectDetail,
    isAdditionalInfoVisible,
    onOpenQuestionInfo,
    onSave,
    card,
  } = props;

  const [showSubHeader, setShowSubHeader] = useState(false);

 /* useOnMount(() => {
    const timerId = setTimeout(() => {
      setShowSubHeader(false);
    }, 4000);
    return () => clearTimeout(timerId);
  });*/

  const hasLastEditInfo = question.lastEditInfo() != null;
  const isDataset = question.isDataset();

  const onHeaderChange = useCallback(
    name => {
      if (name && name !== question.displayName()) {
        onSave(question.setDisplayName(name).card());
      }
    },
    [question, onSave],
  );
  return (
    <SavedQuestionLeftSideRoot
      data-testid="qb-header-left-side"
      showSubHeader={showSubHeader}
    >
      <ViewHeaderMainLeftContentContainer>
        <SavedQuestionHeaderButtonContainer isDataset={isDataset}>
          <HeadBreadcrumbs
            divider={<HeaderDivider>/</HeaderDivider>}
            parts={[
              ...(isAdditionalInfoVisible && isDataset
                ? [
                    <DatasetCollectionBadge
                      key="collection"
                      dataset={question}
                    />,
                  ]
                : []),

              <SavedQuestionHeaderButton
                key={question.displayName()}
                question={question}
                onSave={onHeaderChange}
              />,
            ]}
          />
        </SavedQuestionHeaderButtonContainer>

        <DashboardCardDisplayInfo
          authorName={card.creator && card.creator.name}
          date={card.created_at}
          read={card.statistics && card.statistics.view}
        />

      </ViewHeaderMainLeftContentContainer>
      {/*{isAdditionalInfoVisible && (
        <ViewHeaderLeftSubHeading>
          {QuestionDataSource.shouldRender(props) && !isDataset && (
            <StyledQuestionDataSource
              question={question}
              isObjectDetail={isObjectDetail}
              subHead
            />
          )}
          {hasLastEditInfo && isAdditionalInfoVisible && (
            <StyledLastEditInfoLabel
              item={question.card()}
              onClick={onOpenQuestionInfo}
            />
          )}
        </ViewHeaderLeftSubHeading>
      )}*/}
    </SavedQuestionLeftSideRoot>
  );
}

AhHocQuestionLeftSide.propTypes = {
  question: PropTypes.object.isRequired,
  originalQuestion: PropTypes.object,
  isNative: PropTypes.bool,
  isObjectDetail: PropTypes.bool,
  isSummarized: PropTypes.bool,
  onOpenModal: PropTypes.func,
  isRunnable: PropTypes.bool,
  router: PropTypes.any,
  updateQuestion: PropTypes.func,
  result: PropTypes.any,
  isResultDirty: PropTypes.bool,
  runQuestionQuery: PropTypes.func,
  cancelQuery: PropTypes.func,
  isRunning: PropTypes.bool,
  queryBuilderMode: PropTypes.oneOf(["view", "notebook"]),
  isNativeEditorOpen: PropTypes.bool,
  isSaved: PropTypes.bool,
  config: PropTypes.any,
  questionSideHideAction: PropTypes.func,
  snippets: PropTypes.array,
};

function AhHocQuestionLeftSide(props) {
  const {
    question,
    originalQuestion,
    isNative,
    isObjectDetail,
    isSummarized,
    onOpenModal,
    isRunnable,
    router,
    updateQuestion,
    result,
    isResultDirty,
    runQuestionQuery,
    cancelQuery,
    isRunning,
    queryBuilderMode,
    isNativeEditorOpen,
    isSaved,
    config,
    questionSideHideAction,
    snippets,
  } = props;
  const isShowingNotebook = queryBuilderMode === "notebook";
  const isMissingPermissions =
    result?.error_type === SERVER_ERROR_TYPES.missingPermissions;
  const hasRunButton =
    isRunnable && !isMissingPermissions;
  const hideSide = config && config.questionSideHide;

  const handleTitleClick = () => {
    const query = question.query();
    if (!query.readOnly()) {
      onOpenModal(MODAL_TYPES.SAVE);
    }
  };
  return (
    <AdHocLeftSideRoot>
      <ViewHeaderMainLeftContentContainer>
        {!isSaved && (
          <Button
            onlyIcon
            className="Question-header-btn footprint-mr-s"
            iconColor="#5A617B"
            icon={hideSide ? "menu_right" : "menu_left"}
            iconSize={16}
            onClick={() => {
              questionSideHideAction({ hide: !hideSide });
            }}
          />
        )}
        <AdHocViewHeading color="dark">
          {isNative ? (
            <div className="flex align-center">
              {get(question, "_card.name") || t`New Chart`}
              <ToggleCreateType question={question} router={router} updateQuestion={updateQuestion}/>
              {hasRunButton && !isShowingNotebook && (
                <ViewHeaderIconButtonContainer>
                  <RunButtonWithTooltip
                    className={cx("text-brand-hover text-dark ml1", {
                      "text-white-hover": isResultDirty,
                    })}
                    iconSize={16}
                    onlyIcon
                    medium
                    compact
                    result={result}
                    isRunning={isRunning}
                    isDirty={isResultDirty}
                    onRun={() => runQuestionQuery({ shouldUpdateUrl: false, ignoreCache: true })}
                    onCancel={cancelQuery}
                  />
                </ViewHeaderIconButtonContainer>
              )}
              {isRunnable && isNative && (
                <QuestionRunningTime {...props} />
              )}
            </div>
          ) : (
            <div className="flex">

              <QuestionDescription
                question={question}
                originalQuestion={originalQuestion}
                isObjectDetail={isObjectDetail}
                onClick={handleTitleClick}
              />
              <TableBeta
                tableName={question
                  ?.query()
                  ?.table()
                  ?.displayName()}
                tableId={question?.query()?.table()?.id}
              />
              <TableDictionary
                tableName={question
                  ?.query()
                  ?.table()
                  ?.displayName()}
                tableId={question?.query()?.table()?.id}
              />
              <ToggleCreateType question={question} router={router} updateQuestion={updateQuestion}/>
              {hasRunButton && !isShowingNotebook && (
                <ViewHeaderIconButtonContainer>
                  <RunButtonWithTooltip
                    className={cx("text-brand-hover text-dark ml1", {
                      "text-white-hover": isResultDirty,
                    })}
                    iconSize={16}
                    onlyIcon
                    medium
                    compact
                    result={result}
                    isRunning={isRunning}
                    isDirty={isResultDirty}
                    onRun={() => runQuestionQuery({ shouldUpdateUrl: false, ignoreCache: true })}
                    onCancel={cancelQuery}
                  />
                </ViewHeaderIconButtonContainer>
              )}
              {/*{NativeQueryButton.shouldRender(props) && (
                <NativeQueryButton
                  size={16}
                  question={question}
                  updateQuestion={updateQuestion}
                  data-metabase-event="Notebook Mode; Convert to SQL Click"
                />
              )}*/}
            </div>
          )}
        </AdHocViewHeading>
      </ViewHeaderMainLeftContentContainer>
    </AdHocLeftSideRoot>
  );
}

DatasetCollectionBadge.propTypes = {
  dataset: PropTypes.object.isRequired,
};

function DatasetCollectionBadge({ dataset }) {
  const { collection } = dataset.card();
  return (
    <HeadBreadcrumbs.Badge to={Urls.collection(collection)} icon="model">
      {collection?.name || t`Our analytics`}
    </HeadBreadcrumbs.Badge>
  );
}

ViewTitleHeaderRightSide.propTypes = {
  question: PropTypes.object.isRequired,
  result: PropTypes.object,
  queryBuilderMode: PropTypes.oneOf(["view", "notebook"]),
  isDataset: PropTypes.bool,
  isSaved: PropTypes.bool,
  isNative: PropTypes.bool,
  isRunnable: PropTypes.bool,
  isRunning: PropTypes.bool,
  isNativeEditorOpen: PropTypes.bool,
  isShowingSummarySidebar: PropTypes.bool,
  isDirty: PropTypes.bool,
  isResultDirty: PropTypes.bool,
  isActionListVisible: PropTypes.bool,
  runQuestionQuery: PropTypes.func,
  updateQuestion: PropTypes.func.isRequired,
  cancelQuery: PropTypes.func,
  onOpenModal: PropTypes.func,
  onEditSummary: PropTypes.func,
  onCloseSummary: PropTypes.func,
  setQueryBuilderMode: PropTypes.func,
  turnQuestionIntoAction: PropTypes.func,
  turnActionIntoQuestion: PropTypes.func,
  turnDatasetIntoQuestion: PropTypes.func,
  areFiltersExpanded: PropTypes.bool,
  onExpandFilters: PropTypes.func,
  onCollapseFilters: PropTypes.func,
  isBookmarked: PropTypes.bool,
  toggleBookmark: PropTypes.func,
  onOpenQuestionInfo: PropTypes.func,
  onCloseQuestionInfo: PropTypes.func,
  isShowingQuestionInfoSidebar: PropTypes.bool,
  onModelPersistenceChange: PropTypes.bool,
  onQueryChange: PropTypes.func,
  user: PropTypes.any,
  isShowingChartSettingsSidebar: PropTypes.bool,
  onCloseChartSettings: PropTypes.func,
  onOpenChartSettings: PropTypes.func,
  isShowingFilterSidebar: PropTypes.bool,
  visualization: PropTypes.object,
  isShowingChartTypeSidebar: PropTypes.bool,
  onCloseChartType: PropTypes.func,
  onOpenChartType: PropTypes.func,
  isObjectDetail: PropTypes.bool,
  setShowTemplateChart: PropTypes.func,
  setShowPreviewChart: PropTypes.func,
  handleQuestionSideHide: PropTypes.func,
  card: PropTypes.object,
  canNativeQuery: PropTypes.bool,
  router: PropTypes.any,
  downloadImageAction: PropTypes.func,
};

// eslint-disable-next-line complexity
function ViewTitleHeaderRightSide(props) {
  const {
    question,
    result,
    queryBuilderMode,
    isBookmarked,
    toggleBookmark,
    isSaved,
    isDataset,
    isNative,
    isShowingSummarySidebar,
    isDirty,
    isResultDirty,
    isActionListVisible,
    onOpenModal,
    onEditSummary,
    onCloseSummary,
    setQueryBuilderMode,
    turnDatasetIntoQuestion,
    turnQuestionIntoAction,
    turnActionIntoQuestion,
    isShowingQuestionInfoSidebar,
    onCloseQuestionInfo,
    onOpenQuestionInfo,
    onModelPersistenceChange,
    user,
    isShowingChartSettingsSidebar,
    onCloseChartSettings,
    onOpenChartSettings,
    isShowingFilterSidebar,
    visualization,
    isShowingChartTypeSidebar,
    onCloseChartType,
    onOpenChartType,
    isObjectDetail,
    setShowTemplateChart,
    setShowPreviewChart,
    handleQuestionSideHide,
    card,
    canNativeQuery,
    router,
    downloadImageAction,
    updateQuestion,
  } = props;
  const [showVip, setShowVip] = useState(false);
  const isShowingNotebook = queryBuilderMode === "notebook";
  const query = question.query();
  const isReadOnlyQuery = query.readOnly();
  const canEditQuery = !isReadOnlyQuery;
  const canRunAdhocQueries = !isReadOnlyQuery;
  const canNest = query.canNest();
  const hasExploreResultsLink =
    isNative &&
    canNest &&
    isSaved &&
    canRunAdhocQueries &&
    MetabaseSettings.get("enable-nested-queries");

  const isNewQuery = !query.hasData();
  const isCreate = !question.card().id && !question.card().original_card_id;
  const isAdmin = user && user.is_superuser;
  const hasSaveButton =
    !isDataset &&
    !!isDirty &&
    (isNewQuery || canEditQuery) &&
    isActionListVisible;
 /* const isMissingPermissions =
    result?.error_type === SERVER_ERROR_TYPES.missingPermissions;
  const hasRunButton =
    isRunnable && !isNativeEditorOpen && !isMissingPermissions;*/

  const icon = visualization && visualization.iconName;

  const isOwner =
    isAdmin ||
    isCreate ||
    user?.id === question.card().creator_id ||
    question.card().creator_id === undefined;

  const handleInfoClick = useCallback(() => {
    if (isShowingQuestionInfoSidebar) {
      onCloseQuestionInfo();
    } else {
      onOpenQuestionInfo();
    }
  }, [isShowingQuestionInfoSidebar, onOpenQuestionInfo, onCloseQuestionInfo]);

  const menuMoreOptions = [];
  const showChartTemplate = !isNative;

  if (showChartTemplate) {
    menuMoreOptions.push(
      <Menu.Item key="template">
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

  if (NativeQueryButton.shouldRender(props)) {
    menuMoreOptions.push(
      <Menu.Item key="view_sql">
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
            canNativeQuery={canNativeQuery}
            btnString={"View the SQL"}
            data-metabase-event={`Notebook Mode; Convert to SQL Click`}
            updateQuestion={updateQuestion}
          />
        </div>
      </Menu.Item>,
    );
  }

  if (isSaved) {
    return (
      <ViewHeaderActionPanel data-testid="qb-header-action-panel">
        <Tooltip tooltip={t`Add to favorite list`}>
          <Favorite
            onlyIcon
            className="Question-header-btn-with-text"
            like={
              // -1
              card && card.statistics && card.statistics.favorite
            }
            isLike={card.isFavorite}
            type="card"
            id={card.id}
            uuid={card.public_uuid}
          />
        </Tooltip>
        {isOwner && (
          <Tooltip tooltip={t`Edit`}>
            <Button
              onlyIcon
              className={`Question-header-btn `}
              iconColor="#7A819B"
              icon="pencil"
              iconSize={16}
              onClick={() => {
                set(question, "_card.original_card_id", card.id);
                set(question, "_card.id", 0);
                console.log("question", question)
                updateQuestion(question, {
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
              className="Question-header-btn-with-text"
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
              className="Question-header-btn"
              iconColor="#7A819B"
              icon="camera"
              iconSize={16}
              onClick={props.downloadImageAction}
            />
          </Tooltip>
        )}
        {(!!card.public_uuid || isOwner || isAdmin) &&
        QueryDownloadWidget.shouldRender({
          result,
          isResultDirty,
        }) && (
          <QueryDownloadWidgetFP
            className=""
            key="download"
            card={question.card()}
            result={result}
          />
        )}
        {(!!card.public_uuid || isOwner) && QuestionEmbedWidget.shouldRender({
          question,
          isAdmin,
          user,
        }) && (
          <QuestionEmbedWidgetButton
            key="question-embed-widget-trigger"
            onClick={params => onOpenModal("embed", null, params)}
          />
        )}
        {(!!card.public_uuid || isOwner || isAdmin) && (
          <QueryMoreWidget
            className=""
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
        {/*<QuestionActions
          isShowingQuestionInfoSidebar={isShowingQuestionInfoSidebar}
          isBookmarked={isBookmarked}
          handleBookmark={toggleBookmark}
          onOpenModal={onOpenModal}
          question={question}
          setQueryBuilderMode={setQueryBuilderMode}
          turnDatasetIntoQuestion={turnDatasetIntoQuestion}
          turnQuestionIntoAction={turnQuestionIntoAction}
          turnActionIntoQuestion={turnActionIntoQuestion}
          onInfoClick={handleInfoClick}
          onModelPersistenceChange={onModelPersistenceChange}
        />*/}
      </ViewHeaderActionPanel>
    )
  }

  return (
    <ViewHeaderActionPanel data-testid="qb-header-action-panel">
      {isOwner &&
        QuestionFilterWidget.shouldRender(props) && (
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
      {/*{QuestionFilters.shouldRender(props) && (
        <FilterHeaderToggle
          className="ml2 mr1"
          question={question}
          expanded={areFiltersExpanded}
          onExpand={onExpandFilters}
          onCollapse={onCollapseFilters}
          onQueryChange={onQueryChange}
        />
      )}*/}
      {QuestionFilterWidget.shouldRender(props) && (
        <QuestionFilterWidget
          className="Question-header-btn-new hide sm-show"
          onOpenModal={onOpenModal}
        />
      )}
      {QuestionSummarizeWidget.shouldRender(props) && (
        <QuestionSummarizeWidget
          className="Question-header-btn-new hide sm-show"
          isShowingSummarySidebar={isShowingSummarySidebar}
          onEditSummary={onEditSummary}
          onCloseSummary={onCloseSummary}
          data-metabase-event="View Mode; Open Summary Widget"
        />
      )}
      {QuestionNotebookButton.shouldRender(props) && (
        // <ViewHeaderIconButtonContainer>
          <QuestionNotebookButton
            className="Question-header-btn-new hide sm-show"
            question={question}
            isShowingNotebook={isShowingNotebook}
            setQueryBuilderMode={setQueryBuilderMode}
            data-metabase-event={
              isShowingNotebook
                ? `Notebook Mode;Go to View Mode`
                : `View Mode; Go to Notebook Mode`
            }
          />
        // </ViewHeaderIconButtonContainer>
      )}
      {!isSaved && !isObjectDetail && (
        <SqlOptimize sql={question?.card().dataset_query?.native?.query || ""}/>
      )}
      {!isSaved && result && !isObjectDetail && (<Button
          disabled={queryBuilderMode !== "view"}
          onlyIcon
          className={`Question-header-btn-new ${
            isShowingChartTypeSidebar || isShowingChartSettingsSidebar
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
            isShowingChartTypeSidebar || isShowingChartSettingsSidebar
              ? onCloseChartType()
              : onOpenChartType();
          }}
        >
          Visualization
        </Button>
      )}
      {/*{(isAdmin || user.groups.includes("Inner")) && (
        <Button
          onlyIcon
          className="Question-header-btn-new"
          iconColor="#7A819B"
          iconSize={16}
          onClick={() => {
            router.push(`/chart/buffet${location.hash}`);
            handleQuestionSideHide({ hide: false });
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
      )}*/}
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
          />
        </Dropdown>
      )}
      {showVip && (
        <NeedPermissionModal
          title="Upgrade your account to access SQL query"
          onClose={() => setShowVip(false)}
          afterChangeLocation={() => {
            setShowVip(false);
          }}
        />
      )}
      {hasExploreResultsLink && <ExploreResultsLink question={question} />}
      {/*{hasRunButton && !isShowingNotebook && (
        <ViewHeaderIconButtonContainer>
          <RunButtonWithTooltip
            className={cx("text-brand-hover text-dark", {
              "text-white-hover": isResultDirty,
            })}
            iconSize={16}
            onlyIcon
            medium
            compact
            result={result}
            isRunning={isRunning}
            isDirty={isResultDirty}
            onRun={() => runQuestionQuery({ ignoreCache: true })}
            onCancel={cancelQuery}
          />
        </ViewHeaderIconButtonContainer>
      )}*/}
      {/*{hasSaveButton && (
        <SaveButton
          disabled={!question.canRun() || !canEditQuery}
          tooltip={{
            tooltip: t`You don't have permission to save this question.`,
            isEnabled: !canEditQuery,
            placement: "left",
          }}
          data-metabase-event={
            isShowingNotebook
              ? `Notebook Mode; Click Save`
              : `View Mode; Click Save`
          }
          onClick={() => onOpenModal("save")}
        >
          {t`Save`}
        </SaveButton>
      )}*/}
    </ViewHeaderActionPanel>
  );
}

ExploreResultsLink.propTypes = {
  question: PropTypes.object.isRequired,
};

function ExploreResultsLink({ question }) {
  const url = question
    .composeThisQuery()
    .setDisplay("table")
    .setSettings({})
    .getUrl();

  return (
    <Link to={url}>
      <ViewButton medium p={[2, 1]} icon="insight" labelBreakpoint="sm">
        {t`Explore results`}
      </ViewButton>
    </Link>
  );
}

ViewTitleHeader.propTypes = viewTitleHeaderPropTypes;

export function QuestionEmbedWidgetButton({ onClick }) {
  return (
    <>
      <Tooltip tooltip={t`Embed Widget`}>
        <Button
          onlyIcon
          className="Question-header-btn"
          icon="embed"
          iconSize={16}
          onClick={() => {
            trackStructEvent(
              "Sharing / Embedding",
              "question",
              "Sharing Link Clicked",
            );
            onClick({ onlyEmbed: true });
          }}
        />
      </Tooltip>
      <Tooltip tooltip={t`Sharing`}>
        <Button
          onlyIcon
          className="Question-header-btn"
          icon="share"
          iconSize={16}
          onClick={() => {
            trackStructEvent(
              "Sharing / Embedding",
              "question",
              "Sharing Link Clicked",
            );
            onClick({ onlyEmbed: false });
          }}
        />
      </Tooltip>
    </>
  );
}

const QuestionEmbedWidgetTriggerPropTypes = {
  onClick: PropTypes.func,
};

QuestionEmbedWidgetButton.propTypes = QuestionEmbedWidgetTriggerPropTypes;
