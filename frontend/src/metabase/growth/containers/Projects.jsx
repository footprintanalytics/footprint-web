/* eslint-disable react/prop-types */
import React from "react";
import { Card, Tabs } from "antd";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import MyProjects from "../components/MyProjects";

const Projects = props => {
  const { router, location, children, user } = props;
  const tabs = [
    {
      label: "My Projects",
      key: "projects",
      children: <MyProjects router={router} />,
    },
    {
      label: "My Competitors",
      key: "competitors",
      children: "Coming Soon~",
    },
  ];
  return (
    <div
      className=" footprint-mt-m "
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Card style={{ minWidth: 800, maxWidth: 1000 }}>
        <Tabs defaultActiveKey="1" type="card" centered items={tabs} />
      </Card>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(Projects);
