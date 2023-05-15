/* eslint-disable react/prop-types */
import React from "react";
import { t } from "ttag";
import cx from "classnames";
import Tooltip from "metabase/components/Tooltip";
import Button from "metabase/core/components/Button";
import { trackStructEvent } from "metabase/lib/analytics";

const SqlGPTButton = ({ isShowingSqlGPTSidebar, toggleSqlGPT, size = 16 }) => {

  return (
    <Tooltip tooltip={t`SQL Assistant`}>
      <Button
        className={cx(`ml1 Question-header-btn`, {
          "Question-header-btn--primary": isShowingSqlGPTSidebar,
        })}
        icon="gpt"
        iconColor="#7A819B"
        iconSize={size}
        onClick={() => {
          trackStructEvent("SqlGPTButton");
          toggleSqlGPT();
        }}
      />

    </Tooltip>
  );
};

export default SqlGPTButton;
