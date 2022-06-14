/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { push, replace } from "react-router-redux";
import { Input, message, Tree } from "antd";
import { DownOutlined } from "../../../lib/ant-icon";
import { Flex } from "grid-styled";
import { debounce, flatten, flattenDeep, some, get } from "lodash";
import cx from "classnames";
import Icon from "metabase/components/Icon";
import "./FeaturesSide.css";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import { getUser, getUserSubscribeInfo } from "metabase/selectors/user";
import { menu, menuDetailList } from "metabase/new-service";
import {
  featuresSideHideAction,
  loginModalShowAction,
} from "metabase/redux/control";
import Button from "metabase/components/Button";
import { browserHistory } from "react-router";
import { trackStructEvent } from "metabase/lib/analytics";
import Link from "metabase/components/Link";
import { formatOssUrl, getOssUrl } from "metabase/lib/image";
import SubscribeModal from "metabase/components/SubscribeModal";
import { guestUrl } from "metabase/lib/urls";

const { DirectoryTree } = Tree;

const FeaturesSide = ({
  replace,
  defaultMenu,
  defaultSubMenu,
  loadData,
  featuresSideHideAction,
  menuData,
  hasSeeMore,
  hasSearch,
  type,
  user,
  subscribeInfo,
  setLoginModalShow,
}) => {
  const [searchKey, setSearchKey] = useState();
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [dataSets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const isOpen = subscribeInfo.subscribeStatus === "enable";
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (searchKey) {
      setExpandedKeys([...flatten(dataSets.map(item => item.value))]);
    } else {
      setExpandedKeys([]);
    }
  }, [dataSets, searchKey]);

  const isExistKey = key => {
    return m => m && m.toLowerCase().indexOf(key) !== -1;
  };

  const filterMenuFunction = menuItem => {
    if (menuItem && menuItem.isHidden) {
      return false;
    }
    if (!searchKey) {
      return true;
    }
    const key = searchKey.trim().toLowerCase();
    const subMenus = menuItem.subMenus || [];
    const matchList = [menuItem.label, ...flatten(subMenus.map(n => n.label))];
    return some(matchList, isExistKey(key));
  };

  const filterSubMenuFunction = (menuItem, subMenuItem) => {
    if (menuItem && subMenuItem.isHidden) {
      return false;
    }
    if (!searchKey) {
      return true;
    }
    const key = searchKey.trim().toLowerCase();
    const matchList = [menuItem.label, subMenuItem.label];
    return some(matchList, isExistKey(key));
  };

  const renderSearch = () => {
    const changeHandler = debounce(val => {
      setSearchKey(val);
    }, 500);

    return (
      <Input
        allowClear
        suffix={<Icon name="search" size={14} style={{ color: "#d9d9d9" }} />}
        placeholder="Search dashboard..."
        onChange={e => changeHandler(e.target.value)}
        style={{ margin: "12px 0 12px" }}
      />
    );
  };

  const isExistMenu = (list, defaultMenu, defaultSubMenu) => {
    if (list.length === 0 || !defaultMenu || !defaultSubMenu) {
      return;
    }
    const menuItem = list.find(item => item.value === defaultMenu);
    if (!menuItem || !menuItem.subMenus) {
      return;
    }
    const subMenuItem = menuItem.subMenus.find(
      item => item.value === defaultSubMenu,
    );
    if (!subMenuItem) {
      return;
    }
    return {
      menuItem,
      subMenuItem,
    };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const getMenu = async () => {
      let array;
      if (menuData && menuData.length > 0) {
        array = menuData;
      } else {
        setLoading(true);
        const { list } = await menu();
        array = list;
        setLoading(false);
      }
      setDatasets(array);
      return array;
    };

    const loadFirstMenuData = data => {
      const firstObject = data[0];
      const menu = firstObject.value;
      const subMenu =
        firstObject.subMenus && firstObject.subMenus.length > 0
          ? firstObject.subMenus[0].value
          : undefined;
      featuresSideHideAction({ hide: false });
      loadDataDefault(menu, subMenu);
    };

    const redirectToChart = item => {
      replace(guestUrl(item));
    };

    const loadMenuDetailList = async (data, defaultMenu, defaultSubMenu) => {
      const hide = message.loading("Loading...", 0);
      try {
        const menuDetail = await menuDetailList({
          menu: defaultMenu,
          subMenu: defaultSubMenu,
        });
        if (menuDetail && menuDetail.data && menuDetail.data.length > 0) {
          redirectToChart(menuDetail.data[0]);
        } else {
          loadFirstMenuData(data);
        }
      } catch (e) {
        loadFirstMenuData(data);
      } finally {
        hide();
      }
    };

    const handle = async () => {
      let data = dataSets;
      if (data.length === 0) {
        data = await getMenu();
      }
      const exist = isExistMenu(data, defaultMenu, defaultSubMenu);
      if (!exist) {
        loadFirstMenuData(data);
        return;
      }
      const { menuItem, subMenuItem } = exist;
      if (!menuItem.isHidden && !subMenuItem.isHidden) {
        loadDataDefault(defaultMenu, defaultSubMenu);
        return;
      }
      loadMenuDetailList(data, defaultMenu, defaultSubMenu);
    };

    handle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultMenu, defaultSubMenu]);

  const loadDataDefault = (menu, subMenu) => {
    loadData && loadData({ menu, subMenu });
    const key = subMenu ? `${menu}-${subMenu}` : menu;
    setSelectedKeys([key]);
    setExpandedKeys([menu]);
  };

  const onSubItemInnerOnclick = async (menuItem, subMenuItem) => {
    trackStructEvent(`click ${menuItem.value} ${subMenuItem.value}`);
    replace(`/${type}/${menuItem.value}/${subMenuItem.value}`);
    replaceQuery();
  };

  const onSubItemInnerDebounced = debounce(onSubItemInnerOnclick, 300);

  const onItemInnerOnclick = menuItem => {
    if (menuItem.value === "Featured") {
      trackStructEvent(`click ${menuItem.value}`);
      replace(`/`);
      replaceQuery();
    }
  };

  const replaceQuery = () => {
    browserHistory &&
      browserHistory.getCurrentLocation() &&
      history.replaceState(
        null,
        document.title,
        browserHistory.getCurrentLocation().pathname,
      );
  };

  const onItemInnerDebounced = debounce(onItemInnerOnclick, 300);

  const onExpand = expanded => {
    setExpandedKeys(expanded);
  };

  const switcherIcon = () => {
    return (
      <div
        style={{
          height: 40,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 10,
        }}
      >
        <DownOutlined />
      </div>
    );
  };

  const getMenuSeoLink = menuItem => {
    const { subMenus, value } = menuItem || {};
    if (value === "Featured") {
      return "/";
    }
    if (subMenus && subMenus.length > 0) {
      const subMenuItem = subMenus[0] || {};
      return `/${type}/${menuItem.value}/${subMenuItem.value}`;
    }
    return "";
  };

  const renderDataSet = () => {
    const treeData = dataSets.filter(filterMenuFunction).map(menuItem => ({
      title: (
        <Link
          className={cx("flex align-center footprint-primary-text")}
          style={{ height: 36 }}
          to={getMenuSeoLink(menuItem)}
          onClick={e => {
            e.preventDefault();
            onItemInnerDebounced(menuItem);
          }}
        >
          <img
            src={`${formatOssUrl(menuItem.icon)}`}
            className="Features-side-menu-icon"
            alt={menuItem.value}
          />
          {menuItem.label}
        </Link>
      ),
      key: menuItem.value,
      children:
        menuItem.subMenus &&
        menuItem.subMenus
          .filter(n => filterSubMenuFunction(menuItem, n))
          .map(subMenuItem => ({
            title: (
              <Link
                to={`/${type}/${menuItem.value}/${subMenuItem.value}`}
                className="features-side__sub-menus"
                onClick={e => {
                  e.preventDefault();
                  setSelectedKeys([`${menuItem.value}-${subMenuItem.value}`]);
                  onSubItemInnerDebounced(menuItem, subMenuItem);
                }}
              >
                <div className="features-side__sub-menus-link">
                  <span
                    className="features-side__sub-menus-title footprint-secondary-text1"
                    style={{ WebkitBoxOrient: "vertical" }}
                  >
                    {subMenuItem.label}
                  </span>
                  <span
                    className="features-side__sub-menus-desc footprint-secondary-text2"
                    style={{ WebkitBoxOrient: "vertical" }}
                  >
                    {subMenuItem.desc}
                  </span>
                </div>
                {subMenuItem.isHot && (
                  <img
                    className="features-side__sub-menus-hot"
                    src={getOssUrl("icon_hot.svg")}
                  />
                )}
              </Link>
            ),
            key: `${menuItem.value}-${subMenuItem.value}`,
          })),
    }));

    const renderSeoData = () => {
      const links = flattenDeep(
        treeData &&
          treeData.map(a => {
            return [
              a && a.children && a.children.map(b => get(b, "title.props.to")),
            ];
          }),
      );
      return (
        <div style={{ display: "none" }}>
          {links.map(link => {
            return <a key={link} href={link} />;
          })}
        </div>
      );
    };

    return (
      <div className="flex-full pt1 Features-side-tree">
        {treeData.length > 0 && (
          <DirectoryTree
            multiple
            defaultExpandAll={true}
            expandedKeys={expandedKeys}
            defaultSelectedKeys={[`${defaultMenu}-${defaultSubMenu}`]}
            selectedKeys={selectedKeys}
            onExpand={onExpand}
            showIcon={false}
            switcherIcon={switcherIcon()}
            treeData={treeData}
          />
        )}
        {renderSeoData()}
      </div>
    );
  };

  const renderCreate = () => {
    return (
      <div style={{ display: "flex" }} className="Features-side-create">
        <Link to={"/explore"} className="mx1" style={{ flex: 1 }}>
          <Button
            className="Features-side-create-button"
            onClick={() => {
              trackStructEvent(`click See More Analytics`);
            }}
          >
            {"See More \nAnalytics"}
          </Button>
        </Link>
        <Link
          className="mx1"
          style={{ flex: 1 }}
          onClick={e => {
            e.preventDefault();
            trackStructEvent(`home click Subscription`);
            if (!user) {
              setLoginModalShow({ show: true, from: "subscribe" });
              return;
            }
            setModal(true);
          }}
        >
          <Button className="Features-side-create-button">
            {isOpen ? "Subscribed" : "Subscription"}
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <Flex
      flexDirection="column"
      className="full-height overflow-auto Features-side__root"
    >
      {hasSearch && renderSearch()}
      {loading ? <LoadingSpinner /> : renderDataSet()}
      {hasSeeMore && renderCreate()}
      {modal && (
        <SubscribeModal
          onClose={() => {
            setModal(false);
          }}
        />
      )}
    </Flex>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
    subscribeInfo: getUserSubscribeInfo(state),
  };
};

const mapDispatchToProps = {
  replace,
  featuresSideHideAction,
  onChangeLocation: push,
  setLoginModalShow: loginModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(FeaturesSide);
