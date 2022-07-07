/* eslint-disable react/display-name */
import { Dropdown, Menu } from "antd";
import { getOssUrl } from "metabase/lib/image";
import React from "react";
import Favorite from "metabase/containers/explore/components/Favorite";
import { trackStructEvent } from "metabase/lib/analytics";
import { formatTitle } from "metabase/lib/formatting";
import Highlighter from "react-highlight-words";
import * as Urls from "metabase/lib/urls";
import Icon from "metabase/components/Icon";
import formatDate from "metabase/containers/news/util/date";
import IconValue from "metabase/containers/dashboards/components/IconValue";
import Tooltip from "metabase/components/Tooltip";
import CreatorBox from "metabase/containers/search/components/CommonPage/creatorBox";
import DataSetBox from "metabase/containers/search/components/CommonPage/dataSetBox";
import PageBox from "metabase/containers/search/components/CommonPage/pageBox";
import DashboardBox from "metabase/containers/search/components/CommonPage/dashboardBox";
import Link from "metabase/components/Link";

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
  // const isInner = user?.groups?.includes("Inner");
  const getIcon = item => {
    const model = item.model;
    if (model === "creator") {
      return "person";
    }
    if (model === "dataset") {
      return "database";
    }
    if (model === "dashboard") {
      return "search_dashboard";
    }
    if (model === "card") {
      return "search_chart";
    }
    return "search_article";
  };
  const getToolTip = item => {
    const model = item.model;
    if (model === "creator") {
      return "Creator";
    }
    if (model === "dataset") {
      return "Dataset";
    }
    if (model === "dashboard") {
      return "Dashboard";
    }
    if (model === "card") {
      return "Chart";
    }
    return "Page";
  };
  const getUrl = item => {
    const model = item.model;
    if (model === "creator") {
      return `/@${item.user_name}`;
    }
    if (model === "dataset") {
      return Urls.newQuestion({
        databaseId: item.db_id,
        tableId: item.id,
        type: "query",
      });
    }
    if (model === "dashboard") {
      return Urls.dashboard(item);
    }
    if (model === "card") {
      return Urls.guestUrl(item);
    }
    return item.url;
  };
  const name = {
    title: "Title",
    key: "title",
    width: 400,
    render: (_, record, index) => {
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

  const date = {
    title: "Date",
    key: "created_at",
    width: 140,
    render: (_, record) => {
      return (
        <div className="dashboards__table-date">
          {formatDate(
            record.last_crawled_at || record.updated_at || record.createdAt,
          )}
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
        <div className="dashboards__table-date">{renderCustom(record)}</div>
      );
    },
  };
  const action = {
    title: "",
    key: "action",
    width: 100,
    align: "right",
    render: (_, record) => {
      if (record.model !== "dashboard" && record.model !== "card") {
        return null;
      }
      const menu = (
        <Menu
          onClick={({ key }) => {
            switch (key) {
              case "duplicate":
                onDuplicate({
                  name: record.name,
                  description: record.description,
                  id: record.id,
                  type: record.model,
                });
                break;
              case "share":
                onShare({
                  open: true,
                  public_uuid: record.publicUuid,
                  type: record.model,
                  name: record.name,
                  id: record.id,
                  creatorId: record.creator.id,
                  creator: record.creator,
                  uniqueName: record.uniqueName || record.unique_name,
                });
                break;
              case "seo":
                onSeoTagging({
                  id: record.id,
                  name: record.name,
                  creatorId: record.creator.id,
                });
                break;
              case "priority":
                onHomePriority({
                  id: record.id,
                  name: record.name,
                });
                break;
              default:
                break;
            }
            trackStructEvent(`${gaCategory} Action`, key);
          }}
        >
          <Menu.Item key="favorite" style={{ marginLeft: -1 }}>
            <Favorite
              borderless
              className="dashboards__icon-value"
              uuid={record.publicUuid}
              id={record.id}
              type={record.model}
              isLike={record.isFavorite}
              hideNumber={true}
            />
          </Menu.Item>
          {user && (
            <Menu.Item key="duplicate">
              <IconValue iconName="duplicate" value="Copy" />
            </Menu.Item>
          )}
          <Menu.Item key="share">
            <IconValue iconName="share" value="Sharing" />
          </Menu.Item>
          {(isMarket || isAdmin) && (
            <Menu.Item key="seo">
              <IconValue iconName="rose" value="Seo" />
            </Menu.Item>
          )}
          {(isMarket || isAdmin) && (
            <Menu.Item key="priority">
              <IconValue iconName="tool_setting" value="Priority" />
            </Menu.Item>
          )}
        </Menu>
      );

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
  return [name, description, date, action];
  // return [logo, name, tag, views, date, action];
};
