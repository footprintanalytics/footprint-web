/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { Tabs } from "antd";
import React from "react";
import { connect } from "react-redux";
import "./index.css";
import { getSearchQueryLink } from "../../shared/utils";
import DashboardsList from "../../../dashboards/components/Dashboards/List";
import PageList from "../Page/Index";
import CreatorList from "../Creator/Index";
import DataSetList from "../DataSet/Index";
import cx from "classnames";
import {
  getCreatorQueryLink,
  isSearch,
} from "metabase/containers/dashboards/shared/utils";
import Link from "metabase/components/Link";
import { useDeviceInfo } from "metabase-lib/lib/Device";
import { loginModalShowAction } from "metabase/redux/control";
import { trackStructEvent } from "metabase/lib/analytics";

const Index = ({
  router,
  user,
  data,
  model,
  name,
  className,
  setLoginModalShow,
}) => {
  const { isMobile } = useDeviceInfo();

  const tabData = [
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
      ...router.location.query,
      model,
    });
  };

  return (
    <Tabs
      className={cx("search__tabs", className)}
      activeKey={model}
      size="large"
      tabBarGutter={isMobile ? 20 : 80}
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
                item.render({ router, user, name, setLoginModalShow })}
            </Tabs.TabPane>
          );
        })}
    </Tabs>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
