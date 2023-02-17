/* eslint-disable react/prop-types */
import React from "react";
import cx from "classnames";
import Tooltip from "metabase/components/Tooltip";
import PopoverWithTrigger from "metabase/components/PopoverWithTrigger";
import Button from "metabase/core/components/Button";
import Panel from "metabase/components/GlobalContactPanel/components/panel";

const HelpPanel = () => {
  return (
    <PopoverWithTrigger
      triggerElement={
        <Tooltip tooltip={"Help"}>
          <Button
            onlyIcon
            className="Question-header-btn"
            iconColor="#7A819B"
            icon="help_center"
            iconSize={18}
          />
        </Tooltip>
      }
      triggerClasses={cx("mx1 hide sm-show", "text-brand-hover")}
    >
      <Panel style={{ marginRight: -23, marginBottom: 8 }}/>
    </PopoverWithTrigger>
  );
};

export default HelpPanel;
