import { fetchHomeNewRecommend } from "metabase/new-service";
import React from "react";
import { useQuery } from "react-query";
import "./index.css";
import { QUERY_OPTIONS } from "../../shared/config";
import { Skeleton } from "antd";
import List from "./List";

const Recommendations = () => {
  const { isLoading, data } = useQuery(
    "fetchHomeNewRecommend",
    fetchHomeNewRecommend,
    QUERY_OPTIONS,
  );

  if (!data?.recommends?.length) {
    return null;
  }

  return (
    <div className="dashboards__recommendations">
      <div className="dashboards__layout">
        {isLoading ? (
          <Skeleton active />
        ) : (
          <List recommends={data?.recommends} />
        )}
      </div>
    </div>
  );
};

export default Recommendations;
