/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";

import Icon, { iconPropTypes } from "metabase/components/Icon";
import Tooltip from "metabase/components/Tooltip";
import Ellipsified from "metabase/components/Ellipsified";

import cx from "classnames";
import { formatTitle } from "metabase/lib/formatting";
import { commonD3LegendSetting } from "metabase/visualizations/lib/legend";

import { IconContainer } from "./LegendItem.styled";

const propTypes = {
  icon: PropTypes.shape(iconPropTypes),
};

export default class LegendItem extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  static defaultProps = {
    showDot: true,
    showTitle: true,
    isMuted: false,
    showTooltip: true,
    showDotTooltip: true,
  };

  render() {
    const {
      title,
      color,
      icon,
      showDot,
      showTitle,
      isMuted,
      showTooltip,
      showDotTooltip,
      onMouseEnter,
      onMouseLeave,
      className,
      description,
      onClick,
      infoClassName,
      isNarrow,
    } = this.props;

    return (
      <span
        className={cx(
          className,
          "LegendItem",
          "no-decoration flex align-center fullscreen-normal-text fullscreen-night-text",
          {
            mr1: showTitle,
            muted: isMuted,
            "cursor-pointer": onClick,
          },
        )}
        style={{
          overflowX: "hidden",
          flex: "0 1 auto",
          fontSize: showDot ? 12 : isNarrow ? 14 : 18,
          fontWeight: "normal",
          fontFamily: "Arial,sans-serif",
          alignItems: "center",
          marginRight: description ? 20 : 6,
          color: showDot ? "#84848A" : "#303440",
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {icon && (
          <IconContainer>
            <Icon {...icon} />
          </IconContainer>
        )}
        {showDot && (
          <Tooltip tooltip={title} isEnabled={showTooltip && showDotTooltip}>
            <div
              className={cx("flex-no-shrink", "inline-block")}
              style={{
                ...commonD3LegendSetting(),
                backgroundColor: color,
              }}
            />
          </Tooltip>
        )}
        {showTitle && (
          <div className="flex align-center overflow-hidden">
            <Ellipsified showTooltip={showTooltip}>
              <span
                // className="text-pre-wrap"
                style={{ lineHeight: showDot ? "20px" : "" }}
              >
                {formatTitle(title)}{" "}
              </span>
            </Ellipsified>
            {description && (
              <div className="hover-child ml2 flex align-center text-medium">
                <Tooltip tooltip={description} maxWidth={"22em"}>
                  <Icon className={infoClassName} name="info" />
                </Tooltip>
              </div>
            )}
          </div>
        )}
      </span>
    );
  }
}

LegendItem.propTypes = propTypes;
