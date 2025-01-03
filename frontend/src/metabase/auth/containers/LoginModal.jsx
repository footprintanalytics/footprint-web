import React from "react";
import connect from "react-redux/lib/connect/connect";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import cx from "classnames";
import ModalContent from "metabase/components/ModalContent";
import Modal from "metabase/components/Modal";
import {
  getRegistEmail,
  login,
  loginGoogle,
  regist,
} from "metabase/auth/actions";
import LoginModalSlider from "metabase/auth/components/LoginModalSlider";
import { getUser } from "metabase/home/selectors";
import { getChannel } from "metabase/selectors/app";
import LoginModalInner from "metabase/auth/components/LoginModalInner";
import { trackStructEvent } from "metabase/lib/analytics";
import { isDark } from "metabase/dashboard/components/utils/dark";

const mapStatusToProps = (state, props) => {
  const isFga = props.location.pathname.includes("/growth/");
  return {
    from: localStorage.getItem("login-modal-from") || "",
    loginState: props.fromNav ? undefined : props.location.query.loginState,
    token: props.location.query.token,
    user: getUser(state),
    channel: isFga ? "FGA" : getChannel(state) || "homepage",
    project: props.project || props.location.query.project || "footprint",
    hideClose: props.hideClose,
    signTabState: props.signTabState,
  };
};

const mapDispatchToProps = { login, regist, getRegistEmail, loginGoogle };

const LoginModal = props => {
  const { isOpen = false, fromNav = false, from = "", showLeftSlider = true } = props;

  const InnerPanel = () => {
    trackStructEvent("ShowLoginModal", from);
    return (
      <ModalContent>
        <div className="flex loginModalContent rounded overflow-hidden">
          {showLeftSlider && (<LoginModalSlider {...props} />)}
          <LoginModalInner {...props} />
        </div>
      </ModalContent>
    );
  };

  return fromNav ? (
    isOpen ? (
      <Modal className={cx("loginModalRoot", { "dark": isDark() })} ModalClass="z-index-top">
        <InnerPanel {...props} />
      </Modal>
    ) : (
      <React.Fragment />
    )
  ) : (
    <InnerPanel {...props} />
  );
};

LoginModal.propTypes = {
  open: PropTypes.bool,
  public_uuid: PropTypes.string,
  type: PropTypes.string,
  token: PropTypes.string,
  redirect: PropTypes.string,
  from: PropTypes.string,
  isOpen: PropTypes.bool,
  fromNav: PropTypes.bool,
  defaultRegister: PropTypes.bool,
  showLeftSlider: PropTypes.bool,
};

export default withRouter(
  connect(mapStatusToProps, mapDispatchToProps)(LoginModal),
);
