/* eslint-disable react/prop-types */
import React from "react";

import { IconWrapper } from "metabase/components/Icon";
import Tooltip from "metabase/components/Tooltip";
import LogoIcon from "metabase/components/LogoIcon";

const EntitySideMenuTrigger = ({ onClick, open, tooltip, triggerProps }) => {
  const trigger = (
    <IconWrapper onClick={onClick} {...triggerProps}>
      <LogoIcon dark height={32}>
        Footprint
      </LogoIcon>
    </IconWrapper>
  );
  return tooltip ? (
    <Tooltip tooltip={tooltip} isEnabled={!open}>
      {trigger}
    </Tooltip>
  ) : (
    trigger
  );
};

export default EntitySideMenuTrigger;
