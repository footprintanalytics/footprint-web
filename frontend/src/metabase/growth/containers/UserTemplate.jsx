/* eslint-disable react/prop-types */
import React from "react";
import { Button, Card, Image, List, Typography } from "antd";
import { connect } from "react-redux";
import { getUser, getFgaProject } from "metabase/selectors/user";
import { width } from "styled-system";
const { Text } = Typography;

const UserTemplate = props => {
  const { router, location, children, user, projectPath, menu, projectObject } =
    props;
  const templates = [
    {
      name: "Token Airdrop",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220516201357.png",
      key: "Token Airdrop",
    },
    {
      name: "NFT Collector",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220516201357.png",
      key: "NFT Collector",
    },
    {
      name: "Active Gamer",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220516201357.png",
      key: "Active Gamer",
    },
    {
      name: "Whale Tracking",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220516201357.png",
      key: "Whale Tracking",
    },
    // {
    //   name: "Customer Filter",
    //   icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220516201357.png",
    //   key: "Customer Filter",
    // },
  ];
  return (
    <div className="flex flex-column items-center">
      <div className="flex flex-column" style={{ width: 800 }}>
        <div className="mt3 flex flex-row w-full items-center justify-between align-center">
          <h2>Which type of user are you looking for?</h2>
          <Button type="link">{"Customer Filter >"}</Button>
        </div>
        <div className="flex flex-row items-center mt2 w-full">
          <List
            className="w-full"
            grid={{
              gutter: 10,
              xs: 2,
              sm: 2,
              md: 2,
              lg: 4,
              xl: 4,
              xxl: 4,
            }}
            dataSource={templates}
            renderItem={item => (
              <List.Item
                onClick={() => {
                  // setIsModalOpen(false);
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
        </div>

        <h2 className="mt3">How it work?</h2>
        <div className="mt2 flex flex-row w-full items-center justify-between">
          <Image
            preview={false}
            src="https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220225185345.png"
            width={"50%"}
          ></Image>
          <div className="flex flex-column mt2 p2" width={"50%"}>
            <h3>Which type of user are you looking for?</h3>
            <Text className="mt1">
              this is some desc this is some desc this is some desc this is some
              desc{" "}
            </Text>
          </div>
        </div>
        <div className="mt2 flex flex-row w-full items-center justify-between">
          <div className="flex flex-column mt2 p2" width={"50%"}>
            <h3>Which type of user are you looking for?</h3>
            <Text className="mt1">
              this is some desc this is some desc this is some desc this is some
              desc{" "}
            </Text>
          </div>
          <Image
            preview={false}
            src="https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220225185345.png"
            width={"50%"}
          ></Image>
        </div>
        <div className="mt2 flex flex-row w-full items-center justify-between">
          <Image
            preview={false}
            src="https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220225185345.png"
            width={"50%"}
          ></Image>
          <div className="flex flex-column mt2 p2" width={"50%"}>
            <h3>Which type of user are you looking for?</h3>
            <Text className="mt1">
              this is some desc this is some desc this is some desc this is some
              desc{" "}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectObject: getFgaProject(state),
    // projectPath: props.params.project,
    // menu: props.params.menu,
  };
};

export default connect(mapStateToProps)(UserTemplate);
