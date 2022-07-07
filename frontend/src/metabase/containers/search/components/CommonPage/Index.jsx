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
import DashboardBox from "metabase/containers/search/components/CommonPage/dashboardBox";
import CreatorBox from "metabase/containers/search/components/CommonPage/creatorBox";
import DataSetBox from "metabase/containers/search/components/CommonPage/dataSetBox";
import PageBox from "metabase/containers/search/components/CommonPage/pageBox";
import * as Urls from "metabase/lib/urls";

const CommonPage = ({ router }) => {
  const searchWords = getSearchTexts(router.location.query.q);
  const params = {
    ...getListQueryParams(router.location.query),
  };

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

  const getIcon = item => {
    const model = item.model || params.model;
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

  const renderCustom = item => {
    const model = item.model || params.model;
    if (model === "creator") {
      return (
        <CreatorBox router={router} searchWords={searchWords} item={item} />
      );
    }
    if (model === "dataset") {
      return (
        <DataSetBox router={router} searchWords={searchWords} item={item} />
      );
    }
    if (model === "page") {
      return <PageBox router={router} searchWords={searchWords} item={item} />;
    }

    return (
      <DashboardBox router={router} searchWords={searchWords} item={item} />
    );
  };

  const getUrl = item => {
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
    <>
      {isSearch() && data?.isFeature && <NoData />}
      {isSearch() && data?.isFeature && (
        <div className="dashboards__recommend">Recommend</div>
      )}
      <div className="dashboards__list">
        {data?.data
          ?.filter(item => item)
          .map(item => {
            return (
              <article
                key={`${item.id || item.title}`}
                className="dashboards__list-item"
              >
                <div>
                  <Link
                    className="dashboards__news-top"
                    to={getUrl(item)}
                    target="_blank"
                    onClick={e => {
                      trackStructEvent("search web list click item");
                    }}
                  >
                    <Icon name={getIcon(item)} size={20} color={"#A6AABE"} />
                    <h1
                      className="footprint-title1 title dashboards__web-title"
                      style={{ WebkitBoxOrient: "vertical" }}
                    >
                      <Highlighter
                        highlightClassName="highlight"
                        searchWords={searchWords}
                        autoEscape={true}
                        textToHighlight={formatArticleTitle(
                          item.title || item.name || item.user_name,
                        )}
                      />
                    </h1>
                  </Link>
                  {renderCustom(item)}
                  <div className="footprint-secondary-text2 mt1">
                    {formatDate(
                      item.last_crawled_at || item.updated_at || item.createdAt,
                    )}
                  </div>
                </div>
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

export default CommonPage;
