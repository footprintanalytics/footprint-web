export const getSearchQueryLink = ({ q = "", model = "" }) => {
  return "/search" + "?q=" + encodeURIComponent(q) + "&model=" + model;
};
