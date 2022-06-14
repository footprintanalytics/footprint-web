/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { t } from "ttag";
import { connect } from "react-redux";
import Form from "metabase/containers/Form";
import validate from "metabase/lib/validate";
import AuthLayout from "metabase/auth/components/AuthLayout";
import { regist, getRegistEmail } from "../auth";
import { Flex } from "grid-styled";
import { Link } from "react-router";

const mapDispatchToProps = { regist, getRegistEmail };

function RegisterForm(props) {
  const [verification, setVerification] = useState(false);

  const onSubmit = async credentials => {
    const { regist, getRegistEmail, location } = props;
    if (verification) {
      await regist(credentials, location.query.redirect);
      return;
    }
    await getRegistEmail(credentials);
    setVerification(true);
  };

  return (
    <AuthLayout>
      <h2 className="text-centered mb3">Regist to Footprint</h2>
      <Form onSubmit={onSubmit}>
        {({ Form, FormField, FormSubmit, FormMessage }) => (
          <Form>
            <FormField
              name="email"
              type="email"
              title={t`Email address`}
              placeholder={t`youlooknicetoday@email.com`}
              validate={validate.email()}
              autoFocus
            />
            {!verification && (
              <Flex flex={1} justifyContent="space-between" alignItems="center">
                <FormField
                  name="password"
                  type="password"
                  title={t`Password`}
                  placeholder={t`Shhh...`}
                  validate={validate.required()}
                />
                <FormField
                  name="password_confirm"
                  type="password"
                  title={t`Confirm your password`}
                  placeholder={t`Shhh...`}
                  validate={(password_confirm, { values: { password } = {} }) =>
                    (!password_confirm && t`required`) ||
                    (password_confirm !== password && t`passwords do not match`)
                  }
                />
              </Flex>
            )}

            {!verification && (
              <Flex flex={1} justifyContent="space-between" alignItems="center">
                <FormField
                  name="firstName"
                  title="First Name"
                  placeholder="please enter"
                  validate={validate.required()}
                />
                <FormField
                  name="lastName"
                  title="Last Name"
                  placeholder="please enter"
                  validate={validate.required()}
                />
              </Flex>
            )}

            {verification && (
              <FormField
                name="emailCode"
                title="Email Code"
                placeholder="please enter"
                validate={validate.required()}
                autoFocus
              />
            )}

            <FormMessage />
            <div className="Form-actions text-centered">
              <FormSubmit className="block full mb2">
                {verification ? "Confirm" : "Register"}
              </FormSubmit>
              {verification ? (
                <Link
                  className="text-light text-brand-hover"
                  onClick={e => setVerification(false)}
                >
                  Go Back
                </Link>
              ) : (
                <SignInLink />
              )}
            </div>
          </Form>
        )}
      </Form>
    </AuthLayout>
  );
}

const SignInLink = () => (
  <Flex alignItems="center" justifyContent="center">
    <span className="text-light">Already have an account?</span>
    <Link to="/auth/login" className="text-brand text-brand-hover">
      {"\u00A0"}Sign in
    </Link>
  </Flex>
);

export default connect(null, mapDispatchToProps)(RegisterForm);
