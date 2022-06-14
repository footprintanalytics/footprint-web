import { sortMap } from "./config";

export const getDashboardQueryLink = ({
  category = "",
  sortBy = "",
  model = "",
  sortDirection = sortMap.descend,
  tags,
  current,
}) => {
  const queryTags = getDashboardQueryTags(tags);
  const queryTagsLink = queryTags.length
    ? "&" + queryTags.map(tag => `tags=${tag}`).join("&")
    : "";

  const link =
    "/dashboards" +
    "?category=" +
    category +
    "&sortBy=" +
    sortBy +
    "&sortDirection=" +
    sortDirection +
    queryTagsLink +
    "&current=" +
    (current > 0 ? current : 1) +
    "&model=" +
    model;

  return link;
};

export const getSearchDashboardQueryLink = ({
  sortBy = "",
  q = "",
  model = "",
  current,
  sortDirection = sortMap.descend,
}) => {
  return (
    "/search" +
    "?sortBy=" +
    sortBy +
    "&current=" +
    (current > 0 ? current : 1) +
    "&q=" +
    q +
    "&model=" +
    model +
    "&sortDirection=" +
    sortDirection
  );
};

export const getCreatorQueryLink = ({
  location = window.location,
  sortBy = "",
  q = "",
  model = "",
  current,
  sortDirection = sortMap.descend,
}) => {
  return (
    location.pathname +
    "?sortBy=" +
    sortBy +
    "&current=" +
    (current > 0 ? current : 1) +
    "&q=" +
    q +
    "&model=" +
    model +
    "&sortDirection=" +
    sortDirection
  );
};

export const getProtocolQueryLink = ({
  sortBy = "",
  q = "",
  model = "",
  current,
  sortDirection = sortMap.descend,
}) => {
  const link =
    window.location.pathname +
    "?sortBy=" +
    sortBy +
    "&sortDirection=" +
    sortDirection +
    "&current=" +
    (current > 0 ? current : 1);
  return link;
};

export const getDashboardQueryTags = tags => {
  if (!tags) {
    return [];
  }

  if (typeof tags === "string") {
    return [tags];
  }

  if (Array.isArray(tags)) {
    return tags;
  }
};

export const isSearch = () => {
  return window.location.pathname === "/search";
};

export const isProtocol = () => {
  return window.location.pathname.startsWith("/protocols");
};

export const isCreator = () => {
  return window.location.pathname.startsWith("/@");
};
