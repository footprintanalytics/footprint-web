/* eslint-disable react/prop-types */
import React from "react";
import { t } from "ttag";

import { entries, get, mapValues, omit } from "lodash";
import { message } from "antd";
import validate from "metabase/lib/validate";
import Form from "metabase/containers/Form";

import GoogleButton from "metabase/auth/components/GoogleButton";
import { isDefi360 } from "metabase/lib/project_info";
import SplitLine from "metabase/components/SplitLine";
import WalletLoginButton from "./WalletLoginButton";

const SignUpPanel = ({
  onSubmit,
  show,
  credentials,
  changeToSignIn,
  project,
  redirect,
}) => {
  const ref = React.createRef();
  const onkeydown = async e => {
    if (e.keyCode === 13) {
      const { password, email, name } = ref?.current?.context?.fields;
      if (email.error) {
        message.error(`email: ${email.error}`);
        return;
      }
      if (password.error) {
        message.error(`password: ${password.error}`);
        return;
      }
      if (name.error) {
        message.error(`name: ${name.error}`);
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
        {({ Form, FormField, FormSubmit, FormMessage }) => (
          <Form>
            <FormField
              ref={ref}
              name="email"
              type="email"
              initial={credentials.email || ""}
              title={t`Email Address`}
              placeholder={t`youlooknicetoday@email.com`}
              validate={validate.email()}
              onKeyDown={e => onkeydown(e)}
              autoFocus
            />
            <FormField
              name="password"
              type="password"
              initial={credentials.password || ""}
              title={t`Password`}
              placeholder={t`please enter password`}
              validate={validate.required()}
              onKeyDown={e => onkeydown(e)}
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
              onKeyDown={e => onkeydown(e)}
            />
            <div className="mt2"/>
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
        redirect={redirect}
        buttonText="Sign up with Google"
      />
      {!isDefi360(project) && (
        <WalletLoginButton
          className="loginModalGoogleButton mt1"
          location={location}
          project={project}
          redirect={redirect}
          buttonText="Sign up with Ethereum"
        />
      )}
    </div>
  );
};
export default SignUpPanel;
