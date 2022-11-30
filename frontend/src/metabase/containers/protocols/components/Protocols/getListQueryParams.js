import { getProject } from "metabase/lib/project_info";

export default query => {
  const { category, current, chain, genre } = query;

  return {
    type: category || "",
    chain: chain || "",
    genre: genre || "",

    current: current ? Number(current) : 1,
    pageSize: 20,
    project: getProject(),
  };
};
