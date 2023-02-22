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
      title: "Demo1",
      desc: "",
      icon: "",
      key: "demo1",
    },
    {
      title: "Demo2",
      desc: "",
      icon: "",
      key: "Demo2",
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
