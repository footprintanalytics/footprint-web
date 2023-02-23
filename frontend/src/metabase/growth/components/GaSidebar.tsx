import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
const { Sider } = Layout;
import { BarChartOutlined, TeamOutlined } from "@ant-design/icons";
import "../css/utils.css";

interface IGaSidebarProp {
  className?: string;
  currentProject?: string;
  router: any;
  location: any;
  items?: [any];
  projects?: [any];
}
export default function GaSidebar(prop: IGaSidebarProp) {
  const { currentProject, router, location, items, projects } = prop;

  const items_temp = [
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
  const rootSubmenuKeys: any[] = [];
  items?.map(i => {
    rootSubmenuKeys.push(i.label);
  });
  const [tab, setTab] = useState<string>();
  useEffect(() => {
    if (location.query.tab) {
      setTab(location.query.tab);
    } else {
      setTab("");
    }
  }, [location.query.tab]);

  const [openKeys, setOpenKeys] = useState<string[]>([tab!]);

  const onOpenChange: MenuProps["onOpenChange"] = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  return (
    <Sider
      trigger={null}
      width="250px"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        height: "100%",
        position: "fixed",
        background: "white",
        borderRight: "1px solid #dcdee4",
      }}
    >
      <Menu
        style={{
          borderRight: "0px",
          width: "100%",
          paddingBottom: 50,
          paddingTop: 20,
        }}
        theme="light"
        // className="ant-menu-inline ant-menu-item"
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        selectedKeys={[tab!]}
        onSelect={item => {
          console.log("select", item);
          router.push({
            pathname: location.pathname,
            query: { ...location.query, tab: item.key },
          });
        }}
        // defaultSelectedKeys={[items[0].key]}
        items={items ? items : items_temp}
      />
      {/* <div className="mt-10 flex flex-column items-center">
        <Button
          type="dashed"
          onClick={() => {
            message.info("Coming soon!");
          }}
        >
          Edit Menu
        </Button>
      </div> */}
    </Sider>
  );
}
