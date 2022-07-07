/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { Tabs } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";
import "./index.css";
import { getSearchQueryLink } from "../../shared/utils";
import DashboardsList from "../../../dashboards/components/Dashboards/List";
import PageList from "../Page/Index";
import CreatorList from "../Creator/Index";
import DataSetList from "../DataSet/Index";
import CommonList from "../CommonPage/Index";
import cx from "classnames";
import {
  getCreatorQueryLink,
  isCreator,
  isSearch,
} from "metabase/containers/dashboards/shared/utils";
import Link from "metabase/components/Link";
import { useDeviceInfo } from "metabase-lib/lib/Device";
import { loginModalShowAction } from "metabase/redux/control";
import { trackStructEvent } from "metabase/lib/analytics";
import Tooltip from "metabase/components/Tooltip";
import Icon from "metabase/components/Icon";
import Search from "antd/es/input/Search";
import { debounce } from "lodash";
import * as MetabaseAnalytics from "metabase/lib/analytics";
import { sortMap } from "metabase/containers/dashboards/shared/config";

const Index = ({
  router,
  user,
  data,
  model,
  name,
  className,
  setLoginModalShow,
  creatorViewType,
}) => {
  const [isList, setIsList] = useState(creatorViewType === "list");

  const { isMobile } = useDeviceInfo();

  const isOwnCreator = user && user.name === router?.params?.name;

  const isFavoritesTab = model === "favorite";

  const tabData = [
    {
      key: "all",
      tab: "All",
      render: params => {
        if (isCreator()) {
          return <DashboardsList {...params} />;
        }
        return <CommonList {...params} />;
      },
      show: true,
    },
    {
      key: "dashboard",
      tab: "Dashboards",
      render: params => {
        return <DashboardsList {...params} />;
      },
      show: true,
    },
    {
      key: "card",
      tab: "Charts",
      render: params => {
        return <DashboardsList {...params} />;
      },
      show: true,
    },
    {
      key: "favorite",
      tab: "My Favorites",
      render: params => {
        return <DashboardsList {...params} />;
      },
      show: isCreator() && isOwnCreator,
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
  ];

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
    return linkFunc({
      ...router?.location?.query,
      model,
      current: 1,
      q: !isFavoritesTab ? router?.location?.query?.q : "",
      sortDirection: sortMap.descend,
      sortBy: "views",
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
        {!isFavoritesTab && (
          <Search
            allowClear
            placeholder="Search..."
            onChange={e => changeHandler(e.target.value)}
            className="search__tabs-search"
          />
        )}
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
              name={isList ? "switch_grid" : "switch_list"}
              size={20}
              color={"#A6AABE"}
            />
          </Tooltip>
        </div>
      </div>
    );
  };

  return (
    <div className={cx("search__tabs relative", className)}>
      <Tabs
        activeKey={model}
        size="large"
        tabBarGutter={isMobile ? 20 : 60}
        animated={false}
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
      {isCreator() && renderSwitchGraph()}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
    creatorViewType: isCreator()
      ? localStorage.getItem("creator-view-type") || "list"
      : "list",
  };
};

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
