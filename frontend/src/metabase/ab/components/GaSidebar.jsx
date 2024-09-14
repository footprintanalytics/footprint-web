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
import {
  getGrowthProjectPath,
  getLatestGAProject,
  isABPath,
  isBusinessTypePath,
  saveLatestGAMenuTag,
} from "../utils/utils";
import { getFgaChain } from "../../selectors/control";
import { resetFgaProtocolList, setFgaChain } from "../../redux/control";
import { getOssUrl } from "metabase/lib/image";

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
    selectCallback,
    style,
  } = props;
  const [openKeys, setOpenKeys] = useState([currentMenu]);

  const menuData = fga_menu_data_v2(businessType, projectObject, chain, user);
  const menuTitle = menuData?.menuTitle;
  const platformMenuTitle = menuData?.platformMenuTitle;
  const items = menuData?.menuTabs || [];
  const itemsPlatform = menuData?.platformMenuTabs || [];
  const totalItems = [...items, ...itemsPlatform].filter(Boolean);
  const showPlatform = false

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
    const menuData = fga_menu_data_v2(businessType, projectObject, chain, user);
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
      style={style}
    >
      <div style={{ display: "relative", height: "100%" }}>
        {items?.length > 0 ? (
          <div className="flex flex-column ">
            {showPlatform &&<>
              {platformMenuTitle && <div className="ga-side-bar__title">
                <h3>{platformMenuTitle}</h3>
              </div>
              }
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
            </>
            }
            {menuTitle && <div className="ga-side-bar__title">
              <h3>{menuTitle}</h3>
            </div>
            }
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
                if (isABPath()) {
                  if (item.key === 'quest') {
                    window.open('https://t.me/GrowthlyBot/App', '_blank')
                    return
                  }

                  router.push({
                    pathname: getGrowthProjectPath(
                      currentProject ?? getLatestGAProject() ?? "",
                      item.key,
                    ),
                  });
                } else {
                  selectCallback?.(item)
                }
              }}
              items={items}
            />
          </div>
        ) : (
          <LoadingSpinner message="Loading..." />
        )}
        {/*{businessType === "growth" && <div className="ga-side-bar__bottom-panel cursor-pointer" style={{color: "white"}} onClick={() => {
          window.open("/growth-fga/campaign/detail", "_blank")
        }}>Quest Detail</div>}*/}
        {isABPath() && <div
          className="ga-side-bar__bottom-panel"
        >
          {/*<div>Beta v0.1.2</div>*/}
          <div>Powered by <img style={{marginRight:2, height: 16, width: 16}} src={getOssUrl("/logo80.png?1=1&image_process=resize,w_16/crop,h_16/format,png")}/><Link to={"/"}>Footprint Analytics</Link></div>
        </div>
        }
      </div>
    </Sider>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectObject: getFgaProject(state),
    currentProject: props.params.project,
    currentMenu: props.currentMenu || props.params.menu,
    businessType: props.businessType || props.params.businessType,
    chain: getFgaChain(state),
  };
};

const mapDispatchToProps = {
  setFgaChain: setFgaChain,
  resetFgaProtocolList,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GaSidebar));
