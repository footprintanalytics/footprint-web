/* eslint-disable react/prop-types */
import React from "react";
import { t } from "ttag";

import { message } from "antd";
import { entries, get, mapValues, omit } from "lodash";
import { Link } from "react-router";
import validate from "metabase/lib/validate";
import Form from "metabase/containers/Form";

import GoogleButton from "metabase/auth/containers/GoogleButton";
import { isDefi360 } from "metabase/lib/project_info";
import SplitLine from "metabase/components/SplitLine";
import WalletLoginButton from "./WalletLoginButton";

const ForgotPasswordLink = ({ credentials = {}, changeToResetPassword }) => (
  <Link
    className="text-light"
    onClick={e => {
      changeToResetPassword && changeToResetPassword(credentials);
      window.OSX ? window.OSX.resetPassword() : null;
    }}
  >
    <div className="forgotPassword">
      Forgot your password <span className="link">Reset</span>
    </div>
  </Link>
);

const SignInPanel = ({
  ldapEnabled,
  email,
  rememberMeDisabled,
  onSubmit,
  show,
  initEmail,
  changeToResetPassword,
  changeToSignUp,
  project,
  channel,
  redirect,
}) => {
  const ref = React.createRef();
  const onkeydown = async e => {
    if (e.keyCode === 13) {
      const { password, username } = ref?.current?.context?.fields;
      if (username.error) {
        message.error(`email: ${username.error}`);
        return;
      }
      if (password.error) {
        message.error(`password: ${password.error}`);
        return;
      }
      const hide = message.loading("Loading...", 0);
      try {
        await onSubmit(
          omit(mapValues(ref?.current?.context?.fields, "value"), ["id"]),
        );
      } catch (e) {
        const errors = e?.data?.errors;
        const error = get(entries(errors), 0);
        if (error) {
          message.error(error.join(": "));
        }
      } finally {
        hide();
      }
    }
  };
  return !show ? (
    <div />
  ) : (
    <div className="flex flex-column">
      <Form onSubmit={onSubmit}>
        {({ values, Form, FormField, FormSubmit, FormMessage }) => (
          <Form>
            <FormField
              ref={ref}
              name="username"
              type={ldapEnabled ? "input" : "email"}
              initial={email && email.length > 0 ? email : initEmail}
              title={
                ldapEnabled ? t`Username or email address` : t`Email address`
              }
              placeholder={t`youlooknicetoday@email.com`}
              validate={ldapEnabled ? validate.required() : validate.email()}
              onKeyDown={e => onkeydown(e)}
              autoFocus
            />
            <FormField
              name="password"
              type="password"
              title={t`Password`}
              placeholder={t`password...`}
              validate={validate.required()}
              onKeyDown={e => onkeydown(e)}
            />
            <div className="flex justify-between">
              <div className="flex">
                <FormField
                  className={"flex flex-reverse text-centered align-baseline"}
                  name="remember"
                  type="checkbox"
                  initial={true}
                  hidden={rememberMeDisabled}
                  horizontal
                />
                {!rememberMeDisabled && (
                  <span
                    style={{
                      marginTop: "-4px",
                      marginLeft: "10px",
                    }}
                  >
                    {t`Remember me`}
                  </span>
                )}
              </div>
              <ForgotPasswordLink
                credentials={values}
                changeToResetPassword={changeToResetPassword}
              />
            </div>
            <FormMessage />
            <div className="mt4" />
            <div className="Form-actions text-centered">
              <FormSubmit className="block full sign-in-button">{t`Sign in`}</FormSubmit>
            </div>
          </Form>
        )}
      </Form>
      <div
        className="loginBottomSignButton"
        onClick={e => {
          e.preventDefault();
          changeToSignUp();
        }}
      >
        <div>
          Not a member yet? <a className="link">Sign up</a>
        </div>
      </div>
      <SplitLine />
      <GoogleButton
        className="loginModalGoogleButton"
        location={location}
        channel={channel}
        project={project}
        redirect={redirect}
        buttonText="Sign in with Google"
        isCard
      />
      {!isDefi360(project) && (
        <WalletLoginButton
          className="loginModalGoogleButton mt1"
          location={location}
          channel={channel}
          project={project}
          redirect={redirect}
          buttonText="Sign in with Ethereum"
        />
      )}
    </div>
  );
};
export default SignInPanel;
