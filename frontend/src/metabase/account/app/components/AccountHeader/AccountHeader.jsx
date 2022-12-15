import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { t } from "ttag";
import Radio from "metabase/core/components/Radio";
import { getFullName } from "metabase/lib/user";
import { PLUGIN_IS_PASSWORD_USER } from "metabase/plugins";
import Link from "metabase/core/components/Link";
import {
  AccountHeaderRoot,
  HeaderAvatar,
  HeaderSection,
  HeaderTitle,
  HeaderSubtitle,
} from "./AccountHeader.styled";
import "./AccountHeader.css";

const propTypes = {
  user: PropTypes.object.isRequired,
  path: PropTypes.string,
  onChangeLocation: PropTypes.func,
};

const AccountHeader = ({ user, path, onChangeLocation }) => {
  const hasPasswordChange = useMemo(
    () => PLUGIN_IS_PASSWORD_USER.every(predicate => predicate(user)),
    [user],
  );

  const tabs = useMemo(
    () => [
      { name: t`Profile`, value: "/account/profile" },
      ...(hasPasswordChange
        ? [{ name: t`Password`, value: "/account/password" }]
        : []),
      { name: t`Developer`, value: "/account/developer" },
      // { name: t`Login History`, value: "/account/login-history" },
      { name: t`Notifications`, value: "/account/notifications" },
    ],
    [hasPasswordChange],
  );

  const userFullName = getFullName(user);

  return (
    <AccountHeaderRoot data-testid="account-header">
      {/*<HeaderSection>
        <HeaderAvatar user={user} />
        {userFullName && <HeaderTitle>{userFullName}</HeaderTitle>}
        <HeaderSubtitle>{user.email}</HeaderSubtitle>
      </HeaderSection>*/}
      <Link to={`/@${user.name}`} target="_blank">
        <div className="AccountHeader__avatar">
          {user.avatar ? (
            <img
              className="AccountHeader__avatar-img"
              src={
                user.avatar + "?x-oss-process=image/resize,m_fill,h_120,w_120"
              }
            />
          ) : (
            <HeaderAvatar user={user} />
          )}
          <h3 className="AccountHeader__avatar-h3">{user.name}</h3>
        </div>
        {/* <HeaderSection>
          <HeaderAvatar user={user} />
          <HeaderTitle>{t`Account settings`}</HeaderTitle>
        </HeaderSection> */}
      </Link>
      <Radio
        value={path}
        variant="underlined"
        options={tabs}
        onChange={onChangeLocation}
      />
    </AccountHeaderRoot>
  );
};

AccountHeader.propTypes = propTypes;

export default AccountHeader;
