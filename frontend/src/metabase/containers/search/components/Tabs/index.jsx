/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { Button, Tabs, Input } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";
import "./index.css";
import { getSearchQueryLink } from "../../shared/utils";
import DashboardsList from "../../../dashboards/components/Dashboards/List";
import PageList from "../Page/Index";
import CreatorList from "../Creator/Index";
import DataSetList from "../DataSet/Index";
import MyTables from "../MyTables/Index";
import { createModalShowAction } from "metabase/redux/control";
import cx from "classnames";
import {
  getCreatorQueryLink,
  isCreator, isGrowthPage, isMyStudio,
  isSearch,
} from "metabase/containers/dashboards/shared/utils";
import Link from "metabase/core/components/Link";
import { useDeviceInfo } from "metabase-lib/lib/Device";
import { loginModalShowAction } from "metabase/redux/control";
import { trackStructEvent } from "metabase/lib/analytics";
import Tooltip from "metabase/components/Tooltip";
import Icon from "metabase/components/Icon";
import { debounce } from "lodash";
import * as MetabaseAnalytics from "metabase/lib/analytics";
import { sortMap } from "metabase/containers/dashboards/shared/config";
import { isFgaPath } from "metabase/growth/utils/utils";

const Index = ({
  router,
  user,
  data,
  model,
  name,
  className,
  setLoginModalShow,
  setCreateModalShow,
  creatorViewType,
  hideTabsBar = false,
  showTabs = {
    all: true,
    dashboard: true,
    card: true,
    favorite: true,
    table: true,
  },
  hideToggleView = false,
}) => {
  const [isList, setIsList] = useState(creatorViewType === "list");
  const { isMobile } = useDeviceInfo();

  const isOwnCreator = user && user.name === (name || router?.params?.name);

  const isFavoritesTab = model === "favorite";
  const isMyTablesTab = model === "table";
  const isCreatorTabStyle = (isCreator() || isGrowthPage() || isMyStudio()) && isOwnCreator;
  const isFga = isFgaPath();
  const isCreatorAndOwner = () => {
    return (isCreator() || isGrowthPage() || isMyStudio()) && router?.params?.name === user?.name;
  };

  const tabData = [
    {
      key: "all",
      tab: "All",
      render: params => {
        return <DashboardsList isCommon={isSearch()} {...params} />;
      },
      show: !!showTabs?.all,
    },
    {
      key: "dashboard",
      tab: "Dashboards",
      render: params => {
        return <DashboardsList model="dashboard" {...params} />;
      },
      show: !!showTabs?.dashboard,
    },
    {
      key: "card",
      tab: "Charts",
      render: params => {
        return <DashboardsList model="card" {...params} />;
      },
      show: !!showTabs?.card,
    },
    {
      key: "favorite",
      tab: "My Favorites",
      render: params => {
        return <DashboardsList model="favorite" {...params} />;
      },
      show: !!showTabs?.favorite && (((isGrowthPage() || isCreator()) && isOwnCreator) || isMyStudio()),
    },
    {
      key: "table",
      tab: "My Datasets",
      render: params => {
        return <MyTables {...params} />;
      },
      show: !!showTabs?.table && (((isGrowthPage() || isCreator()) && isOwnCreator) || isMyStudio()),
    },
    {
      key: "creator",
      tab: "Creators",
      render: params => {
        return <CreatorList {...params} />;
      },
      show: isSearch(),
    },
    {
      key: "dataset",
      tab: "Datasets",
      render: params => {
        return <DataSetList {...params} />;
      },
      show: isSearch(),
    },
    {
      key: "page",
      tab: "Pages",
      render: params => {
        return <PageList {...params} />;
      },
      show: isSearch(),
    },
    // {
    //   key: "create",
    //   tab: "Create",
    //   render: params => {
    //     return null;
    //   },
    //   show: isFga&&isCreator(),
    // },
  ];

  const showSwitchGraph = (isCreator() || isMyStudio()) && !isMyTablesTab;

  const getTab = (key, tab) => {
    const num = data && data[key];
    const numStr = num !== undefined ? `(${num})` : "";
    return (
      <Link
        to={getUrl(key)}
        onClick={e => e.preventDefault()}
      >{`${tab} ${numStr}`}</Link>
    );
  };

  const getUrl = model => {
    const linkFunc = isSearch() ? getSearchQueryLink : getCreatorQueryLink;
    const getSortBy = () => {
      if (model === "favorite") {
        return "favorite_time";
      }
      if (isCreatorAndOwner()) {
        return "created_at";
      }
      return "views";
    };
    return linkFunc({
      ...router?.location?.query,
      model,
      current: 1,
      q: !isFavoritesTab ? router?.location?.query?.q : "",
      sortDirection: sortMap.descend,
      sortBy: getSortBy(),
    });
  };

  const renderSwitchGraph = () => {
    const changeHandler = debounce(val => {
      const link = getCreatorQueryLink({
        ...router?.location?.query,
        q: val,
      });
      router.replace(link);
      MetabaseAnalytics.trackStructEvent(`search tabs search ${val}`);
    }, 1000);
    return (
      <div className="search__tabs-other flex justify-end">
        {!isFavoritesTab && !isMyTablesTab && (
          <Input.Search
            allowClear
            placeholder="Search..."
            onChange={e => changeHandler(e.target.value)}
            className="search__tabs-search"
          />
        )}
        {isFga && (
          <Button
            className="ml1 text-center"
            type="primary"
            onClick={() => {
              setCreateModalShow({show: true})
            }}
          >
            Create
          </Button>
        )}
        {!isFga && !hideToggleView && (
          <div
            className="ml1 p1 cursor-pointer"
            onClick={() => {
              setIsList(!isList);
              const newState = !isList ? "list" : "grid";
              trackStructEvent(`search click switch ${newState}`);
              localStorage.setItem("creator-view-type", newState);
            }}
          >
            <Tooltip tooltip={isList ? "Grid view" : "List view"}>
              <Icon
                name={isList ? "switch_list" : "switch_grid"}
                size={20}
                color={"#A6AABE"}
              />
            </Tooltip>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cx(
        "search__tabs relative",
        { creator__tabs: isCreatorTabStyle },
        className,
      )}
    >
      <Tabs
        key={data ? Object.keys(data).join(",") : ""}
        activeKey={model}
        size="large"
        tabBarGutter={isMobile ? 20 : null}
        animated={false}
        tabBarStyle={hideTabsBar ? {display: "none"} : {}}
        destroyInactiveTabPane={true}
        onChange={model => {
          router.replace(getUrl(model));
          trackStructEvent(`search tab click ${model}`);
        }}
      >
        {tabData
          .filter(item => item.show)
          .map(item => {
            return (
              <Tabs.TabPane tab={getTab(item.key, item.tab)} key={item.key}>
                {model === item.key &&
                  item.render({
                    router,
                    user,
                    name,
                    setLoginModalShow,
                    isList,
                  })}
              </Tabs.TabPane>
            );
          })}
      </Tabs>
      {showSwitchGraph && renderSwitchGraph()}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
    creatorViewType: isCreator() || isGrowthPage() || isMyStudio()
      ? localStorage.getItem("creator-view-type") || "list"
      : "list",
  };
};

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
  setCreateModalShow: createModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
