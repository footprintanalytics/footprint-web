/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import "./LoginModalSlider.css";
import { message } from "antd";
import Icon from "metabase/components/Icon";
import SignInPanel from "metabase/auth/components/SignInPanel";
import SignUpPanel from "metabase/auth/components/SignUpPanel";
import VerifyEmailPanel from "metabase/auth/components/VerifyEmailPanel";
import ForgotPasswordPanel from "metabase/auth/components/ForgotPasswordPanel";
import ResetPasswordPanel from "metabase/auth/components/ResetPasswordPanel";
import { SessionApi } from "metabase/services";
import { quickRegister, quickRegisterDefi360 } from "metabase/new-service";
import { trackStructEvent } from "metabase/lib/analytics";
import Settings from "metabase/lib/settings";
import { isDefi360 } from "metabase/lib/project_info";

const LoginModalInner = props => {
  const ldapEnabled = Settings.isLdapEnabled();
  const [signTabState, setSignTabState] = useState(
    props.signTabState || "signIn",
  );
  const [email, setEmail] = useState("");
  const [signUpCredentials, setSignUpCredentials] = useState({});
  const [sentNotification, setSentNotification] = useState(false);
  const [tokenValid, setTokenValid] = useState(undefined);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [project, setProject] = useState("footprint");
  const quickRegisterApi = isDefi360(project)
    ? quickRegisterDefi360
    : quickRegister;

  const {
    onClose,
    login,
    location,
    loginState,
    token,
    user,
    channel,
    hideClose,
    redirect,
  } = props;

  const disableCheckLogin =
    props.disableCheckLogin || location.query.disableCheckLogin;

  useEffect(() => {
    if (props.project) {
      setProject(props.project);
    }
  }, [props.project]);

  useEffect(() => {
    if (user && !disableCheckLogin) {
      onClose && onClose();
    }
  }, [user, onClose, disableCheckLogin]);

  useEffect(() => {
    if (loginState) {
      setSignTabState(loginState);
    }
  }, [loginState]);

  useEffect(() => {
    const handleToken = async token => {
      try {
        const result = await SessionApi.password_reset_token_valid({
          token: token,
        });
        setTokenValid(result && result.valid);
      } catch (error) {
        console.log("error validating token", error);
      }
    };
    if (token) {
      handleToken(token).then();
    }
  }, [token]);

  const onCloseAction = () => {
    setSignTabState("signIn");
    onClose && onClose();
  };

  const isSignUp = () => {
    return signTabState === "signUp";
  };

  const isVerifyEmail = () => {
    return signTabState === "verifyEmail";
  };

  const isForgotPassword = () => {
    return signTabState === "forgotPassword";
  };

  const isResetPassword = () => {
    return signTabState === "resetPassword";
  };

  const isSignIn = () => {
    return !(
      isSignUp() ||
      isForgotPassword() ||
      isResetPassword() ||
      isVerifyEmail()
    );
  };

  const onSignInSubmit = async credentials => {
    await login(credentials, redirect || location.query.redirect);
    onCloseAction();
  };

  const getChannel = () => {
    //moon-men page register is channel moon-men
    if (location?.pathname === "/moon-men") {
      return { channel: "moon-men" };
    }
    return channel.length > 0 ? { channel } : {};
  };

  const getRedirect = () => {
    const redirectStr = redirect || location.query.redirect;
    return redirectStr ? { redirect: redirectStr } : {};
  };

  const onSignUpSubmit = async credentials => {
    const credentialsConfirm = {
      ...getChannel(),
      ...getRedirect(),
      ...credentials,
    };
    let hide;
    if (isVerifyEmail()) {
      hide = message.loading("loading...", 0);
    }
    await quickRegisterApi(credentialsConfirm);
    hide && hide();
    if (isVerifyEmail()) {
      message.success("The email resent...");
    }
    setSignUpCredentials(credentialsConfirm);
    changeToVerifyEmail();
  };

  const onForgotPasswordSubmit = async values => {
    await SessionApi.forgot_password(values);
    setSentNotification(true);
  };

  const onResetPasswordSubmit = async ({ password }) => {
    await SessionApi.reset_password({
      token: token,
      password: password,
    });
    trackStructEvent("Auth", "Password Reset");
    setResetSuccess(true);
  };

  const changeToSignUp = () => {
    setSignTabState("signUp");
  };

  const changeToVerifyEmail = () => {
    setSignTabState("verifyEmail");
  };

  const changeToForgotPassword = credentials => {
    if (credentials) {
      setEmail(credentials.email);
    }
    setSentNotification(false);
    setSignTabState("forgotPassword");
  };

  const changeToSignIn = () => {
    setSignTabState("signIn");
  };

  const title = () => {
    if (isSignUp()) {
      return "Sign up";
    }
    if (isVerifyEmail()) {
      return "Verify email";
    }
    if (isForgotPassword()) {
      return "Forgot password";
    }
    if (isResetPassword()) {
      return "New password";
    }
    return "Sign in";
  };
  return (
    <div className="flex-full" style={{ flex: 1 }}>
      {!hideClose && (
        <div className="loginModalClose" onClick={onCloseAction}>
          <Icon name="close" />
        </div>
      )}
      <div className="flex flex-column loginModalInner">
        <div className="NavTitleActive">{title()}</div>
        <div className="mt2" />
        <SignInPanel
          show={isSignIn()}
          email={email}
          ldapEnabled={ldapEnabled}
          rememberMeDisabled={true}
          onSubmit={onSignInSubmit}
          changeToResetPassword={changeToForgotPassword}
          changeToSignUp={changeToSignUp}
          project={project}
          channel={getChannel()}
          redirect={redirect}
          hideClose={hideClose}
        />
        <SignUpPanel
          show={isSignUp()}
          onSubmit={onSignUpSubmit}
          changeToSignIn={changeToSignIn}
          credentials={signUpCredentials}
          project={project}
          redirect={redirect}
        />
        <VerifyEmailPanel
          show={isVerifyEmail()}
          resendAction={() => onSignUpSubmit(signUpCredentials)}
          backToLoginIn={changeToSignUp}
        />
        <ForgotPasswordPanel
          show={isForgotPassword()}
          backToLoginIn={changeToSignIn}
          email={email}
          onSubmit={onForgotPasswordSubmit}
          sentNotification={sentNotification}
        />
        <ResetPasswordPanel
          show={isResetPassword()}
          backToLoginIn={changeToSignIn}
          email={email}
          onSubmit={onResetPasswordSubmit}
          tokenValid={tokenValid}
          resetSuccess={resetSuccess}
          backToForgotPassword={changeToForgotPassword}
        />
      </div>
    </div>
  );
};

export default LoginModalInner;
