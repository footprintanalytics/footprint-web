/* eslint-disable react/prop-types */
import React from "react";
import Form from "metabase/containers/Form";
import { generateAuthKey } from "metabase/new-service";

const DeveloperAppForm = ({ user, refreshCurrentUser }) => {
  const onSubmit = async () => {
    await generateAuthKey();
    refreshCurrentUser();
  };

  return (
    <Form onSubmit={onSubmit} key={user.auth_key}>
      {({ Form, FormField, FormSubmit }) => (
        <Form>
          <FormField
            readOnly={true}
            name="auth_key"
            title="Auth Key"
            placeholder="Generate Auth Key..."
            initial={user.auth_key || ""}
          />
          {!user.auth_key && <FormSubmit>Generate Auth Key</FormSubmit>}
        </Form>
      )}
    </Form>
  );
};

export default DeveloperAppForm;
