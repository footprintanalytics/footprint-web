import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
const { Sider } = Layout;
import "../css/utils.css";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { getUser, getFgaProject } from "metabase/selectors/user";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import { fga_menu_data, top_protocols } from "../utils/data";
import {
  getGrowthProjectPath,
  getLatestGAMenuTag,
  saveLatestGAMenuTag,
  getLatestGAProject,
  getGaMenuTabs,
} from "../utils/utils";

interface IGaSidebarProp {
  className?: string;
  currentProject?: string;
  router: any;
  user: any;
  currentTab?: string;
  location: any;
  items: any[];
  projects?: any[];
  projectObject?: any;
}
const GaSidebar = (props: IGaSidebarProp) => {
  const { currentProject, router, location, currentTab, projectObject, user } =
    props;
  const rootSubmenuKeys: any[] = [];
  const [items, setItems] = useState<any[]>([]);
  const [tab, setTab] = useState<string>(currentTab!);
  useEffect(() => {
    const itemsTemp: any[] = getGaMenuTabs(
      fga_menu_data,
      (projectObject ?? top_protocols[0]).protocolType,
      (projectObject ?? top_protocols[0]).nftCollectionAddress?.length > 0,
      user,
    )?.menuTabs;
    itemsTemp?.map(i => {
      rootSubmenuKeys.push(i.key);
    });
    setItems(itemsTemp);
  }, [projectObject]);

  useEffect(() => {
    // setTab(
    //   currentTab ??
    //     (items[0]?.children?.length > 0
    //       ? items[0].children[0].key
    //       : items[0]?.key),
    // );
    if (currentTab) {
      setTab(currentTab);
    }
  }, [currentTab, items]);

  const [openKeys, setOpenKeys] = useState<string[]>([currentTab!]);

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
      <>
        {items?.length > 0 ? (
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
              saveLatestGAMenuTag(item.key);
              setTab(item.key);
              router.push({
                pathname: getGrowthProjectPath(
                  currentProject ?? getLatestGAProject() ?? "",
                  item.key,
                ),
                // query: { ...location.query, tab: item.key },
              });
            }}
            items={items}
          />
        ) : (
          <LoadingSpinner message="Loading..." />
        )}
      </>
    </Sider>
  );
};

const mapStateToProps = (state: any, props: any) => {
  return {
    user: getUser(state),
    projectObject: getFgaProject(state),
    currentProject: props.params.project,
    currentTab: props.params.menu,
  };
};

export default withRouter(connect(mapStateToProps)(GaSidebar));
