// eslint-disable-next-line import/order
import Link from "metabase/core/components/Link";
// eslint-disable-next-line import/order
import { navigationHotList } from "metabase/new-service";
import React from "react";
import { useQuery } from "react-query";
import "./index.css";
import "../../../news/components/Hots.css";
import { Skeleton } from "antd";
import { trackStructEvent } from "metabase/lib/analytics";
import { getProject } from "metabase/lib/project_info";
import { QUERY_OPTIONS } from "../../shared/config";
import Item from "./Item";

const SearchHotDashboard = () => {
  const params = {
    model: "dashboard",
    project: getProject(),
  };

  const { isLoading, data } = useQuery(
    ["navigationHotList", params],
    async () => {
      return await navigationHotList(params);
    },
    QUERY_OPTIONS,
  );

  return (
    <div className="dashboards__news">
      <div className="dashboards__cell">
        <h2>Dashboards</h2>
        <Link
          href="/dashboards"
          onClick={() => trackStructEvent("Search Hot dashboard", "See all")}
        >
          See all
        </Link>
      </div>
      {isLoading ? (
        <Skeleton active />
      ) : (
        <ul className="hots">
          {data?.list?.map((item, index) => (
            <li
              className="hots__item"
              key={item.mediaInfoId}
              onClick={() =>
                trackStructEvent("Search Hot dashboard", item.title)
              }
            >
              <Item item={item} index={index} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchHotDashboard;
