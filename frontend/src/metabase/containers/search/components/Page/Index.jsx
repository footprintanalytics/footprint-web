/* eslint-disable react/prop-types */
import { Pagination, Skeleton } from "antd";
import { elasticSearch } from "metabase/new-service";
import React from "react";
import { useQuery } from "react-query";
import Icon from "metabase/components/Icon";
import formatDate from "metabase/containers/news/util/date";
import { trackStructEvent } from "metabase/lib/analytics";
import Link from "metabase/components/Link";
import NoData from "metabase/containers/dashboards/components/Dashboards/nodata";
import { formatArticleTitle } from "metabase/lib/formatting";
import Highlighter from "react-highlight-words";
import { getSearchTexts } from "metabase/nav/components/utils";
import getListQueryParams from "metabase/containers/dashboards/components/Dashboards/getListQueryParams";
import { QUERY_OPTIONS } from "metabase/containers/search/shared/config";
import getListPagination from "metabase/containers/dashboards/components/Dashboards/getListPagination";
import "./Index.css";
import { isSearch } from "metabase/containers/dashboards/shared/utils";
import PageBox from "metabase/containers/search/components/CommonPage/pageBox";

const Index = ({ router }) => {
  const searchWords = getSearchTexts(router.location.query.q);
  const params = getListQueryParams(router.location.query);

  const { isLoading, data, error } = useQuery(
    ["elasticSearch", params],
    async () => {
      return elasticSearch(params);
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

  const pagination = getListPagination({
    router,
    current: params.current,
    pageSize: data?.pageSize,
    total: data?.total,
  });

  const getIcon = () => {
    return "search_article";
  };

  return (
    <>
      {isSearch() && data?.isFeature && <NoData />}
      {isSearch() && data?.isFeature && (
        <div className="dashboards__recommend">Recommend</div>
      )}
      <div className="dashboards__list">
        {data?.data.map(item => {
          return (
            <article key={item.id} className="dashboards__list-item">
              <Link
                to={item.url}
                href={item.url}
                onClick={e => {
                  e.preventDefault();
                  trackStructEvent("search web list click item");
                  window.open(item.url);
                }}
              >
                <div className="dashboards__news-top">
                  <Icon name={getIcon(item.type)} size={20} color={"#A6AABE"} />
                  <h1
                    className="footprint-title1 title dashboards__web-title"
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
                <PageBox
                  router={router}
                  searchWords={searchWords}
                  item={item}
                />
                <div className="footprint-secondary-text2">
                  {formatDate(item.last_crawled_at)}
                </div>
              </Link>
            </article>
          );
        })}
      </div>
      {data?.total && (
        <Pagination className="dashboards__news-pagination" {...pagination} />
      )}
    </>
  );
};

export default Index;
