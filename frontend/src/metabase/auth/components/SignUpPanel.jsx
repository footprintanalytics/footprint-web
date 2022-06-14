/* eslint-disable react/prop-types */
import React from "react";
import { t } from "ttag";

import validate from "metabase/lib/validate";
import Form from "metabase/containers/Form";

import { Box, Flex } from "grid-styled";
import GoogleButton from "metabase/auth/components/GoogleButton";
import { isDefi360 } from "metabase/lib/project_info";
import WalletLoginButton from "./WalletLoginButton";
import SplitLine from "metabase/components/SplitLine";

const SignUpPanel = ({
  onSubmit,
  show,
  credentials,
  changeToSignIn,
  project,
}) =>
  !show ? (
    <Flex />
  ) : (
    <Flex flexDirection="column">
      <Form onSubmit={onSubmit}>
        {({ Form, FormField, FormSubmit, FormMessage }) => (
          <Form>
            <FormField
              name="email"
              type="email"
              initial={credentials.email || ""}
              title={t`Email Address`}
              placeholder={t`youlooknicetoday@email.com`}
              validate={validate.email()}
              autoFocus
            />
            <FormField
              name="password"
              type="password"
              initial={credentials.password || ""}
              title={t`Password`}
              placeholder={t`please enter password`}
              validate={validate.required()}
            />
            {isDefi360(project) && (
              <FormField
                name="projectName"
                title={t`Project Name`}
                placeholder={t`please enter`}
              />
            )}
            <FormField
              name="name"
              title="Name"
              initial={credentials.name || ""}
              placeholder="please enter name"
              validate={validate
                .required()
                .minLength(2)
                .maxLength(20)
                .checkUserName()}
              normalize={value => value.trim()}
            />
            <Box mt={10} />
            <FormMessage />
            <div className="Form-actions text-centered">
              <FormSubmit className="block full sign-in-button">
                Start for free
              </FormSubmit>
            </div>
          </Form>
        )}
      </Form>
      <div
        className="loginBottomSignButton"
        onClick={e => {
          e.preventDefault();
          changeToSignIn();
        }}
      >
        <div>
          Already a member? <a className="link">Sign in</a>
        </div>
      </div>
      <SplitLine />
      <GoogleButton
        className="loginModalGoogleButton"
        location={location}
        project={project}
        buttonText="Sign up with Google"
      />
      {!isDefi360(project) && (
        <WalletLoginButton
          className="loginModalGoogleButton mt1"
          location={location}
          project={project}
          buttonText="Sign up with Ethereum"
        />
      )}
    </Flex>
  );
export default SignUpPanel;
