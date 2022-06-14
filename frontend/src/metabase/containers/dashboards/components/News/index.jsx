/* eslint-disable react/prop-types */
import Link from "metabase/components/Link";
import {
  fetchHomeNewNews,
  mediaList,
  navigationHotList,
} from "metabase/new-service";
import React from "react";
import { useQuery } from "react-query";
import "./index.css";
import Item from "./Item";
import { QUERY_OPTIONS } from "../../shared/config";
import { trackStructEvent } from "metabase/lib/analytics";
import { Skeleton } from "antd";
import { getProject } from "metabase/lib/project_info";
import { isSearch } from "metabase/containers/dashboards/shared/utils";

const News = ({ model = "news", title = "News" }) => {
  const getParams = () => {
    if (model === "realTimeInfo") {
      return {
        current: 1,
        pageSize: 10,
        type: "realTimeInfo",
      };
    }
    return isSearch()
      ? {
          model: "news",
          project: getProject(),
        }
      : {};
  };

  const params = getParams();

  const getQueryList = () => {
    if (model === "realTimeInfo") {
      return mediaList(params);
    }
    return isSearch() ? navigationHotList(params) : fetchHomeNewNews(params);
  };

  const { isLoading, data } = useQuery(
    ["navigationHotList", "fetchHomeNewNews", "mediaList", params],
    async () => {
      return getQueryList();
    },
    QUERY_OPTIONS,
  );

  return (
    <div className="dashboards__news">
      <div className="dashboards__cell">
        <h2>{title}</h2>
        <Link
          href="/news/featured"
          onClick={() => trackStructEvent("Dashboards News", "See all")}
        >
          See all
        </Link>
      </div>
      {isLoading ? (
        <Skeleton active />
      ) : (
        <ul className="dashboards__news-list">
          {(data.news || data.list || data.data).map((item, index) => (
            <li
              key={item.mediaInfoId}
              onClick={() => trackStructEvent("Dashboards News", item.title)}
            >
              <Item
                item={item}
                index={index}
                textMode={model === "realTimeInfo"}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default News;
