import React from "react";
import { Layout, Menu } from "antd";

const { Sider } = Layout;
import {
  BarChartOutlined,
  ShopOutlined,
  TeamOutlined,
} from "@ant-design/icons";

interface IGaSidebarProp {
  className?: string;
  currentProject?: string;
  router: any;
}
export default function GaSidebar(prop: IGaSidebarProp) {
  const { currentProject, router } = prop;
  const items = [
    {
      key: "project",
      icon: React.createElement(ShopOutlined),
      label: `Project`,
    },
    {
      key: "analytics",
      icon: React.createElement(BarChartOutlined),
      label: `Analytics`,
      disabled: currentProject === "create_new" ? true : false,
    },
    {
      key: "activation",
      icon: React.createElement(TeamOutlined),
      label: `Activation`,
      disabled: currentProject === "create_new" ? true : false,
    },
  ];

  return (
    <Sider
      collapsible
      className=""
      trigger={null}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        marginTop: 60,
        background: "white",
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <Menu
        style={{ height: "100%" }}
        theme="light"
        mode="inline"
        onSelect={item => {
          console.log("select", item);
          router.push({
            pathname: "/growth",
            query: { ...router.query, tab: item.key },
          });
        }}
        defaultSelectedKeys={[items[0].key]}
        items={items}
      />
    </Sider>
  );
}
