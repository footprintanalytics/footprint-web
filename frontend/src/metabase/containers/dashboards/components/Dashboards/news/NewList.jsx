/* eslint-disable react/prop-types */
import { Pagination, Skeleton } from "antd";
import {
  fetchHomeNewCategoryDashboard,
  navigationSearch,
} from "metabase/new-service";
import React from "react";
import { useQuery } from "react-query";
import { QUERY_OPTIONS } from "../../../shared/config";
import getListPagination from "../getListPagination";
import getListQueryParams from "../getListQueryParams";
import { isSearch } from "../../../shared/utils";
import Icon from "metabase/components/Icon";
import formatDate from "metabase/containers/news/util/date";
import { articleDetailUrl } from "metabase/lib/urls";
import { trackStructEvent } from "metabase/lib/analytics";
import Link from "metabase/components/Link";
import NoData from "metabase/containers/dashboards/components/Dashboards/nodata";
import { formatArticleTitle } from "metabase/lib/formatting";
import Highlighter from "react-highlight-words";
import { getSearchTexts } from "metabase/nav/components/utils";

const NewList = ({ router }) => {
  const searchWords = getSearchTexts(router.location.query.q);
  const params = getListQueryParams(router.location.query);

  const icons = {
    article: {
      iconName: "search_article",
    },
    realTimeInfo: {
      iconName: "search_flash",
    },
  };

  const { isLoading, data, error } = useQuery(
    ["navigationSearch", "fetchHomeNewCategoryDashboard", params],
    async () => {
      return isSearch()
        ? navigationSearch(params)
        : fetchHomeNewCategoryDashboard(params);
    },
    QUERY_OPTIONS,
  );

  if (error || isLoading) {
    return (
      <div className="dashboards__table">
        <Skeleton active />
      </div>
    );
  }

  if (data?.data?.length === 0) {
    return <NoData />;
  }

  const getIcon = type => {
    return (icons[type] || {}).iconName || "search_article";
  };

  const pagination = getListPagination({
    router,
    current: params.current,
    pageSize: data?.pageSize,
    total: data?.total,
  });

  return (
    <>
      <div className="dashboards__list">
        {data?.data.map(item => {
          return (
            <article key={item.mediaInfoId} className="dashboards__list-item">
              <Link
                to={item.url || articleDetailUrl(item)}
                href={item.url || articleDetailUrl(item)}
                onClick={e => {
                  e.preventDefault();
                  trackStructEvent("articles click item");
                  if (item.url) {
                    return window.open(item.url);
                  }
                  window.open(articleDetailUrl(item));
                }}
              >
                <div className="dashboards__news-top">
                  <Icon name={getIcon(item.type)} size={20} color={"#A6AABE"} />
                  <h1
                    className="footprint-title1 title"
                    style={{ WebkitBoxOrient: "vertical" }}
                  >
                    <Highlighter
                      highlightClassName="highlight"
                      searchWords={searchWords}
                      autoEscape={true}
                      textToHighlight={formatArticleTitle(item.title)}
                    />
                  </h1>
                </div>
                <div className="footprint-secondary-text2">
                  {formatDate(item.publishTime)}
                </div>
              </Link>
            </article>
          );
        })}
      </div>
      <Pagination className="dashboards__news-pagination" {...pagination} />
    </>
  );
};

export default NewList;
