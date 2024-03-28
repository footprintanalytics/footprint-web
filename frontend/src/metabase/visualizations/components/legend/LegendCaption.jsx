import React from "react";
import PropTypes from "prop-types";
import { iconPropTypes } from "metabase/components/Icon";
import Tooltip from "metabase/components/Tooltip";
import Ellipsified from "metabase/core/components/Ellipsified";
import LegendActions from "./LegendActions";
import {
  LegendCaptionRoot,
  LegendDescriptionIcon,
  LegendLabel,
  LegendLabelIcon,
} from "./LegendCaption.styled";
import { Tag } from "antd";

const propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.shape(iconPropTypes),
  actionButtons: PropTypes.node,
  onSelectTitle: PropTypes.func,
  titleExtraInfo: PropTypes.any,
};

const LegendCaption = ({
  className,
  title,
  description,
  icon,
  actionButtons,
  onSelectTitle,
  titleExtraInfo,
}) => {
  return (
    <LegendCaptionRoot className={className} data-testid="legend-caption">
      {icon && <LegendLabelIcon {...icon} />}
      {titleExtraInfo && <Tag style={{ marginRight: 4, padding: "0 4px" }}>{titleExtraInfo}</Tag>}
      <LegendLabel
        className="fullscreen-normal-text fullscreen-night-text"
        onClick={onSelectTitle}
      >
        <Ellipsified>{title}</Ellipsified>
      </LegendLabel>
      {description && (
        <Tooltip tooltip={description} maxWidth="22em">
          <LegendDescriptionIcon className="html2canvas-filter" size={12}/>
        </Tooltip>
      )}
      {actionButtons && <LegendActions>{actionButtons}</LegendActions>}
    </LegendCaptionRoot>
  );
};

LegendCaption.propTypes = propTypes;

export default LegendCaption;
