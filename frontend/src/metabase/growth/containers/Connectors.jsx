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
const { Text } = Typography;

const Connectors = props => {
  const {
    router,
    location,
    children,
    user,
    projectId,
    project,
    setLoginModalShowAction,
    setCreateFgaProjectModalShowAction,
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
      if (project?.project?.isDemo && !projectId) {
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
  const onAddConnector = isSuccess => {
    //Todo refresh data
    onCloseDrawer();
    if (isSuccess) {
      setCount(count + 1);
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
        <div className=" flex flex-row justify-between w-full">
          <Title width={"100%"} level={4} style={{ marginBottom: 0 }}>
            Connectors
          </Title>
        </div>

        <Divider></Divider>
        {isLoading ? (
          <LoadingSpinner message="Loading..." />
        ) : (
          <>
            {connectors && (
              <List
                className="w-full"
                itemLayout="horizontal"
                dataSource={connectors}
                renderItem={item => (
                  <List.Item
                    style={{
                      borderRadius: 10,
                      backgroundColor: "white",
                      paddingLeft: 10,
                      paddingRight: 10,
                      cursor: "pointer",
                      margin: 5,
                    }}
                    actions={
                      item.configured
                        ? [
                            <a
                              key="list-loadmore-edit"
                              onClick={() => {
                                showDrawer(item);
                              }}
                            >
                              edit
                            </a>,
                            <a key="list-loadmore-more">delete</a>,
                          ]
                        : [
                            <Button
                              type={"primary"}
                              key="Connect"
                              style={{ borderRadius: 5 }}
                              disabled={
                                projectId !== "undefined" && item.active
                                  ? false
                                  : true
                              }
                              onClick={() => {
                                showDrawer(item);
                              }}
                            >
                              Connect
                            </Button>,
                          ]
                    }
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item?.icon} />}
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

export default connect(mapStateToProps, mapDispatchToProps)(Connectors);
