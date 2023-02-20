import React, { useState, useEffect } from "react";
import { Button, Layout, Menu, message, Select } from "antd";

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
  const [tab, setTab] = useState<string>();
  useEffect(() => {
    if (location.query.tab) {
      setTab(location.query.tab);
    } else {
      setTab("");
    }
  }, [location.query.tab]);

  const handleProjectChange = (value: string) => {
    router.push({
      pathname: location.pathname,
      query: { ...location.query, project_name: value },
    });
  };
  return (
    <Sider
      trigger={null}
      width="250px"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        background: "white",
        borderRight: "1px solid #dcdee4",
      }}
    >
      {projects && projects.length > 0 && (
        <Select
          value={currentProject}
          style={{ margin: "20px", width: "210px" }}
          onChange={handleProjectChange}
          options={projects}
        />
      )}

      <Menu
        style={{ borderRight: "0px", width: "100%" }}
        theme="light"
        mode="inline"
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
