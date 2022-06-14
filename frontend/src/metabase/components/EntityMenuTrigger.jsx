/* eslint-disable react/prop-types */
import React from "react";

import Icon, { IconWrapper } from "metabase/components/Icon";
import Tooltip from "metabase/components/Tooltip";
import UserAvatar from "metabase/components/UserAvatar";
import VipIcon from "metabase/components/VipIcon";

const EntityMenuTrigger = ({
  icon,
  onClick,
  open,
  tooltip,
  triggerProps,
  user,
  homeSetting,
}) => {
  const trigger = (
    <IconWrapper onClick={onClick} {...triggerProps}>
      {homeSetting ? (
        <div className="relative" style={{ padding: 10 }}>
          <UserAvatar user={user} size={["2.5em", "2.5em"]} />
          <div className="absolute right bottom mb1" style={{ marginRight: 2 }}>
            <VipIcon user={user} />
          </div>
        </div>
      ) : (
        <Icon size={18} name={icon} m={1} />
      )}
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

export default EntityMenuTrigger;
