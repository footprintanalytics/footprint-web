/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  Drawer,
  Avatar,
  List,
  Modal,
  Divider,
  Button,
  Result,
  Card,
  Typography,
  message,
  notification,
  Space,
} from "antd";
import { ReadOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import { useQuery } from "react-query";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { getAvailableConnectors } from "metabase/new-service";
import { getUser } from "metabase/selectors/user";
import {
  loginModalShowAction,
  createFgaProjectModalShowAction,
} from "metabase/redux/control";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import { isDark } from "metabase/dashboard/components/utils/dark";
import ConfigConnector from "../components/config_panel/ConfigConnector";
import "../css/utils.css";
import { getGrowthProjectPath } from "../utils/utils";

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
    demoData,
    width,
    padding,
    hideComingSoon,
    showContactUs,
  } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState({ show: false, connector: {} });
  const [count, setCount] = useState(1);
  const { isLoading, data } = useQuery(
    ["getAvailableConnectors", projectId, count],
    async () => {
      return await getAvailableConnectors({ projectId: parseInt(projectId) });
    },
    { ...QUERY_OPTIONS, enabled: !!projectId && !demoData },
  );

  const connectorData = demoData || data;

  useEffect(() => {
    if (projectId && !isLoading && connectorData) {
      const availableConnectors = connectorData?.availableConnectorConfig;
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
  }, [projectId, isLoading, connectorData, user]);

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
          width: width || 800,
          // backgroundColor: "white",
          borderRadius: 10,
          padding: padding || 20,
          marginTop: 20,
          minHeight: 800,
        }}
      >
        <div className="flex flex-row justify-between align-center w-full">
          <Title width={"100%"} level={4} style={{ marginBottom: 0 }}>
            Integrations
          </Title>
          <div className="flex flex-column">
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
            {showContactUs && (
              <Typography.Link
                className="mt1"
                href="mailto:sales@footprint.network"
                target="_blank"
                keyboard
              >
                <Space>
                  <ReadOutlined />
                  {"Contact us"}
                </Space>
              </Typography.Link>
            )}
          </div>
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
                        backgroundColor: isDark ? "#182034" : "white",
                        paddingLeft: 10,
                        paddingRight: 10,
                        cursor: "pointer",
                        marginTop: 8,
                        marginBottom: 8,
                      }}
                      actions={
                        hideComingSoon ? null : (item.configured
                          ? [
                              <Button
                                key="Detail"
                                style={{ borderRadius: 5, width: 120 }}
                                onClick={() => showDrawer(item)}
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
                                  showDrawer(item);
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
                        )
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
