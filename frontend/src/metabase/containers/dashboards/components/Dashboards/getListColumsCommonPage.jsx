/* eslint-disable react/display-name */
import { Dropdown } from "antd";
import { getOssUrl } from "metabase/lib/image";
import React from "react";
import { trackStructEvent } from "metabase/lib/analytics";
import { formatTitle } from "metabase/lib/formatting";
import Highlighter from "react-highlight-words";
import * as Urls from "metabase/lib/urls";
import Icon from "metabase/components/Icon";
import formatDate from "metabase/containers/news/util/date";
import Tooltip from "metabase/components/Tooltip";
import CreatorBox from "metabase/containers/search/components/CommonPage/creatorBox";
import DataSetBox from "metabase/containers/search/components/CommonPage/dataSetBox";
import PageBox from "metabase/containers/search/components/CommonPage/pageBox";
import DashboardBox from "metabase/containers/search/components/CommonPage/dashboardBox";
import Link from "metabase/components/Link";
import getActionMenus from "metabase/containers/dashboards/components/Dashboards/helper";

export default ({
  router,
  user,
  onDuplicate,
  onShare,
  onSeoTagging,
  onHomePriority,
  searchWords,
  device,
  gaCategory = "Dashboards",
}) => {
  const isMarket = user && user.isMarket;
  const isAdmin = user && user.is_superuser;
  const array = [
    {
      model: "creator",
      icon: "person",
      tooltip: "Creator",
      getUrl: item => `/@${item.user_name}`,
    },
    {
      model: "dataset",
      icon: "database",
      tooltip: "Dataset",
      getUrl: item =>
        Urls.newQuestion({
          databaseId: item.db_id,
          tableId: item.id,
          type: "query",
        }),
    },
    {
      model: "dashboard",
      icon: "search_dashboard",
      tooltip: "Dashboard",
      getUrl: item => Urls.dashboard(item),
    },
    {
      model: "card",
      icon: "search_chart",
      tooltip: "Chart",
      getUrl: item => Urls.guestUrl(item),
    },
    {
      model: "page",
      icon: "search_article",
      tooltip: "Page",
      getUrl: item => item.url,
    },
  ];

  const getIcon = item => {
    const model = item.model;
    return array.find(i => i.model === model)?.icon || "search_article";
  };

  const getToolTip = item => {
    const model = item.model;
    return array.find(i => i.model === model)?.tooltip || "Page";
  };

  const getUrl = item => {
    const model = item.model;
    return array.find(i => i.model === model)?.getUrl(item) || item.url;
  };

  const name = {
    title: "Title",
    key: "title",
    width: 500,
    render: record => {
      return (
        <div className="dashboards__table-name">
          <Tooltip tooltip={getToolTip(record)}>
            <Icon name={getIcon(record)} size={20} color={"#A6AABE"} />
          </Tooltip>
          <Link
            className="dashboards__news-top"
            to={getUrl(record)}
            target="_blank"
            onClick={e => {
              trackStructEvent("search web list click item");
            }}
          >
            <h3
              className="ml2 common-page__title"
              style={{ WebkitBoxOrient: "vertical" }}
            >
              <Highlighter
                highlightClassName="highlight"
                searchWords={searchWords}
                autoEscape={true}
                textToHighlight={formatTitle(
                  record.title || record.name || `@${record.user_name}`,
                )}
              />
            </h3>
          </Link>
        </div>
      );
    },
  };

  const renderCustom = item => {
    const model = item.model;
    if (model === "creator") {
      return (
        <CreatorBox router={router} searchWords={searchWords} item={item} />
      );
    }
    if (model === "dataset") {
      return (
        <DataSetBox
          router={router}
          searchWords={searchWords}
          item={item}
          isPlain={true}
        />
      );
    }
    if (model === "page") {
      return <PageBox router={router} searchWords={searchWords} item={item} />;
    }

    return (
      <DashboardBox router={router} searchWords={searchWords} item={item} />
    );
  };
  const description = {
    title: "Description",
    key: "description",
    render: (_, record) => {
      return (
        <div className="dashboards__table-custom">{renderCustom(record)}</div>
      );
    },
  };
  const date = {
    title: "Date",
    key: "created_at",
    width: 120,
    render: record => {
      if (record.model === "dataset") {
        return "-";
      }
      return (
        <div className="dashboards__table-date">
          {formatDate(
            record.last_crawled_at || record.updated_at || record.createdAt,
          )}
        </div>
      );
    },
  };
  const action = {
    title: "",
    key: "action",
    width: 60,
    align: "right",
    render: (_, record) => {
      if (record.model !== "dashboard" && record.model !== "card") {
        return null;
      }
      const menu = getActionMenus({
        onDuplicate: onDuplicate,
        record: record,
        onShare: onShare,
        onSeoTagging: onSeoTagging,
        onHomePriority: onHomePriority,
        gaCategory: gaCategory,
        user: user,
        isAdmin: isAdmin,
        isMarket: isMarket,
      });
      return (
        <Dropdown overlay={menu} placement="bottomRight">
          <div className="dashboards__table-action">
            <img src={getOssUrl("20220309154118.png")} />
          </div>
        </Dropdown>
      );
    },
  };
  if (device?.isMobile) {
    return [name];
  }
  if (device?.isPad) {
    return [name, description, action];
  }
  return [name, description, date, action];
};
