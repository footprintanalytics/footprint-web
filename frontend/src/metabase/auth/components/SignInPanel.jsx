/* eslint-disable react/prop-types */
import React from "react";
import { t } from "ttag";

import validate from "metabase/lib/validate";
import Form from "metabase/containers/Form";

import { Box, Flex } from "grid-styled";
import { Link } from "react-router";
import GoogleButton from "metabase/auth/components/GoogleButton";
import WalletLoginButton from "./WalletLoginButton";
import { isDefi360 } from "metabase/lib/project_info";
import SplitLine from "metabase/components/SplitLine";
import { message } from "antd";
import { entries, get, mapValues, omit } from "lodash";

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
  redirect,
}) => {
  const ref = React.createRef();
  const onkeydown = async e => {
    if (e.keyCode === 13) {
      console.log("ref?.current", ref?.current);
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
    <Flex />
  ) : (
    <Flex flexDirection="column">
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
            <Flex justifyContent="space-between">
              <Flex>
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
              </Flex>
              <ForgotPasswordLink
                credentials={values}
                changeToResetPassword={changeToResetPassword}
              />
            </Flex>
            <FormMessage />
            <Box mt={30} />
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
        project={project}
        redirect={redirect}
        buttonText="Sign in with Google"
      />
      {!isDefi360(project) && (
        <WalletLoginButton
          className="loginModalGoogleButton mt1"
          location={location}
          project={project}
          redirect={redirect}
          buttonText="Sign in with Ethereum"
        />
      )}
    </Flex>
  );
};
export default SignInPanel;
