export const QUERY_OPTIONS = {
  refetchOnWindowFocus: false,
  retry: 0,
};

export const QUERY_OPTIONS_NORMAL = {
  refetchOnWindowFocus: false,
  retry: 0,
};

export const QUERY_OPTIONS_ARTICLE = {
  refetchOnWindowFocus: false,
  retry: 0,
  staleTime: 3600 * 1000,
};

export const sortMap = {
  asc: "ascend",
  ascend: "asc",

  desc: "descend",
  descend: "desc",
};
