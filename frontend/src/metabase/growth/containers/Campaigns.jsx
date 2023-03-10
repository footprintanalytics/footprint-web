/* eslint-disable react/prop-types */
import React, { useState } from "react";
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
  Empty,
  message,
} from "antd";
import Title from "antd/lib/typography/Title";
import Icon from "metabase/components/Icon";
import { getUser } from "metabase/selectors/user";
import "../css/utils.css";
import CreateCampaign from "metabase/visualizations/components/CreateCampaign";
import { getLatestGACampaigns } from "../utils/utils";

const Campaigns = props => {
  const { router, location, children, user } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState({ show: false, campaign: {} });
  const showDrawer = c => {
    setOpenDrawer({ show: true, campaign: c });
  };
  const onCloseDrawer = () => {
    setOpenDrawer({ show: false });
  };

  const [currentCampaigns, setCurrentCampaigns] = useState(
    getLatestGACampaigns(),
  );
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
            Campaigns
          </Title>
          {/* <Button
            type={"default"}
            onClick={() => {
              // setIsModalOpen(true);
              router?.push({
                pathname: location.pathname,
                query: { ...location.query, tab: "User List" },
              });
            }}
          >
            Add Campaign
          </Button> */}
        </div>

        <Divider></Divider>
        {currentCampaigns.length > 0 ? (
          <List
            className="w-full"
            itemLayout="horizontal"
            dataSource={currentCampaigns}
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
                      showDrawer(item);
                    }}
                  >
                    detail
                  </a>,
                  <a
                    key="list-loadmore-more"
                    onClick={() => {
                      message.info("Comming soon");
                    }}
                  >
                    delete
                  </a>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Icon
                      className="mr1 text-light"
                      name={item.channel}
                      size={24}
                    />
                  }
                  title={item.channel + " campaign "}
                  description={item.message}
                />
              </List.Item>
            )}
          />
        ) : (
          <Card style={{ width: "100%", borderRadius: 10 }}>
            {/* <div>This project still no config any connector!</div> */}
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 150,
              }}
              description={
                <span>Create a campaign to engage your users immediately!</span>
              }
            >
              <CreateCampaign></CreateCampaign>
            </Empty>
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
        Coming soon~
        {/* <List
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
                showDrawer(item);
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
        /> */}
      </Modal>
      <Drawer
        title={`Campaign ${openDrawer?.campaign?.channel} detail`}
        placement="right"
        maskClosable={false}
        width={500}
        onClose={onCloseDrawer}
        open={openDrawer.show}
      >
        {openDrawer.campaign && JSON.stringify(openDrawer.campaign)}
      </Drawer>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(Campaigns);
