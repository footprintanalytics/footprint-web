/* eslint-disable react/prop-types */
import React from "react";
import { navigationSearch } from "metabase/new-service";
import { useQuery } from "react-query";
import { QUERY_OPTIONS } from "../../dashboards/shared/config";
import Hots from "metabase/containers/news/components/Hots";

const HotDashboard = ({ limit = 15, tags = [] }) => {
  const qs = tags.filter(f => f !== f.toLowerCase());

  const { data } = useQuery(
    "navigationSearch",
    async () =>
      navigationSearch({
        category: "All",
        current: 1,
        isSort: false,
        model: "dashboard",
        pageSize: limit,
        project: "footprint",
        qs: [...qs, "dashboard"],
        sortBy: "views",
        sortDirection: "desc",
        tags: [],
      }),
    QUERY_OPTIONS,
  );

  return (
    <Hots
      list={data?.data}
      moreLink="/dashboards"
      title="Hot Dashboard"
      icon="hotDashboard"
    />
  );
};

export default HotDashboard;
