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
import { GetFgaConnectors } from "metabase/new-service";
import { getUser } from "metabase/selectors/user";

import AF from "assets/img/af.png";
import BQ from "assets/img/BQ.svg";
import GA from "assets/img/GA.svg";
import messageIcon from "assets/img/message.svg";
import {
  loginModalShowAction,
  createFgaProjectModalShowAction,
} from "metabase/redux/control";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import ConfigAppsFlyerSource from "../components/config_panel/ConfigAppsFlyerSource";
import ConfigTwitterSource from "../components/config_panel/ConfigTwitterSource";
import ConfigDiscordSource from "../components/config_panel/ConfigDiscordSource";
import ConfigGoogleAnalyticsSource from "../components/config_panel/ConfigGoogleAnalyticsSource";
import "../css/utils.css";
const { Text } = Typography;

const Activator = props => {
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

  const isLoading = false;
  const data = [];
  // const { isLoading, data } = useQuery(
  //   ["GetFgaConnectors", projectId],
  //   async () => {
  //     if (projectId) {
  //       return await GetFgaConnectors({ projectId: projectId });
  //     } else {
  //       return;
  //     }
  //   },
  //   QUERY_OPTIONS,
  // );

  useEffect(() => {
    const temp = [
      {
        name: "Email",
        key: "Email",
        icon: messageIcon,
        statu: "unconnected",
        desc: "Activator your users by email.",
        pannel: (
          <ConfigGoogleAnalyticsSource
            onAddConnector={onAddConnector}
            user={user}
            setOpenDrawer={setOpenDrawer}
            setLoginModalShowAction={setLoginModalShowAction}
            setCreateFgaProjectModalShowAction={
              setCreateFgaProjectModalShowAction
            }
            projectId={projectId}
          />
        ),
      },
      {
        name: "Discord",
        key: "discord",
        statu: "unconnected",
        icon: "https://footprint-imgs-hk.oss-cn-hongkong.aliyuncs.com/20220516201343.png",
        desc: "Activator your users by discord.",
        pannel: <ConfigDiscordSource onAddConnector={onAddConnector} />,
      },
      {
        name: "Twitter",
        key: "twitter",
        statu: "unconnected",
        icon: "https://footprint-imgs-hk.oss-cn-hongkong.aliyuncs.com/20220516201254.png",
        desc: "Activator your users by twitter",
        pannel: <ConfigTwitterSource onAddConnector={onAddConnector} />,
      },
    ];
    // if (projectId && !isLoading && data) {
    //   if (data.length > 0) {
    //     data.map((i, index) => {
    //       temp.map((j, index) => {
    //         if (j.key === i.name) {
    //           j.statu = "connected";
    //         }
    //       });
    //     });
    //   }
    //   // setCurrentConnectors()
    // } else {
    if (project?.project?.isDemo) {
      temp.map((j, index) => {
        j.statu = "connected";
      });
    }
    // }
    setActivators(temp);
  }, []);

  const showDrawer = c => {
    setOpenDrawer({ show: true, connector: c });
  };
  const onCloseDrawer = () => {
    setOpenDrawer({ show: false });
  };
  const onAddConnector = key => {
    if (!user) {
      onCloseDrawer();
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
      message.warning("Initially, you must create your personal project!");
      setCreateFgaProjectModalShowAction({ show: true });
      return;
    }
    const i = activators.find(item => item.key === key);
    const temp = currentActivators;
    temp.push({ connector: i });
    setCurrentActivators(temp);
    onCloseDrawer();
  };
  const [activators, setActivators] = useState([]);
  const [currentActivators, setCurrentActivators] = useState([]);
  const addActivator = item => {
    if (item.pannel) {
      showDrawer(item);
    }
  };
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
            Activators
          </Title>
        </div>

        <Divider></Divider>
        {isLoading ? (
          <LoadingSpinner message="Loading..." />
        ) : (
          <>
            {activators && (
              <List
                className="w-full"
                itemLayout="horizontal"
                dataSource={activators}
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
                      item.statu === "connected"
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
                              disabled={
                                projectId !== "undefined" ? false : true
                              }
                              onClick={() => {
                                showDrawer(item);
                              }}
                            >
                              Add
                            </Button>,
                          ]
                    }
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item?.icon} />}
                      title={item?.name}
                      description={item?.desc}
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
          dataSource={activators}
          renderItem={item => (
            <List.Item
              onClick={() => {
                setIsModalOpen(false);
                addActivator(item);
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
        {openDrawer.connector && openDrawer.connector.pannel}
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

export default connect(mapStateToProps, mapDispatchToProps)(Activator);
