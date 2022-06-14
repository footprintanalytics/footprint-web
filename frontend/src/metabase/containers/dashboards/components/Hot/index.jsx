import Link from "metabase/components/Link";
import { navigationHotList } from "metabase/new-service";
import React from "react";
import { useQuery } from "react-query";
import "./index.css";
import "../../../news/components/Hots.css";
import Item from "./Item";
import { QUERY_OPTIONS } from "../../shared/config";
import { trackStructEvent } from "metabase/lib/analytics";
import { Skeleton } from "antd";
import { getProject } from "metabase/lib/project_info";

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
