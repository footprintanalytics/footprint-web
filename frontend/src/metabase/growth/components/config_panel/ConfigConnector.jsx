/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, Input, Form, message } from "antd";
import { addConnectors } from "metabase/new-service";
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};

const ConfigConnector = props => {
  const {
    onAddConnector,
    connector,
    user,
    projectId,
    setLoginModalShowAction,
    setCreateFgaProjectModalShowAction,
    setOpenDrawer,
  } = props;
  const formRef = React.useRef(null);
  const [editable, setEditable] = useState(true);
  const [loading, setLoading] = useState(false);
  const onSave = values => {
    if (!user) {
      message.warning("Kindly log in before proceeding.");
      onAddConnector(false);
      setLoginModalShowAction({
        show: true,
        from: "add connector",
        redirect: location.pathname,
        channel: "FGA",
      });
      return;
    }
    if (!projectId) {
      onAddConnector(false);
      message.warning("Initially, you must create your personal project!");
      setCreateFgaProjectModalShowAction({ show: true });
      return;
    }
    setEditable(false);
    setLoading(true);
    console.log("form value", values);
    if (connector.mode === "gaAuthorization") {
      toAuthorization(values.propertyId);
    } else {
      // 提交表单到 api，成功之后
      addConnectors({
        projectId: parseInt(projectId),
        sourceDefinitionId: connector.sourceDefinitionId,
        connectionConfiguration: values,
      })
        .then(result => {
          console.log("add connector", result);
          if (result?.result === "success") {
            message.success("Successfully configured connector.");
            onAddConnector(true);
          } else {
            message.error(`Configured connector ${result?.result}`);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const onEdit = value => {
    setEditable(true);
  };

  const toAuthorization = propertyId => {
    if (!user) {
      setOpenDrawer({ show: false });
      message.warning("Kindly log in before proceeding.");
      setLoginModalShowAction({
        show: true,
        from: "add connector",
        redirect: location.pathname,
        channel: "FGA",
      });
      return;
    }
    if (!projectId) {
      setOpenDrawer({ show: false });
      message.warning("Initially, you must create your personal project!");
      setCreateFgaProjectModalShowAction({ show: true });
      return;
    }
    const host = window.location.origin.startsWith(
      "https://www.footprint.network",
    )
      ? "https://www.footprint.network"
      : "https://preview.footprint.network";
    const redirect_uri = `${host}/api/v1/fga/connector-config/ga/auth/callback`;
    const client_id =
      "741447545-srgvritfv0qfbnjjm3rsb25gfv2h0q23.apps.googleusercontent.com";
    const state = JSON.stringify({
      userId: user.id,
      projectId: projectId,
      propertyId: propertyId,
      page: `${window.location.origin}${location.pathname}?tab=Connectors`,
    });
    const scope = "https://www.googleapis.com/auth/analytics.readonly";
    const url = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=${redirect_uri}&client_id=${client_id}&prompt=consent&state=${state}`;
    // window.open(url, "_blank");
    window.open(url, "_self");
  };
  return (
    <div
      className="flex flex-col w-full p-5"
      style={{
        alignItems: "center",
      }}
    >
      <Form
        {...layout}
        labelWrap
        ref={formRef}
        layout="vertical"
        name="control-ref"
        onFinish={onSave}
        style={{ maxWidth: 1000, minWidth: 300, width: "100%" }}
      >
        {connector?.connectionSpecification.map(i => {
          i.type = i.type === "string" ? "text" : i.type;
          return (
            <Form.Item
              key={i.key}
              name={i.key}
              label={i.title}
              rules={[{ required: i.required }]}
            >
              <Input
                defaultValue={i.value}
                placeholder={`Input the ${i.title}.`}
                type={i.private ? "password" : i.type}
                disabled={!editable}
              />
            </Form.Item>
          );
        })}
        <Form.Item {...tailLayout}>
          <div className="flex w-full flex-row-reverse">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-blue-500 ml-10"
              disabled={!editable}
            >
              Save
            </Button>
            <Button htmlType="button" onClick={onEdit} disabled={editable}>
              Edit
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ConfigConnector;
