/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Icon from "metabase/components/Icon";
import { capitalize } from "humanize-plus";
import { t } from "ttag";
import cx from "classnames";

const propTypes = {
  provider: PropTypes.string,
  onClick: PropTypes.func,
};

class AuthProviderButton extends Component {
  render() {
    const { provider, onClick, className, buttonText } = this.props;
    return (
      <div
        className={cx(
          "relative z2 bg-white p2 cursor-pointer text-centered sm-text-left bordered flex",
          className,
        )}
        onClick={onClick}
      >
        <div className="flex align-center ml-auto mr-auto">
          {provider && <Icon className="mr1" name={provider} size={16} />}
          <span>
            {buttonText
              ? buttonText
              : provider
              ? t`Sign in with ${capitalize(provider)}`
              : t`Sign in`}
          </span>
        </div>
      </div>
    );
  }
}

AuthProviderButton.proptypes = propTypes;

export default AuthProviderButton;
