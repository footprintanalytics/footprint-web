/* eslint-disable react/prop-types */
import { useQuery } from "react-query";
import React from "react";
import { Skeleton } from "antd";
import Link from "metabase/core/components/Link";
import { fetchHomeNewCategory } from "metabase/new-service";
import { trackStructEvent } from "metabase/lib/analytics";
import { getDashboardQueryLink } from "../../shared/utils";
import { QUERY_OPTIONS } from "../../shared/config";

const Category = ({ router }) => {
  const { isLoading, data } = useQuery(
    "fetchHomeNewCategory",
    fetchHomeNewCategory,
    QUERY_OPTIONS,
  );

  if (isLoading) {
    return <Skeleton active />;
  }

  const { categorys } = data;
  const category = router.location.query.category || categorys[0].value;

  return (
    <ul className="dashboards__category">
      {categorys.map(item => (
        <li
          key={item.value}
          onClick={() => trackStructEvent("Dashboards Category", item.value)}
        >
          <Link
            to={getDashboardQueryLink({
              ...router.location.query,
              current: 1,
              category: item.value,
              sortBy: item.value === "New" ? "created_at" : "",
              sortDirection: item.value === "New" ? "desc" : "",
            })}
            className={`dashboards__category-item ${
              item.value === category ? "dashboards__category-item--active" : ""
            }`}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Category;
