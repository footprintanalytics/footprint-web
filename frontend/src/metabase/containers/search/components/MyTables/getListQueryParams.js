import { getSearchTexts } from "metabase/nav/components/utils";

export default query => {
  const { current, q, model } = query;

  const qs = q ? getSearchTexts(q) : [];

  return {
    current: current ? Number(current) : 1,
    pageSize: 20,
    model: model || "dashboard",
    qs: qs,
  };
};
