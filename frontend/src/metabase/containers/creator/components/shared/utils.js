export const getCreatorQueryLink = ({ model = "" }) => {
  return window.location.pathname + "?model=" + model;
};
