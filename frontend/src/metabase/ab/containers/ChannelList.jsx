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
import { getUser } from "metabase/selectors/user";
import messageIcon from "assets/img/message.svg";
import {
  loginModalShowAction,
  createFgaProjectModalShowAction,
} from "metabase/redux/control";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import "../css/utils.css";
import { isDark } from "metabase/dashboard/components/utils/dark";
import { checkIsNeedContactUs } from "../utils/utils";
const { Text } = Typography;

const ChannelList = props => {
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
        icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220516201357.png",
        statu: "unconnected",
        desc: "Activator your users by email.",
      },
      {
        name: "Discord",
        key: "discord",
        statu: "unconnected",
        icon: "https://footprint-imgs-hk.oss-cn-hongkong.aliyuncs.com/20220516201343.png",
        desc: "Activator your users by discord.",
      },
      {
        name: "Twitter",
        key: "twitter",
        statu: "unconnected",
        icon: "https://footprint-imgs-hk.oss-cn-hongkong.aliyuncs.com/20220516201254.png",
        desc: "Activator your users by twitter",
      },
      {
        name: "Galxe",
        key: "Galxe",
        statu: "unconnected",
        icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/galxe.png",
        desc: "Activator your users by Galxe",
      },
      {
        name: "Questflow",
        key: "Questflow",
        statu: "unconnected",
        icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/Questflow.jpg",
        desc: "Activator your users by Questflow",
      },
      // {
      //   name: "Port3",
      //   key: "Port3",
      //   statu: "unconnected",
      //   icon: "https://footprint-imgs.oss-accelerate.aliyuncs.com/20230324164222.svg",
      //   desc: "Activator your users by PortN",
      // },
      // {
      //   name: "Link3",
      //   key: "Link3",
      //   statu: "unconnected",
      //   icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/link3.jpg",
      //   desc: "Activator your users by Link3",
      // },
      {
        name: "Notifi",
        key: "Notifi",
        statu: "unconnected",
        icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/notifi.jpeg",
        desc: "Activator your users by Notifi",
      },
      {
        name: "SMS",
        key: "SMS",
        icon: messageIcon,
        statu: "unconnected",
        desc: "Activator your users by SMS.",
      },
    ];
    if (project?.isDemo && !projectId) {
      //if is demo project, set all channel to connected
      temp.map((j, index) => {
        j.statu = "connected";
      });
    }
    setActivators(temp);
  }, [project]);

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
        from: "add Integration",
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
        <div className=" flex flex-row justify-between w-full mb2">
          <Title width={"100%"} level={4} style={{ marginBottom: 0 }}>
            Channel
          </Title>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Loading..." />
        ) : (
          <>
            {activators && (
              <List
                className="w-full"
                itemLayout="horizontal"
                dataSource={activators}
                split={false}
                renderItem={item => (
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
                              style={{ borderRadius: 5 }}
                              // disabled={
                              //   projectId !== "undefined" ? false : true
                              // }
                              disabled={true}
                              onClick={() => {
                                checkIsNeedContactUs(
                                  modal,
                                  project,
                                  () => {
                                    showDrawer(item);
                                  },
                                  () => {},
                                  true,
                                );
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
        title={`Config ${openDrawer?.connector?.name} Integration`}
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

export default connect(mapStateToProps, mapDispatchToProps)(ChannelList);
