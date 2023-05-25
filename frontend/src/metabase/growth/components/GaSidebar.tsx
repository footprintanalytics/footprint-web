import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
const { Sider } = Layout;
import "../css/utils.css";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { getUser, getFgaProject } from "metabase/selectors/user";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import { fga_menu_data, fga_menu_data_v2 } from "../utils/data";
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
  currentMenu?: string;
  location: any;
  items: any[];
  projects?: any[];
  projectObject?: any;
}
const GaSidebar = (props: IGaSidebarProp) => {
  const { currentProject, router, location, currentMenu, projectObject, user } =
    props;
  const [items, setItems] = useState<any[]>([]);
  const [rootSubmenuKeys, setRootSubmenuKeys] = useState<any[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([currentMenu!]);

  useEffect(() => {
    if (!projectObject) return;

    let protocolType = projectObject.protocolType;
    if(protocolType==='GameFi'&&projectObject.nftCollectionAddress?.length > 0){
      protocolType = 'GameFi_NFT'
    }
    const itemsTemp: any[] = fga_menu_data_v2(projectObject).menuTabs;
    const rootSubmenuKeysTemp: any[] = [];
    itemsTemp?.map(i => {
      rootSubmenuKeysTemp.push(i.key);
    });
    setRootSubmenuKeys(rootSubmenuKeysTemp);
    setItems(itemsTemp);
  }, [projectObject]);

  useEffect(() => {
    if (currentMenu) {
      console.log("currentMenu", currentMenu, items);
      items?.map(i => {
        if (i.key === currentMenu) {
          setOpenKeys([i.key]);
          return;
        }
        if (i.children?.length > 0) {
          i.children.map((child: { key: string }) => {
            if (child.key === currentMenu) {
              setOpenKeys([i.key]);
            }
          });
        }
      });
    }
  }, [currentMenu, items]);

  const onOpenChange: MenuProps["onOpenChange"] = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (!rootSubmenuKeys.includes(latestOpenKey)) {
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
        background: "#121728",
        borderRight: "1px solid #4A5568",
      }}
    >
      <>
        {projectObject && items?.length > 0 ? (
          <Menu
            style={{
              borderRight: "0px",
              width: "100%",
              flex: 1,
            }}
            theme="light"
            mode="inline"
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            selectedKeys={[currentMenu!]}
            onSelect={item => {
              saveLatestGAMenuTag(item.key);
              router.push({
                pathname: getGrowthProjectPath(
                  currentProject ?? getLatestGAProject() ?? "",
                  item.key,
                ),
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
    currentMenu: props.params.menu,
  };
};

export default withRouter(connect(mapStateToProps)(GaSidebar));
