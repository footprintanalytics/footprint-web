/* eslint-disable react/prop-types */
import React from "react";
import { Card, List, Typography } from "antd";
import { connect } from "react-redux";
import { getUser, getFgaProject } from "metabase/selectors/user";
const { Text } = Typography;

const UserTemplate = props => {
  const { router, location, children, user, projectPath, menu, projectObject } =
    props;
  const templates = [
    {
      name: "Gamer",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220516201357.png",
      key: "Email",
    },
    {
      name: "Investor",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220516201357.png",
      key: "Investor",
    },
    {
      name: "DeFi Degen",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220516201357.png",
      key: "DeFi Degen",
    },
    {
      name: "NFT Collector",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220516201357.png",
      key: "NFT Collector",
    },
    {
      name: "Customer Filter",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220516201357.png",
      key: "Customer Filter",
    },
  ];
  return (
    <div className="flex flex-column items-center">
      <div className="flex flex-column" style={{ width: 800 }}>
        <h2 className="mt3">Which type of user are you looking for?</h2>
        <div className="flex flex-row items-center mt2">
          <List
            grid={{
              gutter: 10,
              xs: 3,
              sm: 3,
              md: 3,
              lg: 5,
              xl: 5,
              xxl: 5,
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
