/* eslint-disable react/prop-types */
import React from "react";

import { t } from "ttag";
import cx from "classnames";
import styled from "styled-components";
import { Flex } from "grid-styled";
import { color, darken } from "metabase/lib/colors";

// import Icon from "metabase/components/Icon";

import ButtonBar from "metabase/components/ButtonBar";

import ViewSection from "./ViewSection";
import ViewButton from "./ViewButton";

// import QuestionAlertWidget from "./QuestionAlertWidget";
// import QueryDownloadWidget from "metabase/query_builder/components/QueryDownloadWidget";
// import QuestionEmbedWidget, {
//   QuestionEmbedWidgetTrigger,
// } from "metabase/query_builder/containers/QuestionEmbedWidget";

// import { QuestionFilterWidget } from "./QuestionFilters";
// import { QuestionSummarizeWidget } from "./QuestionSummaries";

import QuestionRowCount from "./QuestionRowCount";
// import QuestionLastUpdated from "./QuestionLastUpdated";

import {
  getVisualizationRaw,
  // getIconForVisualizationType,
} from "metabase/visualizations";

import Button from "metabase/components/Button";

const ViewFooter = ({
  question,
  result,
  user,
  className,
  isShowingChartTypeSidebar,
  isShowingChartSettingsSidebar,
  isShowingRawTable,
  onOpenChartType,
  onOpenModal,
  onCloseChartType,
  onOpenChartSettings,
  onCloseChartSettings,
  setUIControls,
  isObjectDetail,
  questionAlerts,
  visualizationSettings,
  isAdmin,
  isPreviewing,
  isResultDirty,
  isVisualized,
  queryBuilderMode,

  isShowingFilterSidebar,
  onAddFilter,
  onCloseFilter,
  isShowingSummarySidebar,
  onEditSummary,
  onCloseSummary,
}) => {
  if (!result || isObjectDetail) {
    return null;
  }

  return (
    <ViewSection
      className={cx(className, "text-medium border-top")}
      style={{ padding: "14px 32px" }}
    >
      <ButtonBar
        className="flex-full"
        left={
          [
            // QuestionFilterWidget.shouldRender({ question, queryBuilderMode }) && (
            //   <QuestionFilterWidget
            //     key="question-filter-widget"
            //     className="sm-hide"
            //     mr={1}
            //     p={2}
            //     isShowingFilterSidebar={isShowingFilterSidebar}
            //     onAddFilter={onAddFilter}
            //     onCloseFilter={onCloseFilter}
            //   />
            // ),
            // QuestionSummarizeWidget.shouldRender({
            //   question,
            //   queryBuilderMode,
            // }) && (
            //   <QuestionSummarizeWidget
            //     key="question-summarize-widget"
            //     className="sm-hide"
            //     mr={1}
            //     p={2}
            //     isShowingSummarySidebar={isShowingSummarySidebar}
            //     onEditSummary={onEditSummary}
            //     onCloseSummary={onCloseSummary}
            //   />
            // ),
            // <VizTypeButton
            //   key="viz-type"
            //   question={question}
            //   result={result}
            //   active={isShowingChartTypeSidebar}
            //   onClick={
            //     isShowingChartTypeSidebar ? onCloseChartType : onOpenChartType
            //   }
            // />,
            // <VizSettingsButton
            //   key="viz-settings"
            //   ml={1}
            //   mr={[3, 0]}
            //   active={isShowingChartSettingsSidebar}
            //   onClick={
            //     isShowingChartSettingsSidebar
            //       ? onCloseChartSettings
            //       : onOpenChartSettings
            //   }
            // />,
          ]
        }
        // center={
        //   isVisualized && (
        //     <VizTableToggle
        //       key="viz-table-toggle"
        //       className="mx1"
        //       question={question}
        //       isShowingRawTable={isShowingRawTable}
        //       onShowTable={isShowingRawTable => {
        //         setUIControls({ isShowingRawTable });
        //       }}
        //     />
        //   )
        // }
        right={[
          QuestionRowCount.shouldRender({ question, result, isObjectDetail }) &&
            !isPreviewing && (
              <QuestionRowCount
                key="row_count"
                question={question}
                isResultDirty={isResultDirty}
                result={result}
              />
            ),
          // QuestionLastUpdated.shouldRender({ result }) && (
          //   <QuestionLastUpdated
          //     key="last-updated"
          //     className="mx1 hide sm-show"
          //     result={result}
          //   />
          // ),
          // QueryDownloadWidget.shouldRender({ result, isResultDirty }) && (
          //   <QueryDownloadWidget
          //     key="download"
          //     className="mx1 hide sm-show"
          //     card={question.card()}
          //     result={result}
          //     visualizationSettings={visualizationSettings}
          //   />
          // ),
          // QuestionAlertWidget.shouldRender({
          //   question,
          //   visualizationSettings,
          // }) && (
          //   <QuestionAlertWidget
          //     key="alerts"
          //     className="mx1 hide sm-show"
          //     question={question}
          //     questionAlerts={questionAlerts}
          //     onCreateAlert={() =>
          //       question.isSaved()
          //         ? onOpenModal("create-alert")
          //         : onOpenModal("save-question-before-alert")
          //     }
          //   />
          // ),
          // QuestionEmbedWidget.shouldRender({ question, isAdmin }) && (
          //   <QuestionEmbedWidgetTrigger
          //     onClick={() =>
          //       question.isSaved()
          //         ? onOpenModal("embed")
          //         : onOpenModal("save-question-before-embed")
          //     }
          //   />
          // ),
        ]}
      />
    </ViewSection>
  );
};

export const VizTypeButton = ({ question, result, ...props }) => {
  if (!result) {
    return null;
  }

  // TODO: move this to QuestionResult or something
  const { visualization } = getVisualizationRaw([
    { card: question.card(), data: result.data },
  ]);
  const icon = visualization && visualization.iconName;

  return (
    <ViewButton
      medium
      p={[2, 1]}
      icon={icon}
      labelBreakpoint="sm"
      data-testid="viz-type-button"
      {...props}
    >
      {/* {t`Visualization`} */}
    </ViewButton>
  );
};

export const VizSettingsButton = ({ ...props }) => (
  <ViewButton
    medium
    p={[2, 1]}
    icon="gear"
    labelBreakpoint="sm"
    data-testid="viz-settings-button"
    {...props}
  >
    {t`Settings`}
  </ViewButton>
);

const Well = styled(Flex)`
  border-radius: 99px;
  &:hover {
    background-color: ${darken(color("bg-medium"), 0.05)};
  }
  transition: background 300ms linear;
`;

Well.defaultProps = {
  px: "6px",
  py: "4px",
  align: "center",
  bg: color("bg-medium"),
};

const ToggleIcon = styled(Flex)`
  cursor: pointer;
  background-color: ${props => (props.active ? color("brand") : "transparent")};
  color: ${props => (props.active ? "white" : "inherit")};
  border-radius: 99px;
`;

ToggleIcon.defaultProps = {
  p: "4px",
  px: "8px",
};

export const VizTableToggle = ({
  className,
  question,
  isShowingRawTable,
  onShowTable,
}) => {
  // const vizIcon = getIconForVisualizationType(question.display());
  return (
    <div
      className={`ml1 Question-header-btns ${className}`}
      onClick={() => onShowTable(!isShowingRawTable)}
    >
      <Button
        onlyIcon
        className={`Question-header-btn ${
          isShowingRawTable ? "Question-header-btn--info" : ""
        }`}
        iconColor="#ACACB2"
        icon="table2"
        iconSize={16}
      />
      <Button
        onlyIcon
        className={`Question-header-btn ${
          !isShowingRawTable ? "Question-header-btn--info" : ""
        }`}
        iconColor="#ACACB2"
        icon="charts"
        iconSize={16}
      />
    </div>
  );
};

export default ViewFooter;
