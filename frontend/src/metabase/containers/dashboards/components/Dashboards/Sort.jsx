/* eslint-disable react/prop-types */
import { Select } from "antd";
import React from "react";
import {
  getDashboardQueryLink,
  getSearchDashboardQueryLink,
  isSearch,
} from "../../shared/utils";
import { trackStructEvent } from "metabase/lib/analytics";

const Sort = ({ router }) => {
  const { sortBy } = router.location.query;

  return (
    <Select
      value={sortBy || undefined}
      className="dashboards__sort"
      placeholder="Rank dashboards by"
      allowClear
      onChange={value => {
        const linkFunc = isSearch()
          ? getSearchDashboardQueryLink
          : getDashboardQueryLink;
        const link = linkFunc({
          ...router.location.query,
          current: 1,
          sortBy: value,
        });
        router.push(link);
        const seoName = isSearch() ? "Dashboards Sort" : "Search Sort";
        trackStructEvent(seoName, value);
      }}
    >
      <Select.Option value="views">Trending</Select.Option>
      <Select.Option value="created_at">New</Select.Option>
    </Select>
  );
};

export default Sort;
