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
}) => {
  return !show ? (
    <Flex />
  ) : (
    <Flex flexDirection="column">
      <Form onSubmit={onSubmit}>
        {({ values, Form, FormField, FormSubmit, FormMessage }) => (
          <Form>
            <FormField
              name="username"
              type={ldapEnabled ? "input" : "email"}
              initial={email && email.length > 0 ? email : initEmail}
              title={
                ldapEnabled ? t`Username or email address` : t`Email address`
              }
              placeholder={t`youlooknicetoday@email.com`}
              validate={ldapEnabled ? validate.required() : validate.email()}
              autoFocus
            />
            <FormField
              name="password"
              type="password"
              title={t`Password`}
              placeholder={t`password...`}
              validate={validate.required()}
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
        buttonText="Sign in with Google"
      />
      {!isDefi360(project) && (
        <WalletLoginButton
          className="loginModalGoogleButton mt1"
          location={location}
          project={project}
          buttonText="Sign in with Ethereum"
        />
      )}
    </Flex>
  );
};
export default SignInPanel;
