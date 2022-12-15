import { getSearchTexts } from "metabase/nav/components/utils";
import { sortMap } from "metabase/containers/dashboards/shared/config";

export default query => {
  const { sortBy, current, sortDirection, q, model } = query;

  const qs = q ? getSearchTexts(q) : [];

  return {
    sortDirection: sortDirection || sortMap.descend,
    sortBy: sortBy || "dashboard_count",
    current: current ? Number(current) : 1,
    pageSize: 20,
    model: model || "dashboard",
    qs: qs,
  };
};
