/* eslint-disable react/prop-types */
import React from "react";
import { t } from "ttag";
import Tooltip from "metabase/components/Tooltip";
import Button from "metabase/components/Button";
import { connect } from "react-redux";
import { setDarkMode } from "metabase/redux/control";
import { getDarkMode } from "metabase/selectors/control";
import cx from "classnames";

const DarkModeButton = ({ darkMode, setDarkMode }) => (
  <Tooltip tooltip={t`Dark mode`}>
    <Button
      className={cx(`ml1 Question-header-btn`, {
        "Question-header-btn--primary": darkMode,
      })}
      iconColor="#7A819B"
      icon="dark_mode"
      iconSize={16}
      onClick={() => {
        setDarkMode(!darkMode);
      }}
    />
  </Tooltip>
);

const mapStateToProps = state => ({
  darkMode: getDarkMode(state),
});

const mapDispatchToProps = {
  setDarkMode,
};

export default connect(mapStateToProps, mapDispatchToProps)(DarkModeButton);
