/* eslint-disable react/prop-types */
import React from "react";
import { t } from "ttag";

import validate from "metabase/lib/validate";
import Form from "metabase/containers/Form";

import { Box, Flex } from "grid-styled";
import BackToLogin from "metabase/auth/components/BackToLogin";
import Icon from "metabase/components/Icon";
import MetabaseSettings from "metabase/lib/settings";

const ForgotPasswordPanel = ({
  ldapEnabled,
  email,
  show,
  backToLoginIn,
  sentNotification,
  onSubmit,
}) => {
  const emailConfigured = MetabaseSettings.isEmailConfigured();
  const canResetPassword = emailConfigured && !ldapEnabled;

  return !show ? (
    <Flex />
  ) : (
    <Flex justifyContent="center" flexDirection="column">
      <Box mt={30} />
      {!canResetPassword ? (
        <div>
          <h3 className="my4">{t`Please contact an administrator to have them reset your password`}</h3>
          <BackToLogin />
        </div>
      ) : (
        <div>
          {!sentNotification ? (
            <div>
              <Form onSubmit={onSubmit}>
                {({ Form, FormField, FormSubmit }) => (
                  <Form>
                    <FormField
                      name="email"
                      type={"email"}
                      initial={email && email.length > 0 ? email : ""}
                      title={"Email address"}
                      placeholder={t`The email you use for your Footprint account`}
                      validate={validate.email()}
                      autoFocus
                    />
                    <div className="Form-actions text-centered">
                      <FormSubmit className="block full mb2">{t`Send password reset email`}</FormSubmit>
                    </div>
                  </Form>
                )}
              </Form>
            </div>
          ) : (
            <div>
              <div className="SuccessGroup bg-white bordered rounded shadowed">
                <div className="SuccessMark">
                  <Icon name="check" />
                </div>
                <p className="SuccessText">{t`Check your email for instructions on how to reset your password.`}</p>
              </div>
            </div>
          )}
        </div>
      )}
      <div
        onClick={backToLoginIn}
        style={{ margin: "30px auto 0px", padding: "10px" }}
      >
        <a>Back to login in</a>
      </div>
    </Flex>
  );
};

export default ForgotPasswordPanel;
