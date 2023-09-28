import React, { useState, useEffect } from "react";
import { Divider, Layout, Menu, Select } from "antd";
import type { MenuProps } from "antd";
const { Sider } = Layout;
import "../css/utils.css";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { getUser, getFgaProject } from "metabase/selectors/user";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import { fga_menu_data_v2 } from "../utils/data";
import GaProjectSearch from "metabase/ab/components/GaProjectSearch";
import {
  getGrowthProjectPath,
  getLatestGAMenuTag,
  saveLatestGAMenuTag,
  getLatestGAProject,
  getGaMenuTabs,
} from "../utils/utils";
import { set } from "js-cookie"
import { getFgaChain } from "../../selectors/control";
import { push } from "react-router-redux";
import { setFgaChain } from "../../redux/control";

interface IGaSidebarProp {
  className?: string;
  businessType?: string;
  currentProject?: string;
  router: any;
  user: any;
  currentMenu?: string;
  location: any;
  items: any[];
  projects?: any[];
  projectObject?: any;
  getFgaChain?: any;
  setFgaChain?: any;
}

interface MenuObjectProp {
  menuTabs: any;
  platformMenuTabs: any;
  keys: any;
  dashboardMap: any;
  liveKeys: any;
  menuTitle: any;
  platformMenuTitle: any;
}
const GaSidebar = (props: IGaSidebarProp) => {
  const { currentProject, router, location, currentMenu, projectObject, user, businessType, setFgaChain, getFgaChain } =
    props;
  console.log("projectObject", projectObject)
  const [menuData, setMenuData] = useState<MenuObjectProp>();
  // const [rootSubmenuKeys, setRootSubmenuKeys] = useState<any[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([currentMenu!]);
  const menuTitle = fga_menu_data_v2(businessType, projectObject, user).menuTitle;
  const platformMenuTitle = fga_menu_data_v2(businessType, projectObject, user).platformMenuTitle;
  const items = menuData?.menuTabs || [];
  const itemsPlatform = menuData?.platformMenuTabs || [];
  useEffect(() => {
    if (!projectObject) return;
    setMenuData(fga_menu_data_v2(businessType, projectObject, user));
  }, [projectObject]);

  useEffect(() => {
    console.log("router", props, router)
    if (!businessType) {
      router.replace("/fga/public-chain")
    }
  }, [businessType])


  useEffect(() => {
    if (currentMenu) {
      [...items, ...itemsPlatform]?.map(i => {
        if (i.key === currentMenu) {
          setOpenKeys([i.key]);
          return;
        } else if (i.children?.length > 0) {
          i.children.map((child: { key: string; children: [] }) => {
            if (child.key === currentMenu) {
              setOpenKeys([i.key]);
            } else if (child.children?.length > 0) {
              child.children.map((child2: { key: string }) => {
                if (child2.key === currentMenu) {
                  setOpenKeys([i.key,child.key]);
                }
              });
            }
          });
        }
      });
    }
  }, [currentMenu, items]);

  const onOpenChange: MenuProps["onOpenChange"] = keys => {
    // const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    // if (!rootSubmenuKeys.includes(latestOpenKey)) {
    //   setOpenKeys(keys);
    // } else {
    //   setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    // }
    setOpenKeys(keys);
  };
  const toggle_platform_project = localStorage.getItem('toggle_platform_project')
  // const isProject = toggle_platform_project === "project"
  return (
    <Sider
      className="ga-side-bar"
      trigger={null}
      width="250px"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        height: "100%",
        position: "fixed",
        background: "#1B1B1E",
        borderRight: "1px solid #ffffff20",
      }}
    >
      <>
        {projectObject && items?.length > 0 ? (
          <>
            {itemsPlatform.length > 0 && (<>
              <div className="ga-side-bar__title">
                <h3>{platformMenuTitle}</h3>
              </div>
              <div className={"flex justify-center pm2"}>
                <Select
                  defaultValue={"Ethereum"}
                  style={{ width: 218 }}
                  dropdownStyle={{
                    background: "#1C1C1E",
                    color: "white",
                    border: "1px solid #ffffff30"
                  }}
                  onChange={value => {
                    setFgaChain(value);
                  }}
                  options={
                    [
                      { value: "Ethereum", label: "Ethereum" },
                      // { value: "Polygon", label: "Polygon" },
                      // { value: "BNB Chain", label: "BNB Chain" },
                    ]
                  }
                />
              </div>
              <Menu
                className="ga-side-bar-menu"
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
                items={itemsPlatform}
              />
              <div className="ga__line mt1"/>
            </>
            )}

            {items?.length > 0 &&
              (<>
                <div className="ga-side-bar__title">
                  <h3>{menuTitle}</h3>
                </div>
                <GaProjectSearch
                  location={location}
                />
                <Menu
                  style={{
                    borderRight: "0px",
                    width: "100%",
                    flex: 1,
                    paddingBottom: 80,
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
              </>)
            }
          </>
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
    businessType: props.params.businessType,
    chain: getFgaChain(state),
  };
};

const mapDispatchToProps = {
  setFgaChain: setFgaChain,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GaSidebar));
