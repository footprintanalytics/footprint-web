import React, { useState, useEffect } from "react";
import { Divider, Image, Layout, Menu, Select, Button } from "antd";
import type { MenuProps } from "antd";

const { Sider } = Layout;
import { getChainDataList } from "metabase/query_builder/components/question/handle";
import "../css/utils.css";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { getUser, getFgaProject } from "metabase/selectors/user";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import { fga_menu_data_v2 } from "../utils/data";
import Link from "metabase/core/components/Link";
import GaProjectSearch from "metabase/ab/components/GaProjectSearch";
import {
  getGrowthProjectPath,
  saveLatestGAMenuTag,
  getLatestGAProject, isBusinessTypePath,
} from "../utils/utils";
import { getFgaChain } from "../../selectors/control";
import { resetFgaProtocolList, setFgaChain } from "../../redux/control";

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
  chain: any;
  resetFgaProtocolList: any;
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
  const {
    currentProject,
    router,
    location,
    currentMenu,
    projectObject,
    user,
    businessType,
    setFgaChain,
    chain,
    resetFgaProtocolList,
  } =
    props;
  const [menuData, setMenuData] = useState<MenuObjectProp>();
  // const [rootSubmenuKeys, setRootSubmenuKeys] = useState<any[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([currentMenu!]);
  const menuTitle = fga_menu_data_v2(businessType, projectObject, chain).menuTitle;
  const platformMenuTitle = fga_menu_data_v2(businessType, projectObject, chain).platformMenuTitle;
  const items = menuData?.menuTabs || [];
  const itemsPlatform = menuData?.platformMenuTabs || [];
  useEffect(() => {
    if (!projectObject) return;
    setMenuData(fga_menu_data_v2(businessType, projectObject, chain));
  }, [projectObject, chain]);

  useEffect(() => {
    if (location.pathname === "/fga" || location.pathname === "/fga/") {
      router.replace("/fga/game");
    }
  }, [location.pathname]);

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
                  setOpenKeys([i.key, child.key]);
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
  const toggle_platform_project = localStorage.getItem("toggle_platform_project");
  // const isProject = toggle_platform_project === "project"

  // @ts-ignore
  const chainData = getChainDataList({ includeAll: false }).filter(item => !item.noProtocol)
    .map(item => {
      return {
        ...item,
        value: item.transactionName || item.label,
      };
    });

  const pushFirstRouter = (chain: string | undefined) => {
    const menuData = fga_menu_data_v2(businessType, projectObject, chain);
    const menuKeys = menuData.keys;
    const firstMenu = menuKeys[0];
    const hasNewChainData = projectObject?.contractAddress?.find((item: any) => item.chain === chain);
    const hasNewChainCurrentMenu = menuKeys.includes(currentMenu);
    // @ts-ignore
    const defaultProject = getChainDataList({ includeAll: false })?.find(item => item.label === chain)?.defaultProject ||
      {
        protocolSlug: "the-sandbox",
        protocolName: "The Sandbox",
      };
    setTimeout(() => {
      router.replace({
        pathname: getGrowthProjectPath(
          hasNewChainData ? projectObject?.protocolSlug : defaultProject?.protocolSlug,
          hasNewChainData && hasNewChainCurrentMenu ? currentMenu : firstMenu,
        ),
      });
    }, 1000);

  };

  const showChainSelect = businessType === "public-chain";

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
      <div style={{ display: "relative", height: "100%" }}>
        {projectObject && items?.length > 0 ? (
          <div className="flex flex-column">
            {isBusinessTypePath("game") && (
              <>
                <div className="ga-side-bar__title">
                  <h3>{platformMenuTitle}</h3>
                </div>
                {/* <Link to="/fga/game/project-list" >
                  <Button type="text" style={{
                    width: "100%",
                    display: "flex",
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 26,
                    height: 40,
                    margin: "8px 0"
                  }}>All Projects</Button>
                </Link>*/}
                <Menu
                  key={chain}
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
                <div className="ga__line mt1" />
              </>
            )}
            {!isBusinessTypePath("game") && itemsPlatform.length > 0 && (<>
                <div className="ga-side-bar__title">
                  <h3>{platformMenuTitle}</h3>
                </div>
                {showChainSelect && (<div className={"flex justify-center pm2"}>
                  <Select
                    defaultValue={chain}
                    style={{ width: 218 }}
                    dropdownStyle={{
                      background: "#1C1C1E",
                      color: "white",
                      border: "1px solid #ffffff30",
                    }}
                    onChange={value => {
                      pushFirstRouter(value);
                      setFgaChain(value);
                      resetFgaProtocolList();
                    }}
                  >
                    {chainData.map(n => (
                      <Select.Option key={`${n.value}-${n.label}`} value={n.value}>
                        <div className="question-side__chains-item">
                          <Image src={n.icon} width={20} height={20} preview={false} />
                          <span className="ml1">{n.label}</span>
                        </div>
                      </Select.Option>
                    ))}
                  </Select>
                </div>)}

                <Menu
                  key={chain}
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
                <div className="ga__line mt1" />
              </>
            )}

            {items?.length > 0 &&
              (<>
                <div className="ga-side-bar__title">
                  <h3>{menuTitle}</h3>
                </div>
                {/*<GaProjectSearch
                  location={location}
                  disableLoadList={true}
                  enableTour={true}
                />*/}
                <Menu
                  style={{
                    borderRight: "0px",
                    width: "100%",
                    flex: 1,
                    paddingBottom: 80,
                  }}
                  theme="light"
                  mode="inline"
                  openKeys={[...openKeys, "settings"]}
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
          </div>
        ) : (
          <LoadingSpinner message="Loading..." />
        )}
        <div
          style={{
            position: "fixed",
            bottom: "0px",
            height: 50,
            lineHeight: "50px",
            width: "240px",
            color: "white",
            textAlign: "center",
            background: "#1B1B1E"
          }}
        >
          beta v0.1.0
        </div>
      </div>
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
  resetFgaProtocolList,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GaSidebar));
