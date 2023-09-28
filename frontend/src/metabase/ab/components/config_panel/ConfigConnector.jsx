/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Button,
  Input,
  Form,
  message,
  Modal,
  Switch,
  Space,
  Tooltip,
  Typography,
  Alert,
  Checkbox,
} from "antd";
import { Link } from "react-router";
import { QuestionCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { addConnectors } from "metabase/new-service";
import { checkIsNeedContactUs } from "../../utils/utils";

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
    modal,
    project,
    router,
  } = props;
  const formRef = React.useRef(null);
  const [editable, setEditable] = useState(!connector?.configured);
  const [loading, setLoading] = useState(false);
  const onSave = values => {
    if (checkIsNeedContactUs(modal, project)) {
      return;
    }


    if (!user) {
      message.warning("Kindly log in before proceeding.");
      onAddConnector(false);
      setLoginModalShowAction({
        show: true,
        from: "add integration",
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
    // setEditable(false);
    setLoading(true);
    console.log("form value", values);
    if (connector.mode === "gaAuthorization") {
      toAuthorization(values.propertyId);
    } else {
      // 提交表单到 api，成功之后
      const data = {
        projectId: parseInt(projectId),
        sourceDefinitionId: connector.sourceDefinitionId,
        connectionConfiguration: values,
        streams: values.streams || [],
      };
      addConnectors(data)
        .then(result => {
          console.log("add Integration", result);
          if (result?.result === "success") {
            message.success("Successfully configured integration.");
            onAddConnector(true);
            // if (connector.name === "Discord") {
            //   showDiscordBotLink(values);
            // }
          } else {
            message.error(`Configured integration ${result?.result}`);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const showDiscordBotLink = values => {
    const link = `https://discord.com/oauth2/authorize?client_id=${values.bot_id}&scope=bot&permissions=0&guild_id=${values.guild_id}`;
    Modal.info({
      title: "The final and crucial step!",
      content: (
        <div style={{ marginTop: 20 }}>
          <p>
            In order for the Integration to function, you must incorporate our
            Discord bot into your guild.
          </p>
          <Link target="_blank" href={link}>
            CLick this link to add bot:
            <p>https://discord.com/oauth2/authorize/.....</p>
          </Link>
        </div>
      ),
      onOk() {
        window.open(link, "_blank");
      },
    });
  };

  // add ga connector need to authorization by google
  const toAuthorization = propertyId => {
    if (!user) {
      setOpenDrawer({ show: false });
      message.warning("Kindly log in before proceeding.");
      setLoginModalShowAction({
        show: true,
        from: "add Integration",
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
      page: `${window.location.origin}${location.pathname}?tab=integration`,
    });
    const scope = "https://www.googleapis.com/auth/analytics.readonly";
    const url = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=${redirect_uri}&client_id=${client_id}&prompt=consent&state=${state}`;
    // window.open(url, "_blank");
    window.open(url, "_self");
  };
  const initialValues = {
    streams:
      connector?.streamConfig?.list
        ?.filter(f => f.configured || f.selected)
        ?.map(m => m.value) || [],
  };
  connector?.connectionSpecification?.map(item => {
    initialValues[item.key] = item.value;
  });

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
        initialValues={initialValues}
        style={{ maxWidth: 1000, minWidth: 300, width: "100%" }}
      >
        {connector.name === "Discord" ? (
          <Form.Item>
            <Alert
              message="Make sure you have invited Discord bot"
              description={
                <>
                  Please click on the{" "}
                  <Typography.Link
                    href="https://discord.com/api/oauth2/authorize?client_id=1089756391889178745&permissions=268435456&scope=bot"
                    target="_blank"
                    underline
                  >
                    invitation link
                  </Typography.Link>{" "}
                  to add the Discord bot and ensure proper data connection.
                </>
              }
              type="warning"
              showIcon
            />
          </Form.Item>
        ) : null}
        {connector?.connectionSpecification.map(i => {
          i.type = i.type === "string" ? "text" : i.type;
          return (
            <Form.Item
              key={i.key}
              name={i.key}
              label={
                <Space>
                  <span>{i.title}</span>
                  {i.description ? (
                    <Tooltip title={i.description}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  ) : null}
                </Space>
              }
              rules={[
                { required: i.required },
                i.key === "screen_name" && {
                  validator: (_, value) => {
                    if (value && value.startsWith("@")) {
                      return Promise.reject(
                        new Error("Twitter handler cannot start with @ symbol"),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              {i.type === "text" && (
                <Input
                  defaultValue={i.value}
                  value={i.value}
                  allowClear
                  placeholder={i.placeholder}
                  type={i.private ? "password" : i.type}
                />
              )}
              {/* {i.type === "boolean" && (
                <Switch value={i.value} defaultChecked={i.value} />
              )} */}
            </Form.Item>
          );
        })}
        {connector.streamConfig?.list?.length ? (
          <Form.Item
            name="streams"
            label="Metrics"
            rules={[{ required: true }]}
          >
            <Checkbox.Group
              options={connector.streamConfig.list.map(m => ({
                ...m,
                disabled: m.required,
              }))}
            />
          </Form.Item>
        ) : null}
        {connector.docLink ? (
          <Form.Item>
            <Space>
              <InfoCircleOutlined />
              <Typography.Link
                href={connector.docLink}
                target="_blank"
                underline
              >
                Where can I find my configuration information?
              </Typography.Link>
            </Space>
          </Form.Item>
        ) : null}
        <Form.Item {...tailLayout}>
          <div className="flex w-full flex-row-reverse">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-blue-500 ml-10"
              // disabled={!editable}
             /* onClick={() => {
                modal.success({
                  content: "Connect successfully!",
                  okText: "View Data",
                  onOk: () => {
                    router.replace(`/fga/public-chain/project/${project?.protocolSlug}/${connector.name.toLowerCase()}`);
                    localStorage.setItem("twitterEnable", "enable");
                  },
                });
              }}*/
            >
              Save
            </Button>
            {/* <Button htmlType="button" onClick={onEdit} disabled={editable}>
              Edit
            </Button> */}
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};;

export default ConfigConnector;
