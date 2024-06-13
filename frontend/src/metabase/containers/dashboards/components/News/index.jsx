/* eslint-disable react/prop-types */
// eslint-disable-next-line import/order
import Link from "metabase/core/components/Link";
// eslint-disable-next-line import/order
import {
  fetchHomeNewNews,
  mediaList,
  navigationHotList,
} from "metabase/new-service";
import React from "react";
import { useQuery } from "react-query";
import "./index.css";
import { Skeleton } from "antd";
import { trackStructEvent } from "metabase/lib/analytics";
import { getProject } from "metabase/lib/project_info";
import { isSearch } from "metabase/containers/dashboards/shared/utils";
import { QUERY_OPTIONS } from "../../shared/config";
import Item from "./Item";

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
      <div className="dashboards__area">
        <Link
          href="/news"
          onClick={() => trackStructEvent("Dashboards News", "See all")}
        >
          <div className="dashboards__cell">
            <h2>{title}</h2>
            {">"}
          </div>
        </Link>
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
    </div>
  );
};

export default News;
