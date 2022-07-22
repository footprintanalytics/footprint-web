import { getProject } from "metabase/lib/project_info";
import { sortMap } from "../../shared/config";
import { getDashboardQueryTags, isCreator, isSearch } from "../../shared/utils";
import { getSearchTexts } from "metabase/nav/components/utils";

export default query => {
  const {
    sortBy,
    category,
    current,
    tags,
    sortDirection,
    q,
    model,
    params,
    user,
  } = query;

  const qs = q ? getSearchTexts(q) : [];

  const isCreatorAndOwner = () => {
    return isCreator() && params?.name === user?.name;
  };

  const getSortByStr = () => {
    if (isSearch() && !sortBy) {
      return {};
    }
    let defaultSortBy = "views";
    if (isCreatorAndOwner()) {
      defaultSortBy = "created_at";
    }
    return { sortBy: sortBy || defaultSortBy };
  };

  return {
    category: category || "All",
    sortDirection: sortDirection || sortMap.descend,
    current: current ? Number(current) : 1,
    ...getSortByStr(),
    pageSize: 20,
    tags: getDashboardQueryTags(tags),
    isSort: !!sortBy,
    project: getProject(),
    model: model || (isCreator() ? "all" : "dashboard"),
    qs: qs,
  };
};
