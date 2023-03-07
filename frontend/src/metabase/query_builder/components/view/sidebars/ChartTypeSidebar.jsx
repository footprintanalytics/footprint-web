/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import _ from "underscore";
import { t } from "ttag";
import Icon from "metabase/components/Icon";
import SidebarContent from "metabase/query_builder/components/SidebarContent";
import "./ChartSidebar.css";

import visualizations from "metabase/visualizations";
import {
  OptionIconContainer,
  OptionList,
  OptionRoot,
  OptionText,
} from "./ChartTypeOption.styled";
import NeedPermissionModal from "metabase/components/NeedPermissionModal";
import Link from "metabase/core/components/Link";

const FIXED_LAYOUT = [
  [
    "table",
    "line",
    "bar",
    "area",
    "smartscalar",
    "pie",
    "combo",
    "scalar",
    "rose",
  ],
  ["scatter", "funnel", "progress", "gauge", "row", "waterfall"],
  [
    "pivot",
    "map",
    "rowrace",
    "linerace",
    "circle",
    "treemap",
    "dynamicpie",
    "sunburst",
    "nestedpies",
    "bubble",
    "barstack",
    "doublescalar",
    "graph",
    "fgatable",
  ],
];
const FIXED_TYPES = new Set(_.flatten(FIXED_LAYOUT));
const TOP_TYPES = new Set(FIXED_LAYOUT[0]);

const ChartTypeSidebar = ({
  question,
  result,
  onOpenChartSettings,
  onCloseChartType,
  updateQuestion,
  isShowingChartTypeSidebar,
  setUIControls,
  ...props
}) => {
  const [showMore, setShowMore] = useState(false);
  const other = Array.from(visualizations)
    .filter(
      ([type, visualization]) =>
        !visualization.hidden && !FIXED_TYPES.has(type),
    )
    .map(([type]) => type);
  const otherGrouped = Object.values(
    _.groupBy(other, (_, index) => Math.floor(index / 4)),
  );
  const layout = [...FIXED_LAYOUT, ...otherGrouped];
  const [showVip, setShowVip] = useState(false);

  if (
    !props?.user?.groups?.find(f =>
      ["staff", "inner", "admin"].includes(String(f).toLocaleLowerCase()),
    )
  ) {
    layout[2] = layout[2].filter(f => f !== "graph" && f !== "fgatable");
  }

  useEffect(() => {
    if (question && !showMore && !TOP_TYPES.has(question.display())) {
      setShowMore(true);
    }
  }, [question, showMore]);

  return (
    <SidebarContent
      className="full-height chart-side-bar__char-type"
      // title={t`Choose a visualization`}
      // onDone={onCloseChartType}
    >
      {layout.slice(0, showMore ? layout.length : 1).map((row, index) => (
        <OptionList key={index}>
          {row.map(type => {
            const visualization = visualizations.get(type);
            return (
              visualization && (
                <ChartTypeOption
                  key={type}
                  visualization={visualization}
                  isSelected={type === question.display()}
                  isSensible={
                    result &&
                    result.data &&
                    visualization.isSensible &&
                    visualization.isSensible(result.data, props.query)
                  }
                  onClick={() => {
                    const newQuestion = question
                      .setDisplay(type)
                      .lockDisplay(true); // prevent viz auto-selection

                    updateQuestion(newQuestion, {
                      reload: false,
                      shouldUpdateUrl: question.query().isEditable(),
                    });
                    onOpenChartSettings({ section: t`Data` });
                    setUIControls({ isShowingRawTable: false });
                  }}
                />
              )
            );
          })}
        </OptionList>
      ))}
      {!showMore && (
        <div className="text-centered w-full" onClick={() => setShowMore(true)}>
          <Link className="flex justify-center align-center cursor-pointer p1">
            <Icon name="search_arrow_up" size={12} />
            <div className="ml1">More</div>
          </Link>
        </div>
      )}
      {showVip && (
        <NeedPermissionModal
          title="Upgrade your account to access more Advanced Charting"
          onClose={() => setShowVip(false)}
        />
      )}
    </SidebarContent>
  );
};

const ChartTypeOption = ({
  visualization,
  isSelected,
  isSensible,
  onClick,
}) => (
  <OptionRoot isSensible={isSensible}>
    <OptionIconContainer
      isSelected={isSelected}
      onClick={onClick}
      data-testid={`${visualization.uiName}-button`}
      data-is-sensible={isSensible}
    >
      <Icon name={visualization.iconName} size={20} />
    </OptionIconContainer>
    <OptionText>{visualization.uiName}</OptionText>
  </OptionRoot>
);

export default ChartTypeSidebar;
