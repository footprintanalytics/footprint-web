/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import User from "metabase/entities/users";
import { connect } from "react-redux";
import { refreshCurrentUser } from "metabase/redux/user";

const propTypes = {
  user: PropTypes.object,
  loadUserInfo: PropTypes.func,
};

const UserProfileForm = ({ user, loadUserInfo, router }) => {
  /*const handleSaved = useCallback(
    ({ locale }) => {
      if (locale !== user.locale) {
        window.location.reload();
      }
    },
    [user],
  );*/

  const handleSaved = async () => {
    await loadUserInfo();
    router.replace(`/@${user.name}`);
  };
  const isPaidUser = user && user.vipInfo && user.vipInfo.type !== "free";

  return (
    <User.Form
      user={user}
      form={isPaidUser ? User.forms.vipUser : User.forms.user}
      onSaved={handleSaved}
    />
  );
};

UserProfileForm.propTypes = propTypes;

const mapDispatchToProps = dispatch => ({
  loadUserInfo: () => dispatch(refreshCurrentUser()),
});

export default connect(null, mapDispatchToProps)(UserProfileForm);
