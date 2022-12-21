/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { t } from "ttag";
import cx from "classnames";
import Tooltip from "metabase/components/Tooltip";
import Button from "metabase/core/components/Button";
import { trackStructEvent } from "metabase/lib/analytics";

const SqlOptimizeButton = ({ isShowingSqlOptimizeSidebar, toggleSqlOptimize, size=16 }) => (
  <Tooltip tooltip={t`How to query faster`}>
    <Button
      className={cx(`ml1 Question-header-btn-new`, {
        "Question-header-btn--primary": isShowingSqlOptimizeSidebar,
      })}
      onlyIcon
      iconColor="#7A819B"
      iconSize={size}
      onClick={() => {
        trackStructEvent("SqlOptimizeButton")
        toggleSqlOptimize()
      }}
    >
      SQL optimize
    </Button>
  </Tooltip>
);

const mapStateToProps = state => ({
  // showSqlOptimize: isShowingSqlOptimizeSidebar(state),
});

const mapDispatchToProps = {
  // setShowSqlOptimize,
};

export default connect(mapStateToProps, mapDispatchToProps)(SqlOptimizeButton);
