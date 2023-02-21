/* eslint-disable react/prop-types */
import React from "react";
import { Avatar, List, Image } from "antd";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import "../css/index.css";

const MyProjects = props => {
  const { router } = props;
  const data = [
    {
      title: "Mocaverse",
      desc: "",
      icon: "https://twitter.com/MocaverseNFT/photo",
      key: "Mocaverse",
    },
    {
      title: "BenjiBananas",
      desc: "",
      icon: "https://twitter.com/BenjiBananas/photo",
      key: "BenjiBananas",
    },
  ];
  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item
            style={{ cursor: "pointer" }}
            onClick={() => {
              router?.push("/growth/project?name=" + item.key);
            }}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.icon}>{item.title}</Avatar>}
              title={item.title}
              description="test"
            />
          </List.Item>
        )}
      />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(MyProjects);
