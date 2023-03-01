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
import ConfigAppsFlyerSource from "../components/config_panel/ConfigAppsFlyerSource";
import ConfigTwitterSource from "../components/config_panel/ConfigTwitterSource";
import ConfigDiscordSource from "../components/config_panel/ConfigDiscordSource";
import "../css/utils.css";
const { Text } = Typography;

const Connectors = props => {
  const { router, location, children, user, projectId } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState({ show: false, connector: {} });

  const { isLoading, data } = useQuery(
    ["GetFgaConnectors", projectId],
    async () => {
      return await GetFgaConnectors({ projectId: projectId });
    },
    QUERY_OPTIONS,
  );

  useEffect(() => {
    if (projectId) {
      console.log("GetFgaConnectors", data);
    }
  }, [projectId, isLoading, data]);

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
  const connectors = [
    {
      name: "Google Analytics",
      key: "ga",
      icon: GA,
      // pannel: <ConfigGoogleAnalyticsSource onAddConnector={onAddConnector} />,
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
      pannel: <ConfigAppsFlyerSource onAddConnector={onAddConnector} />,
    },
    {
      name: "Discord",
      key: "discord",
      icon: "https://footprint-imgs-hk.oss-cn-hongkong.aliyuncs.com/20220516201343.png",
      pannel: <ConfigDiscordSource onAddConnector={onAddConnector} />,
    },
    {
      name: "Twitter",
      key: "twitter",
      icon: "https://footprint-imgs-hk.oss-cn-hongkong.aliyuncs.com/20220516201254.png",
      pannel: <ConfigTwitterSource onAddConnector={onAddConnector} />,
    },
  ];
  const [currentConnectors, setCurrentConnectors] = useState([]);
  const addConnector = item => {
    console.log("item", item);
    if (user) {
      if (item.pannel) {
        showDrawer(item);
      } else if (item.key === "ga") {
        const redirect_uri =
          "https://preview.footprint.network/api/v1/fga/connector-config/ga/auth/callback";
        const client_id =
          "741447545-hsk59fk55lc03aksgs57jvu0ahqs4t1o.apps.googleusercontent.com";
        const state = JSON.stringify({
          userId: user.id,
          projectid: projectId,
          page: `${window.location.origin}${location.pathname}?tab=Connectors`,
        });
        const scope = "https://www.googleapis.com/auth/analytics.readonly";
        const url = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=${redirect_uri}&client_id=${client_id}&prompt=consent&state=${state}`;
        console.log("url", url);
        window.open(url, "_blank");
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
          <Button
            type={"default"}
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Add Connector
          </Button>
        </div>

        <Divider></Divider>
        {currentConnectors.length > 0 ? (
          <List
            className="w-full"
            itemLayout="horizontal"
            dataSource={currentConnectors}
            renderItem={item => (
              <List.Item
                style={{
                  borderRadius: 10,
                  backgroundColor: "white",
                  paddingLeft: 10,
                  paddingRight: 10,
                  margin: 5,
                }}
                actions={[
                  <a
                    key="list-loadmore-edit"
                    onClick={() => {
                      showDrawer(item.connector);
                    }}
                  >
                    edit
                  </a>,
                  <a key="list-loadmore-more">delete</a>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item?.connector?.icon} />}
                  title={item.connector?.name}
                  description="Sync data in 2023-02-01 12:00:00"
                />
              </List.Item>
            )}
          />
        ) : (
          <Card style={{ width: "100%", borderRadius: 10 }}>
            {/* <div>This project still no config any connector!</div> */}
            <Result
              status="warning"
              title="This project still no config any connector!"
              extra={
                <Button
                  type="primary"
                  key="console"
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  Add Connector Now
                </Button>
              }
            />
          </Card>
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
