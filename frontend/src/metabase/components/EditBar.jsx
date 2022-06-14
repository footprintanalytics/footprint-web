/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import Icon from "metabase/components/Icon";

class EditBar extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    buttons: PropTypes.oneOfType([PropTypes.element, PropTypes.array])
      .isRequired,
    admin: PropTypes.bool,
  };

  static defaultProps = {
    admin: false,
  };

  render() {
    const { admin, buttons, subtitle, title, style } = this.props;

    return (
      <div
        className={cx(
          "EditHeader wrapper py1 flex align-center html2canvas-filter",
          {
            "EditHeader--admin": admin,
          },
        )}
        style={style}
      >
        <span className="EditHeader-title">
          <Icon
            name="edit_editbar"
            size={14}
            style={{ color: "#ACACB2", marginRight: "4px" }}
          />{" "}
          {title}
        </span>
        {subtitle && (
          <span className="EditHeader-subtitle mx1">{subtitle}</span>
        )}
        <span className="flex-align-right flex">{buttons}</span>
      </div>
    );
  }
}

export default EditBar;
