import { getProject } from "metabase/lib/project_info";
import { sortMap } from "../../shared/config";
import { getDashboardQueryTags, isSearch } from "../../shared/utils";
import { getSearchTexts } from "metabase/nav/components/utils";

export default query => {
  const { sortBy, category, current, tags, sortDirection, q, model } = query;

  const qs = q ? getSearchTexts(q) : [];

  const sortByStr = isSearch() && !sortBy ? {} : { sortBy: sortBy || "views" };
  return {
    category: category || "All",
    sortDirection: sortDirection || sortMap.descend,
    current: current ? Number(current) : 1,
    ...sortByStr,
    pageSize: 20,
    tags: getDashboardQueryTags(tags),
    isSort: !!sortBy,
    project: getProject(),
    model: model || "dashboard",
    qs: qs,
  };
};
