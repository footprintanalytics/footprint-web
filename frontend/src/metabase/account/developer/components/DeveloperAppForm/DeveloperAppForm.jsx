/* eslint-disable react/prop-types */
import React from "react";
import Form from "metabase/containers/Form";
import { generateAuthKey } from "metabase/new-service";
import Link from "metabase/components/Link";
import Copy from "metabase/components/CopyPanel";
import Button from "metabase/components/Button";

const DeveloperAppForm = ({ user, refreshCurrentUser }) => {
  const onSubmit = async () => {
    if (user.auth_key) {
      return;
    }
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
              Please put the API key in the request Header.
            </span>
          </div>
          <div className="flex">
            <FormField
              className="flex-full"
              readOnly={true}
              name="auth_key"
              placeholder="Generate Auth Key..."
              initial={user.auth_key || ""}
            />
            {user.auth_key && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: 8,
                  marginBottom: 15,
                }}
              >
                <Copy text={user.auth_key} successText="Copy successfully.">
                  <Button primary onClick={e => e.preventDefault()}>
                    Copy
                  </Button>
                </Copy>
              </div>
            )}
          </div>
          <div className="flex flex-column mb2">
            {/*<span>Please put the API key in the request Header.</span>*/}
            <Link
              to="https://fp-api.readme.io/reference/welcome"
              target="_blank"
              className="text-underline text-underline-hover mt1"
              style={{ width: "fit-content" }}
            >
              <span>How to use the Data API?</span>
            </Link>
          </div>
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
