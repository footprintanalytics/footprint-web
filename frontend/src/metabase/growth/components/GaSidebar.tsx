import React, { useState, useEffect } from "react";
import { Button, Layout, Menu, message } from "antd";

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
  location: any;
}
export default function GaSidebar(prop: IGaSidebarProp) {
  const { currentProject, router, location } = prop;
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
  const [tab, setTab] = useState<string>();
  useEffect(() => {
    if (location.query.tab) {
      setTab(location.query.tab);
    } else {
      setTab("project");
    }
  }, [location.query.tab]);
  return (
    <Sider
      collapsible
      className="flex flex-col h-full"
      trigger={null}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        background: "white",
        borderRight: "1px solid #dcdee4",
      }}
    >
      <Menu
        style={{ borderRight: "0px", width: "100%" }}
        theme="light"
        mode="inline"
        selectedKeys={[tab!]}
        onSelect={item => {
          console.log("select", item);
          router.push({
            pathname: "/growth",
            query: { ...router.query, tab: item.key },
          });
        }}
        // defaultSelectedKeys={[items[0].key]}
        items={items}
      />
      <div className="mt-10 flex flex-column items-center">
        <Button
          type="dashed"
          onClick={() => {
            message.info("Coming soon!");
          }}
        >
          Edit Menu
        </Button>
      </div>
    </Sider>
  );
}
