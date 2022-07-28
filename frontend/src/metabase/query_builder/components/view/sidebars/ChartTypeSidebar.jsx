/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import _ from "underscore";
import { t } from "ttag";
import cx from "classnames";
import { Box, Flex } from "grid-styled";
import Icon from "metabase/components/Icon";

import { color } from "metabase/lib/colors";

import visualizations from "metabase/visualizations";
import { getUserAdvancedChartingPermission } from "metabase/selectors/user";
import NeedPermissionModal from "metabase/components/NeedPermissionModal";
import SidebarContent from "metabase/query_builder/components/SidebarContent";
import "./ChartSidebar.css";
import Link from "metabase/components/Link";

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
  ],
];
const FIXED_TYPES = new Set(_.flatten(FIXED_LAYOUT));
const TOP_TYPES = new Set(FIXED_LAYOUT[0]);

const ChartTypeSidebar = ({
  question,
  result,
  onOpenChartSettings,
  onCloseChartType,
  isShowingChartTypeSidebar,
  setUIControls,
  canUse,
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
        <Flex key={index} mx={2} mb={1} className="flex-wrap">
          {row.map(type => {
            const visualization = visualizations.get(type); // type = rowrace
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
                    // if (
                    //   visualization.checkPermisson &&
                    //   visualization.checkPermisson() &&
                    //   !canUse
                    // ) {
                    //   setShowVip(true);
                    //   return;
                    // }
                    question
                      .setDisplay(type)
                      .lockDisplay(true) // prevent viz auto-selection
                      .update(null, { reload: false, shouldUpdateUrl: true });
                    onOpenChartSettings({ section: t`Data` });
                    setUIControls({ isShowingRawTable: false });
                  }}
                />
              )
            );
          })}
        </Flex>
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
  <Box
    p={1}
    width={1 / 3}
    className="text-centered"
    style={{ opacity: !isSensible ? 0.25 : 1 }}
  >
    <Flex
      flexDirection="column"
      align="center"
      justifyContent="center"
      bg={isSelected ? color("brand") : color("#e3e3ff")}
      onClick={onClick}
      className={cx(
        "cursor-pointer bg-brand-hover text-brand text-white-hover",
        { "text-white": isSelected },
      )}
      style={{
        borderRadius: 10,
        padding: 12,
      }}
      data-testid={`${visualization.uiName}-button`}
      data-is-sensible={isSensible}
    >
      <Icon name={visualization.iconName} size={20} />
    </Flex>
    <Box mt={1} className="text-bold text-brand">
      {visualization.uiName}
    </Box>
  </Box>
);

const mapStateToProps = state => ({
  canUse: getUserAdvancedChartingPermission(state),
});

export default connect(mapStateToProps)(ChartTypeSidebar);
