/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Avatar, Button, Card, Drawer, List, Modal, Space, Typography } from "antd";
import { ReadOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import { useQuery } from "react-query";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { getAvailableConnectors } from "metabase/new-service";
import { getUser } from "metabase/selectors/user";
import { createFgaProjectModalShowAction, loginModalShowAction } from "metabase/redux/control";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import ConfigConnector from "../components/config_panel/ConfigConnector";
import "../css/utils.css";
import { getGrowthProjectPath } from "../utils/utils";
import Link from "antd/lib/typography/Link";

const { Text } = Typography;
const ConnectorList = props => {
  const {
    router,
    location,
    children,
    user,
    projectId,
    project,
    setLoginModalShowAction,
    setCreateFgaProjectModalShowAction,
    refetchProject,
    businessType,
  } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState({ show: false, connector: {} });
  const [count, setCount] = useState(1);
  const isLoading = false;
  let data;
  // let { isLoading, data } = useQuery(
  //   ["getAvailableConnectors", projectId, count],
  //   async () => {
  //     return await getAvailableConnectors({ projectId: parseInt(projectId) });
  //   },
  //   { ...QUERY_OPTIONS, enabled: !!projectId },
  // );

  if (!projectId || project?.protocolSlug === "Project A") {
    data = {
      "availableConnectorConfig": [
      {
        "group": "Business ",
        "name": "Users",
        "businessType": "account_mapping",
        "icon": "https://static.footprint.network/img_fga_account_mapping.svg",
        "description": "Users is the process of associating or linking an account in one system or platform with an account in another system or platform to achieve data or identity correspondence and synchronization.",
        "connectionSpecification": [
          {
            "type": "string",
            "title": "Source Database",
            "key": "sourceDefinitionId",
            "required": true,
            "value": "",
            "private": false,
            "description": "",
            "placeholder": ""
          }
        ],
        "streamConfig": {
          "min": 0,
          "max": 0,
          "default": 0,
          "list": []
        },
        "mode": "normal",
        "active": true,
        "configured": false
      },
      {
        "group": "Business ",
        "name": "Events",
        "businessType": "user_event",
        "description": "Events is a recorded action or interaction performed by a user within a system or application.",
        "icon": "https://static.footprint.network/img_fga_user_event.svg",
        "connectionSpecification": [
          {
            "type": "string",
            "title": "Source Database",
            "key": "sourceDefinitionId",
            "required": true,
            "value": "",
            "private": false,
            "description": "",
            "placeholder": ""
          }
        ],
        "streamConfig": {
          "min": 0,
          "max": 0,
          "default": 0,
          "list": []
        },
        "mode": "normal",
        "active": true,
        "configured": false,
        "connectionId": 119
      },
      {
        "group": "Community",
        "name": "Twitter",
        "description": "Twitter lets you analyze the changes and engagement of your followers.",
        "icon": "https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220516201254.png",
        "sourceDefinitionId": "897c2972-2bb6-4cb2-97b9-7a5e5a86301c",
        "connectionSpecification": [
          {
            "type": "string",
            "title": "Username",
            "key": "screen_name",
            "required": true,
            "value": "",
            "private": false,
            "placeholder": "Enter the username, such as Footprint_Data"
          }
        ],
        "streamConfig": {
          "min": 3,
          "max": 3,
          "default": 1,
          "list": []
        },
        "mode": "normal",
        "active": true,
        "configured": false
      },
      {
        "group": "Community",
        "name": "Discord",
        "description": "Discord lets you analyze the changes and engagement of your guild members.",
        "icon": "https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220516201343.png",
        "sourceDefinitionId": "cff37b4b-8786-401b-9484-46dd815b84de",
        "connectionSpecification": [
          {
            "type": "string",
            "title": "Guild ID",
            "key": "guild_id",
            "required": true,
            "value": "",
            "private": false,
            "description": "To get the guild ID, open Discord, go to Settings > Advanced and enable developer mode. Then, right-click on the server title and select \"Copy ID\" to get the guild ID.",
            "placeholder": "Enter the guild ID"
          },
          {
            "type": "string",
            "title": "Channel IDs",
            "key": "channel_ids",
            "required": true,
            "value": "",
            "private": false,
            "description": "To get the channel ID, open Discord, go to Settings > Advanced and enable developer mode. Then, right-click on the channel title and select \"Copy ID\" to get the channel ID.",
            "placeholder": "Enter the channel IDs, separated by commas"
          }
        ],
        "streamConfig": {
          "min": 2,
          "max": 2,
          "default": 1,
          "list": []
        },
        "mode": "normal",
        "active": true,
        "configured": false,
        "docLink": "https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-"
      }
    ]
    }
  }

  console.log("projectId", projectId)
  useEffect(() => {
    if ((projectId && !isLoading && data) || (!projectId && data)) {
      console.log("getAvailableIntegrations", data);
      const availableConnectors = data?.availableConnectorConfig;
      const groupMap = new Map();
      availableConnectors.map((j, index) => {
        if (project?.isDemo && !projectId) {
          // if this project is demo project (the sandbox), set all connectors to configured
          j.configured = true;
        }
        if (groupMap.has(j.group)) {
          j.group = "";
        } else {
          groupMap.set(j.group, 1);
        }
      });
      setConnectors(availableConnectors);
    }
  }, [user]);

  const showDrawer = c => {
    setOpenDrawer({ show: true, connector: c });
  };
  const onCloseDrawer = () => {
    setOpenDrawer({ show: false });
  };
  const onAddConnector = async isSuccess => {
    //Todo refresh data
    onCloseDrawer();
    if (isSuccess) {
      await refetchProject();
      gotoAnalytics(openDrawer.connector.name);
      setCount(count + 1);
    }
  };
  const gotoAnalytics = name => {
    switch (name) {
      case "Google Analytics":
        router.push(getGrowthProjectPath(project.protocolSlug, "funnel"));
        break;
      case "Twitter":
        router.push(getGrowthProjectPath(project.protocolSlug, "twitter"));
        break;
      case "Discord":
        router.push(getGrowthProjectPath(project.protocolSlug, "discord"));
        break;
      default:
        router.push(
          getGrowthProjectPath(project.protocolSlug, name.toLowerCase()),
        );
        break;
    }
  };
  const [connectors, setConnectors] = useState([]);

  const [modal, contextHolder] = Modal.useModal();
  return (
    <div className=" flex flex-column items-center">
      {contextHolder}
      <div
        className=" flex flex-column items-center"
        style={{
          width: 800,
          // backgroundColor: "white",
          borderRadius: 10,
          padding: 20,
          marginTop: 20,
          minHeight: 800,
        }}
      >
        <div className="flex flex-row justify-between align-center w-full">
          <Title width={"100%"} level={4} style={{ marginBottom: 0 }}>
            Integrations
          </Title>
          <Typography.Link
            href="https://docs.footprint.network/docs/integrations"
            target="_blank"
            keyboard
          >
            <Space>
              <ReadOutlined />
              {"How to use integrations?"}
            </Space>
          </Typography.Link>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Loading..." />
        ) : (
          <>
            {connectors && (
              <List
                className="w-full"
                itemLayout="horizontal"
                dataSource={connectors}
                split={false}
                renderItem={item => (
                  <>
                    {item?.group && (
                      <Typography.Title level={5} className="mt3">
                        {item?.group}
                      </Typography.Title>
                    )}
                    <List.Item
                      style={{
                        borderRadius: 10,
                        // backgroundColor: isDark ? "#182034" : "white",
                        paddingLeft: 10,
                        paddingRight: 10,
                        cursor: "pointer",
                        marginTop: 8,
                        marginBottom: 8,
                      }}
                      actions={
                        item.configured
                          ? [
                              <Button
                                key="Detail"
                                style={{ borderRadius: 5, width: 120 }}
                                onClick={() => {
                                  if (project.protocolSlug === "Project A") {
                                    modal.confirm({
                                      title: "Tip",
                                      content: (
                                        <div style={{ marginTop: 20 }}>
                                          <p>
                                            {`The sample project can't create a connector, you can choose other project to connect web2.`}
                                          </p>
                                        </div>
                                      ),
                                      okText: "Select other project",
                                      onOk() {
                                        router.push(`/fga/${businessType}/project-manage`);
                                      },
                                    });
                                    return ;
                                  }
                                  showDrawer(item)
                                }}
                              >
                                Detail
                              </Button>,
                              // <a
                              //   key="list-loadmore-edit"
                              //   onClick={() => {
                              //     showDrawer(item);
                              //   }}
                              // >
                              //   detail
                              // </a>,
                              // <a key="list-loadmore-more" disabled={true}>
                              //   delete
                              // </a>,
                            ]
                          : projectId !== "undefined" && item.active
                          ? [
                              <Button
                                type={"primary"}
                                key="Connect"
                                style={{ borderRadius: 5, width: 120 }}
                                onClick={() => {
                                  if (project.protocolSlug === "Project A") {
                                    modal.confirm({
                                      title: "Tip",
                                      content: (
                                        <div style={{ marginTop: 20 }}>
                                          <p>
                                            {`The sample project can't create a connector, you can choose other project to connect web2.`}
                                          </p>
                                        </div>
                                      ),
                                      okText: "Select other project",
                                      onOk() {
                                        router.push(`/fga/${businessType}/project-manage`);
                                      },
                                    });
                                    return ;
                                  } else {
                                    modal.info({
                                      title: "Contact Us",
                                      closable: true,
                                      content: (
                                        <>
                                          <div className=" mt1 text-light">
                                            If you want to connect web2 data, please contact the bd team.
                                          </div>
                                          <div className="mt2">
                                            <Link target="_blank" href="mailto:sales@footprint.network">
                                              Email: sales@footprint.network
                                            </Link>
                                          </div>
                                        </>
                                      ),
                                    });
                                  }
                                  // showDrawer(item);
                                }}
                              >
                                Connect
                              </Button>,
                            ]
                          : [
                              <Button
                                type={"primary"}
                                key="Contact"
                                style={{ borderRadius: 5, width: 120 }}
                                disabled
                                onClick={() => {
                                  showDrawer(item);
                                }}
                              >
                                Coming Soon
                              </Button>,
                            ]
                      }
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={item?.icon}
                            style={{ backgroundColor: "#fff" }}
                          />
                        }
                        title={item?.name}
                        description={item?.description}
                      />
                    </List.Item>
                  </>
                )}
              />
            )}
          </>
        )}
      </div>
      <Modal
        title="Select integration type"
        open={isModalOpen}
        footer={null}
        // onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <List
          grid={{
            gutter: 10,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 3,
            xxl: 3,
          }}
          dataSource={connectors}
          renderItem={item => (
            <List.Item
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              <Card hoverable style={{ width: "100%" }}>
                <div className=" flex flex-column items-center" style={{}}>
                  <img src={item?.icon} className="ga-big-icon"></img>
                  <Text ellipsis={true}>{item?.name}</Text>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Modal>
      <Drawer
        title={`Config ${openDrawer?.connector?.name} Integration`}
        placement="right"
        maskClosable={false}
        width={500}
        onClose={onCloseDrawer}
        open={openDrawer.show}
        extra={
          <Typography.Link
            href="https://docs.footprint.network/docs/integrations"
            target="_blank"
            keyboard
          >
            <Space>
              <ReadOutlined />
              {"Docs"}
            </Space>
          </Typography.Link>
        }
      >
        {openDrawer.connector && (
          <ConfigConnector
            router={router}
            connector={openDrawer.connector}
            onAddConnector={onAddConnector}
            user={user}
            modal={modal}
            project={project}
            setOpenDrawer={setOpenDrawer}
            setLoginModalShowAction={setLoginModalShowAction}
            setCreateFgaProjectModalShowAction={
              setCreateFgaProjectModalShowAction
            }
            projectId={projectId}
          ></ConfigConnector>
        )}
      </Drawer>
    </div>
  );
};

const mapDispatchToProps = {
  setLoginModalShowAction: loginModalShowAction,
  setCreateFgaProjectModalShowAction: createFgaProjectModalShowAction,
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectorList);
