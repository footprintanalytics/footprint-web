/*
 * Shared component for Scalar and SmartScalar to make sure our number presentation stays in sync
 */
/* eslint-disable react/prop-types */
import React, { useMemo } from "react";

import Icon from "metabase/components/Icon";
import Tooltip from "metabase/components/Tooltip";
import Ellipsified from "metabase/core/components/Ellipsified";
import {
  ScalarRoot,
  ScalarValueWrapper,
  ScalarTitleContainer,
  ScalarDescriptionContainer,
  ScalarDescriptionPlaceholder,
  ScalarTitleContent,
} from "./ScalarValue.styled";

import { findSize, getMaxFontSize } from "./utils";
import { LegendDescriptionIcon } from "metabase/visualizations/components/legend/LegendCaption.styled";
import { Tag } from "antd";
import { isABPath } from "metabase/ab/utils/utils";

const HORIZONTAL_PADDING = 32;

export const ScalarWrapper = ({ children }) => (
  <ScalarRoot>{children}</ScalarRoot>
);

const ScalarValue = ({
  value,
  width,
  gridSize,
  totalNumGridCols,
  fontFamily,
}) => {
  const isFga = isABPath()
  const fontSize = useMemo(
    () =>
      findSize({
        text: value,
        targetWidth: width - HORIZONTAL_PADDING * 2,
        fontFamily: fontFamily ?? "Lato",
        fontWeight: 600,
        unit: "rem",
        step: 0.4,
        min: 1,
        max:
          isFga ? 1.6 : (gridSize ? getMaxFontSize(gridSize.width, totalNumGridCols) / 2 : 3),
      }),
    [isFga, fontFamily, gridSize, totalNumGridCols, value, width],
  );

  return (
    <ScalarValueWrapper className="ScalarValue fullscreen-night-text" fontSize={fontSize}>
      {value}
    </ScalarValueWrapper>
  );
};

export const ScalarTitle = ({ title, description, onClick, titleExtraInfo }) => (
  <ScalarTitleContainer>
    {/*
      This is a hacky spacer so that the h3 is centered correctly.
      It needs match the width of the tooltip icon on the other side.
     */}
    {description && description.length > 0 && <ScalarDescriptionPlaceholder />}
    <ScalarTitleContent
      className="fullscreen-normal-text fullscreen-night-text"
      data-testid="scalar-title"
      onClick={onClick}
    >
      <Ellipsified tooltip={title} lines={2} placement="bottom">
        {titleExtraInfo && <Tag style={{ marginRight: 4, padding: "0 4px" }}>{titleExtraInfo}</Tag>}
        {title}
      </Ellipsified>
    </ScalarTitleContent>
    {description && description.length > 0 && (
      <ScalarDescriptionContainer className="html2canvas-filter">
        <Tooltip tooltip={description} maxWidth="22em">
          <LegendDescriptionIcon />
        </Tooltip>
      </ScalarDescriptionContainer>
    )}
  </ScalarTitleContainer>
);

export default ScalarValue;
