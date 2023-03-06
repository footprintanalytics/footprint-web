/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, Input, Form } from "antd";
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};

const ConfigGoogleAnalyticsSource = props => {
  const { onAddConnector, user, projectId } = props;
  const formRef = React.useRef(null);
  const [editable, setEditable] = useState(true);
  const onSave = values => {
    console.log(values);
    setEditable(false);
    toAuthorization(values.propertyId);
    // onAddConnector("ga");
    // todo 提交表单到 api，成功之后 onNext
    // onNext();
  };
  const toAuthorization = propertyId => {
    const redirect_uri =
      "https://preview.footprint.network/api/v1/fga/connector-config/ga/auth/callback";
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
    console.log("url", url);
    // window.open(url, "_blank");
    window.open(url, "_self");
  };
  const onEdit = value => {
    setEditable(true);
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
        <Form.Item
          name="propertyId"
          label="Property ID"
          rules={[{ required: true }]}
        >
          <Input
            placeholder="Input the property id of your project in Google Analytics!"
            disabled={!editable}
          />
        </Form.Item>
        {/* <Form.Item
          name="ga_json_key"
          label="Server Account JSON Key"
          rules={[{ required: true }]}
        >
          <Input type="password" disabled={!editable} />
        </Form.Item> */}
        <Form.Item {...tailLayout}>
          <div className="flex w-full flex-row-reverse">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-500 ml-10"
              disabled={!editable}
            >
              Authorization
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

export default ConfigGoogleAnalyticsSource;
