/* eslint-disable react/prop-types */
import React from "react";
import { jt, t } from "ttag";
import Form from "metabase/containers/Form";

import { Flex } from "grid-styled";
import Icon from "metabase/components/Icon";
import MetabaseSettings from "metabase/lib/settings";
import Link from "metabase/components/Link";
import Users from "metabase/entities/users";

const ResetPasswordPanel = ({
  show,
  backToLoginIn,
  onSubmit,
  tokenValid,
  resetSuccess,
  backToForgotPassword,
}) => {
  const passwordComplexity = MetabaseSettings.passwordComplexityDescription();
  const requestLink = (
    <Link className="link" onClick={backToForgotPassword}>
      {t`request a new reset email`}
    </Link>
  );
  return !show ? (
    <Flex />
  ) : (
    <Flex justifyContent="center" flexDirection="column">
      {tokenValid === undefined ? (
        <div />
      ) : !tokenValid ? (
        <div>
          <h3>{t`Whoops, that's an expired link`}</h3>
          <p>
            {jt`For security reasons, password reset links expire after a little while. If you still need to reset your password, you can ${requestLink}.`}
          </p>
        </div>
      ) : (
        <div>
          {!resetSuccess ? (
            <div>
              <p className="text-medium mb4">{t`To keep your data secure, passwords ${passwordComplexity}`}</p>
              <Form
                onSubmit={onSubmit}
                form={Users.forms.password_reset}
                submitTitle={t`Save new password`}
              />
            </div>
          ) : (
            <div className="SuccessGroup bg-white bordered rounded shadowed">
              <div className="SuccessMark">
                <Icon name="check" />
              </div>
              <p>{t`Your password has been reset.`}</p>
              <p>
                <Link
                  className="Button Button--primary"
                  onClick={backToLoginIn}
                >{t`Sign in with your new password`}</Link>
              </p>
            </div>
          )}
        </div>
      )}

      <Link
        onClick={backToLoginIn}
        style={{ margin: "30px auto 0px", padding: "10px" }}
      >
        Go back
      </Link>
    </Flex>
  );
};

export default ResetPasswordPanel;
