/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import Card from "metabase/components/Card";
import Icon from "metabase/components/Icon";
import { Skeleton, Tabs } from "antd";
import "./SearchResultsModal.css";
import Link from "metabase/components/Link";
import { useQuery } from "react-query";
import { elasticSearch } from "metabase/new-service";
import { useDebounce } from "ahooks";
import { getProject } from "metabase/lib/project_info";
import { formatTitle } from "metabase/lib/formatting";
import * as Urls from "metabase/lib/urls";
import { getSearchTexts } from "metabase/nav/components/utils";
import NoData from "metabase/containers/dashboards/components/Dashboards/nodata";
import Highlighter from "react-highlight-words";
import { trackStructEvent } from "metabase/lib/analytics";
import formatDate from "metabase/containers/news/util/date";

const SearchResultsModal = ({
  searchText,
  activeTabCallback,
  user,
  setLoginModalShow,
}) => {
  const tabsConfig = [
    { key: "all", tab: "All", iconName: "search_dashboard" },
    { key: "dashboard", tab: "Dashboards", iconName: "search_dashboard" },
    { key: "card", tab: "Charts", iconName: "search_chart" },
    { key: "creator", tab: "Creators", iconName: "person" },
    { key: "dataset", tab: "Datasets", iconName: "database" },
    { key: "page", tab: "Pages", iconName: "docs" },
  ];

  const [tabKey, setTabKey] = useState(tabsConfig[0].key);

  const debouncedSearchText = useDebounce(searchText?.trim(), { wait: 500 });
  const qs = getSearchTexts(debouncedSearchText);

  const params = {
    model: tabKey,
    qs: qs,
    project: getProject(),
    pageSize: 5,
    current: 1,
  };

  useEffect(() => {
    activeTabCallback && activeTabCallback(tabKey);
  }, [activeTabCallback, tabKey]);

  const { data, isLoading } = useQuery(
    ["elasticSearch", params],
    async () => {
      return elasticSearch(params);
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
    },
  );

  const navigationNumQuery = null;

  const getIcon = (key, iconName, inner, item) => {
    const model = item.model || key;
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

  if (isLoading) {
    return (
      <div className="search-results-modal">
        <Card className="search-results-modal__card" p={3}>
          <Skeleton active />
        </Card>
      </div>
    );
  }

  const getTab = (key, tab) => {
    const num = navigationNumQuery?.data && navigationNumQuery?.data[key];
    const numStr = qs.length > 0 && num !== undefined ? `(${num})` : "";
    return `${tab} ${numStr}`;
  };

  const getUrl = ({ item, key }) => {
    const model = item.model || params.model;
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
  return (
    <div className="search-results-modal">
      <Card className="search-results-modal__card">
        <Tabs
          activeKey={tabKey}
          className="search-results-modal__tabs"
          centered
          tabBarGutter={60}
          animated={false}
          onChange={tab => {
            setTabKey(tab);
            trackStructEvent(`search modal tab click ${tab}`);
          }}
        >
          {tabsConfig.map(({ key, tab, iconName, inner }) => (
            <Tabs.TabPane key={key} tab={getTab(key, tab)}>
              {((qs.length > 0 && data?.isFeature) ||
                !data?.data?.length > 0) && <NoData />}
              {data?.isFeature && (
                <div className="search-results-modal__recommend">Recommend</div>
              )}
              <ul className="search-results-modal__list">
                {data?.data?.slice(0, 5)?.map(item => (
                  <li
                    key={item.publicUuid}
                    className="search-results-modal__list-outer"
                  >
                    <Link
                      href={getUrl({ item, key })}
                      target="_blank"
                      className="search-results-modal__list-item"
                      onclick={e => {
                        e.preventDefault();
                        if (!user) {
                          setLoginModalShow({
                            show: true,
                            from: "search_creator",
                          });
                          return;
                        }
                        window.open(getUrl({ item, key }));
                      }}
                    >
                      <Icon
                        name={getIcon(key, iconName, inner, item)}
                        size={16}
                      />
                      <div>
                        <h3
                          className="search-results-modal__list-title"
                          style={{ WebkitBoxOrient: "vertical" }}
                        >
                          <Highlighter
                            highlightClassName="highlight"
                            searchWords={qs}
                            autoEscape={true}
                            textToHighlight={formatTitle(
                              item.name || item.title || `@${item.user_name}`,
                            )}
                          />
                        </h3>
                        <span className="search-results-modal__list-date">
                          {item?.model === "dataset"
                            ? "_"
                            : formatDate(
                                item.last_crawled_at ||
                                  item.updated_at ||
                                  item.createdAt,
                              )}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </Tabs.TabPane>
          ))}
        </Tabs>
        <Link
          to={`/search?q=${encodeURIComponent(
            debouncedSearchText,
          )}&model=${tabKey}`}
          className="search-results-modal__list-more"
        >
          More
        </Link>
      </Card>
    </div>
  );
};

export default SearchResultsModal;
