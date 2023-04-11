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
} from "antd";
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
import ConfigConnector from "../components/config_panel/ConfigConnector";
import "../css/utils.css";
import { getGrowthProjectPath } from "../utils/utils";
import { isDark } from "metabase/dashboard/components/utils/dark";

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
  } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState({ show: false, connector: {} });
  const [count, setCount] = useState(1);
  const { isLoading, data } = useQuery(
    ["getAvailableConnectors", projectId, count],
    async () => {
      if (projectId) {
        return await getAvailableConnectors({ projectId: parseInt(projectId) });
      } else {
        return;
      }
    },
    QUERY_OPTIONS,
  );

  useEffect(() => {
    if (projectId && !isLoading && data) {
      console.log("getAvailableConnectors", data);
      const availableConnectors = data?.availableConnectorConfig;
      // setCurrentConnectors()
      if (project?.isDemo && !projectId) {
        // if this project is demo project (the sandbox), set all connectors to configured
        availableConnectors.map((j, index) => {
          j.configured = true;
        });
      }
      setConnectors(availableConnectors);
    }
  }, [projectId, isLoading, data, user]);

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
        router.push(getGrowthProjectPath(project.protocolSlug, "User Funnel"));
        break;
      default:
        router.push(getGrowthProjectPath(project.protocolSlug, name));
        break;
    }
  };
  const [connectors, setConnectors] = useState([]);
  return (
    <div className=" flex flex-column items-center">
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
        <div className=" flex flex-row justify-between w-full mb2">
          <Title width={"100%"} level={4} style={{ marginBottom: 0 }}>
            Connectors
          </Title>
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
                  <List.Item
                    style={{
                      borderRadius: 10,
                      backgroundColor: isDark ? "#182034": "white",
                      paddingLeft: 10,
                      paddingRight: 10,
                      cursor: "pointer",
                      margin: 8,
                    }}
                    actions={
                      item.configured
                        ? [
                            <Button
                              key="Detail"
                              style={{ borderRadius: 5, width: 90 }}
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
                        : [
                            <Button
                              type={"primary"}
                              key="Connect"
                              style={{ borderRadius: 5, width: 90 }}
                              disabled={
                                projectId !== "undefined" && item.active
                                  ? false
                                  : true
                              }
                              onClick={() => showDrawer(item)}
                            >
                              Connect
                            </Button>,
                          ]
                    }
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item?.icon} style={{ backgroundColor: '#fff' }}/>}
                      title={item?.name}
                      description={item?.description}
                    />
                  </List.Item>
                )}
              />
            )}
          </>
        )}
      </div>
      <Modal
        title="Select connector type"
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
        title={`Config ${openDrawer?.connector?.name} Connector`}
        placement="right"
        maskClosable={false}
        width={500}
        onClose={onCloseDrawer}
        open={openDrawer.show}
      >
        {openDrawer.connector && (
          <ConfigConnector
            connector={openDrawer.connector}
            onAddConnector={onAddConnector}
            user={user}
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
