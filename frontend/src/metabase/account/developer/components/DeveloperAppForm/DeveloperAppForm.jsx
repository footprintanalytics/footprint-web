/* eslint-disable react/prop-types */
import React from "react";
import Form from "metabase/containers/Form";
import { generateAuthKey } from "metabase/new-service";
import Link from "metabase/components/Link";
import Copy from "metabase/components/CopyPanel";
import Button from "metabase/components/Button";

const DeveloperAppForm = ({ user, refreshCurrentUser }) => {
  const onSubmit = async () => {
    await generateAuthKey();
    refreshCurrentUser();
  };

  return (
    <Form onSubmit={onSubmit} key={user.auth_key}>
      {({ Form, FormField, FormSubmit }) => (
        <Form>
          <div className="flex flex-row justify-between mb1">
            <span className="footprint-title2">API Key</span>
            <span className="footprint-secondary-text2 align-baseline">
              Copy and paste the API key into the request header.
            </span>
          </div>
          <FormField
            className="flex-full"
            readOnly={true}
            name="auth_key"
            placeholder="Generate Auth Key..."
            initial={user.auth_key || ""}
          />
          {user.auth_key && (
            <div style={{ textAlign: "right" }}>
              <Link
                to="https://fp-api.readme.io/reference/welcome"
                target="_blank"
                className="text-underline text-underline-hover mt1"
                style={{ width: "fit-content" }}
                onClick={e => {
                  e.preventDefault();
                  setTimeout(() => {
                    window.open("https://fp-api.readme.io/reference/welcome");
                  }, 1000);
                }}
              >
                <Copy text={user.auth_key} successText="Copy successfully.">
                  <Button primary onClick={e => e.preventDefault()}>
                    Copy the API key and start using data
                  </Button>
                </Copy>
              </Link>
            </div>
          )}
          {!user.auth_key && (
            <div style={{ textAlign: "right" }}>
              <FormSubmit>Generate Auth Key</FormSubmit>
            </div>
          )}
        </Form>
      )}
    </Form>
  );
};

export default DeveloperAppForm;
