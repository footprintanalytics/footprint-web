/* eslint-disable react/prop-types */

import React from "react";
import { Layout } from "antd";
import SideMenu from "./SideMenu";

const { Content } = Layout;

const HomeLayout = ({ children, location }) => (
  <Layout style={{ height: "calc(100vh - 60px)" }}>
    <SideMenu location={location} />
    <Content style={{ padding: 24, margin: 0, overflowY: "auto" }}>
      {children}
    </Content>
  </Layout>
);

export default HomeLayout;
