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
import { loginModalShowAction } from "metabase/redux/control";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import ConfigAppsFlyerSource from "../components/config_panel/ConfigAppsFlyerSource";
import ConfigTwitterSource from "../components/config_panel/ConfigTwitterSource";
import ConfigDiscordSource from "../components/config_panel/ConfigDiscordSource";
import ConfigGoogleAnalyticsSource from "../components/config_panel/ConfigGoogleAnalyticsSource";
import "../css/utils.css";
const { Text } = Typography;

const Connectors = props => {
  const { router, location, children, user, projectId } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState({ show: false, connector: {} });

  const { isLoading, data } = useQuery(
    ["GetFgaConnectors", projectId],
    async () => {
      if (projectId) {
        return await GetFgaConnectors({ projectId: projectId });
      } else {
        console.log("no project id");
        return;
      }
    },
    QUERY_OPTIONS,
  );

  useEffect(() => {
    const temp = [
      {
        name: "Google Analytics",
        key: "Google Analytics daily",
        icon: GA,
        statu: "unconnected",
        desc: "Google Analytics can help you to analytic the user event of your project and known your user most!",
        pannel: (
          <ConfigGoogleAnalyticsSource
            onAddConnector={onAddConnector}
            user={user}
            projectId={projectId}
          />
        ),
      },
      // {
      //   name: "BigQuery",
      //   key: "bq",
      //   icon: BQ,
      //   pannel: <ConfigBigQuerySource onAddConnector={onAddConnector} />,
      // },
      {
        name: "Appsflyers",
        key: "af",
        icon: AF,
        statu: "unconnected",
        desc: "This connector can help your to using appsflyers ",
        pannel: <ConfigAppsFlyerSource onAddConnector={onAddConnector} />,
      },
      {
        name: "Discord",
        key: "discord",
        statu: "unconnected",
        icon: "https://footprint-imgs-hk.oss-cn-hongkong.aliyuncs.com/20220516201343.png",
        desc: "This connector can help to analytic the user change of your Discord guild .",
        pannel: <ConfigDiscordSource onAddConnector={onAddConnector} />,
      },
      {
        name: "Twitter",
        key: "twitter",
        statu: "unconnected",
        icon: "https://footprint-imgs-hk.oss-cn-hongkong.aliyuncs.com/20220516201254.png",
        desc: "This connector can help to analytic the follower change of your Twitter.",
        pannel: <ConfigTwitterSource onAddConnector={onAddConnector} />,
      },
    ];
    if (projectId && !isLoading && data) {
      console.log("GetFgaConnectors", data);
      if (data.length > 0) {
        data.map((i, index) => {
          temp.map((j, index) => {
            if (j.key === i.name) {
              j.statu = "connected";
            }
          });
        });
        console.log("temp", temp);
      }
      // setCurrentConnectors()
    }
    setConnectors(temp);
  }, [projectId, isLoading, data, connectors, user]);

  const showDrawer = c => {
    setOpenDrawer({ show: true, connector: c });
  };
  const onCloseDrawer = () => {
    setOpenDrawer({ show: false });
  };
  const onAddConnector = key => {
    const i = connectors.find(item => item.key === key);
    const temp = currentConnectors;
    temp.push({ connector: i });
    setCurrentConnectors(temp);
    onCloseDrawer();
  };
  const [connectors, setConnectors] = useState([]);
  const [currentConnectors, setCurrentConnectors] = useState([]);
  const addConnector = item => {
    if (user) {
      if (item.pannel) {
        showDrawer(item);
      }
    } else {
      message.info("Please login first!");
      loginModalShowAction({ show: true, from: "add connector" });
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
                                // showDrawer(item);
                                if (projectId) {
                                  showDrawer(item);
                                } else {
                                  message.error(
                                    "You need create your own project first!",
                                  );
                                }
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
          dataSource={connectors}
          renderItem={item => (
            <List.Item
              onClick={() => {
                setIsModalOpen(false);
                addConnector(item);
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

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(Connectors);
