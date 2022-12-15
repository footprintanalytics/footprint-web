/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import Form from "metabase/containers/Form";
import { generateAuthKey } from "metabase/new-service";
import Link from "metabase/core/components/Link";
import Button from "metabase/core/components/Button";
import CopyToClipboard from "react-copy-to-clipboard";
import { t } from "ttag";
import Tooltip from "metabase/components/Tooltip";
import { useQuery } from "react-query";
import LoadingSpinner from "metabase/components/LoadingSpinner";

const DeveloperAppForm = ({ user, refreshCurrentUser }) => {
  const [copied, setCopied] = useState(false);
  const doc = "https://docs.footprint.network/reference/introduction";

  const { isLoading, isSuccess, data } = useQuery(
    ["generateAuthKey"],
    async () => {
      return generateAuthKey();
    },
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !user.auth_key,
    },
  );
  const authKey = user.auth_key || data?.authKey;

  useEffect(() => {
    if (isSuccess) {
      refreshCurrentUser();
    }
  }, [isSuccess, refreshCurrentUser]);

  if (isLoading) {
    return (
      <div style={{ height: 140 }}>
        <LoadingSpinner message="General API key，loading..." />
      </div>
    );
  }

  const onSubmit = async () => {
    await generateAuthKey();
    refreshCurrentUser();
  };

  const onCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Form onSubmit={onSubmit} key={user.auth_key}>
      {({ Form, FormField, FormSubmit }) => (
        <Form>
          <div className="flex flex-row justify-between mb1">
            <span className="footprint-title2">API key</span>
            <span className="footprint-secondary-text2 align-baseline">
              Copy and paste the API key into the request header.
            </span>
          </div>
          <FormField
            className="flex-full"
            readOnly={true}
            name="auth_key"
            placeholder="Generate API Key..."
            initial={authKey || ""}
          />
          {authKey && (
            <div style={{ textAlign: "right" }}>
              <Link
                to={doc}
                target="_blank"
                className="text-underline text-underline-hover mt1"
                style={{ width: "fit-content" }}
                onClick={e => {
                  e.preventDefault();
                  setTimeout(() => {
                    window.open(doc);
                  }, 1500);
                }}
              >
                <Tooltip tooltip={t`Copied!`} isOpen={copied}>
                  <CopyToClipboard text={authKey} onCopy={onCopy}>
                    <Button primary onClick={e => e.preventDefault()}>
                      Copy the API key and start using data
                    </Button>
                  </CopyToClipboard>
                </Tooltip>
              </Link>
            </div>
          )}
        </Form>
      )}
    </Form>
  );
};

export default DeveloperAppForm;
