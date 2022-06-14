/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { t } from "ttag";

import Button from "metabase/components/Button";

import cx from "classnames";

export default class RunButton extends Component {
  static propTypes = {
    className: PropTypes.string,
    isRunning: PropTypes.bool.isRequired,
    isDirty: PropTypes.bool.isRequired,
    isPreviewing: PropTypes.bool,
    onRun: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
  };

  static defaultProps = {};

  render() {
    const {
      isRunning,
      isDirty,
      isPreviewing,
      onRun,
      onCancel,
      className,
      compact,
      circular,
      hidden,
      ...props
    } = this.props;
    let buttonText = null;
    let buttonIcon = null;
    if (isRunning) {
      buttonIcon = "close";
      if (!compact) {
        buttonText = t`Cancel`;
      }
    } else if (isDirty) {
      if (compact) {
        buttonIcon = "play";
      } else {
        buttonText = isPreviewing ? t`Get Preview` : t`Get Answer`;
      }
    } else {
      buttonIcon = "refresh";
    }
    return (
      <Button
        {...props}
        onlyIcon
        iconColor="#ACACB2"
        icon={buttonIcon}
        iconSize={16}
        className={`ml1 Question-header-btn ${cx(className, "RunButton", {
          "RunButton--hidden": hidden,
          "RunButton--compact": circular && !props.borderless && compact,
          circular: circular,
        })}`}
        onClick={isRunning ? onCancel : onRun}
      >
        {buttonText}
      </Button>
    );
  }
}
