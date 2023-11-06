/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Image, Layout, Menu, Select } from "antd";
import "../css/utils.css";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { getFgaProject, getUser } from "metabase/selectors/user";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import Link from "metabase/core/components/Link";
import { getChainDataList } from "metabase/query_builder/components/question/handle";
import { fga_menu_data_v2 } from "../utils/data";
import { getGrowthProjectPath, getLatestGAProject, isBusinessTypePath, saveLatestGAMenuTag } from "../utils/utils";
import { getFgaChain } from "../../selectors/control";
import { resetFgaProtocolList, setFgaChain } from "../../redux/control";

const { Sider } = Layout;

const GaSidebar = (props) => {
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
  } = props;
  const [openKeys, setOpenKeys] = useState([currentMenu]);
  const menuData = fga_menu_data_v2(businessType, projectObject, chain);
  const menuTitle = menuData?.menuTitle;
  const platformMenuTitle = menuData?.platformMenuTitle;
  const items = menuData?.menuTabs || [];
  const itemsPlatform = menuData?.platformMenuTabs || [];
  const totalItems = [...items, ...itemsPlatform].filter(Boolean);

  useEffect(() => {
    if (location.pathname === "/fga" || location.pathname === "/fga/") {
      router.replace("/fga/game");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (currentMenu && totalItems?.length > 0) {
      totalItems.forEach(i => {
        if (i.key === currentMenu) {
          setOpenKeys([i.key]);
        } else if (i.children?.length > 0) {
          i.children.forEach((child) => {
            if (child.key === currentMenu) {
              setOpenKeys([i.key]);
            } else if (child.children?.length > 0) {
              child.children.forEach((child2) => {
                if (child2.key === currentMenu) {
                  setOpenKeys([i.key, child.key]);
                }
              });
            }
          });
        }
      })
    }

  }, [currentMenu]);

  const onOpenChange = keys => {
    setOpenKeys(keys);
  };

  // @ts-ignore
  const chainData = getChainDataList({ includeAll: false }).filter(item => !item.noProtocol)
    .map(item => {
      return {
        ...item,
        value: item.transactionName || item.label,
      };
    });

  const pushFirstRouter = (chain) => {
    const menuData = fga_menu_data_v2(businessType, projectObject, chain);
    const menuKeys = menuData.keys;
    const firstMenu = menuKeys[0];
    const hasNewChainData = projectObject?.contractAddress?.find((item) => item.chain === chain);
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

  return (
    <Sider
      className="ga-side-bar"
      trigger={null}
      width="250px"
    >
      <div style={{ display: "relative", height: "100%" }}>
        {items?.length > 0 ? (
          <div className="flex flex-column ">
            <div className="ga-side-bar__title">
              <h3>{platformMenuTitle}</h3>
            </div>
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
              selectedKeys={[currentMenu]}
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

            <div className="ga-side-bar__title">
              <h3>{menuTitle}</h3>
            </div>
            <Menu
              style={{
                borderRight: "0px",
                width: "100%",
                flex: 1,
                paddingBottom: 120,
              }}
              theme="light"
              mode="inline"
              openKeys={[...openKeys]}
              onOpenChange={onOpenChange}
              selectedKeys={[currentMenu]}
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
          </div>
        ) : (
          <LoadingSpinner message="Loading..." />
        )}
        <div
          className="ga-side-bar__bottom-panel"
        >
          <div>Beta v0.1.0</div>
          <div>Power by <Link to={"/"}>Footprint</Link></div>
        </div>
      </div>
    </Sider>
  );
};

const mapStateToProps = (state, props) => {
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
