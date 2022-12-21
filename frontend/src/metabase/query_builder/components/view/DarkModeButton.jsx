/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import cx from "classnames";
import Tooltip from "metabase/components/Tooltip";
import Button from "metabase/core/components/Button";
import { setDarkMode } from "metabase/redux/control";
import { getDarkMode } from "metabase/selectors/control";
import { trackStructEvent } from "metabase/lib/analytics";

const DarkModeButton = ({ darkMode, setDarkMode, size=16 }) => (
  <Tooltip tooltip={darkMode ? "Light mode" : "Dark mode"}>
    <Button
      className={cx(`ml1 Question-header-btn`, {
        "Question-header-btn--primary": darkMode,
      })}
      iconColor="#7A819B"
      icon="dark_mode"
      iconSize={size}
      onClick={() => {
        trackStructEvent("DarkModeButton")
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
