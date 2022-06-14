/* eslint-disable react/prop-types */
import { Pagination, Skeleton } from "antd";
import { elasticSearch } from "metabase/new-service";
import React from "react";
import { useQuery } from "react-query";
import Icon from "metabase/components/Icon";
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
import * as Urls from "metabase/lib/urls";
import { isSearch } from "metabase/containers/dashboards/shared/utils";

const Index = ({ router, user, setLoginModalShow }) => {
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
    return "database";
  };

  const getUrl = item => {
    return Urls.newQuestion({
      databaseId: item.db_id,
      tableId: item.id,
      type: "query",
    });
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
                to={getUrl(item)}
                href={getUrl(item)}
                hover={false}
                onClick={e => {
                  e.preventDefault();
                  trackStructEvent("search creator list click item");
                  if (!user) {
                    setLoginModalShow({ show: true, from: "search_creator" });
                    return;
                  }
                  window.open(getUrl(item));
                }}
              >
                <div className="dashboards__news-top">
                  <Icon name={getIcon(item.type)} size={20} color={"#A6AABE"} />
                  <h1
                    className="footprint-title1 title dashboards__dataset-title"
                    style={{ WebkitBoxOrient: "vertical" }}
                  >
                    <Highlighter
                      highlightClassName="highlight"
                      searchWords={searchWords}
                      autoEscape={true}
                      textToHighlight={formatArticleTitle(item.name)}
                    />
                  </h1>
                </div>
                <div className="dataset__field-grid-container">
                  {item?.field_names?.split(",")?.map(field => {
                    return (
                      <div key={field} className="dataset__field-grid-item">
                        <Highlighter
                          highlightClassName="highlight"
                          searchWords={searchWords}
                          autoEscape={true}
                          textToHighlight={field}
                        />
                      </div>
                    );
                  })}
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
