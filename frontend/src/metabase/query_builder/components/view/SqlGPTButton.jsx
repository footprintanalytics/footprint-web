/* eslint-disable react/prop-types */
import React from "react";
import { t } from "ttag";
import cx from "classnames";
import Tooltip from "metabase/components/Tooltip";
import Button from "metabase/core/components/Button";
import { trackStructEvent } from "metabase/lib/analytics";

const SqlGPTButton = ({ isShowingSqlGPTSidebar, toggleSqlGPT, size = 16 }) => {

  return (
    <Tooltip tooltip={t`SQL explore`}>
      <Button
        className={cx(`ml1 Question-header-btn-new`, {
          "Question-header-btn--primary": isShowingSqlGPTSidebar,
        })}
        onlyIcon
        iconColor="#7A819B"
        iconSize={size}
        onClick={() => {
          trackStructEvent("SqlGPTButton");
          toggleSqlGPT();
        }}
      >
        SQL explore
      </Button>
    </Tooltip>
  );
};

export default SqlGPTButton;
