import { createSelector } from "reselect";
import { getXraysEnabled } from "metabase/selectors/settings";

export const getControl = state => state.control;

export const getLoginModalShow = createSelector(
  [getControl],
  (object) => {
    return object?.loginModalShow || false;
  },
);

export const getLoginModalRedirect = createSelector(
  [getControl],
  (object) => {
    return object?.loginModalRedirect;
  },
);

export const getFeaturesSideHide = createSelector(
  [getControl],
  (object) => {
    return object?.featuresSideHide || false;
  },
);

export const getCreateModalShow = createSelector(
  [getControl],
  (object) => {
    return object?.createModalShow || false;
  },
);

export const getCancelFeedback = createSelector(
  [getControl],
  (object) => {
    return object?.cancelFeedback || false;
  },
);

export const getSubmitAddrZkspaceModal = createSelector(
  [getControl],
  (object) => {
    return object?.submitAddrZkspaceModal || false;
  },
);

export const getIsUserFeedbackBlock = createSelector(
  [getControl],
  (object) => {
    return object?.isUserFeedbackBlock;
  },
);

export const getShowTemplateChart = createSelector(
  [getControl],
  (object) => {
    return object?.showTemplateChart;
  },
);

export const getShowPreviewChart = createSelector(
  [getControl],
  (object) => {
    return object?.showPreviewChart;
  },
);

export const getNextChartPopover = createSelector(
  [getControl],
  (object) => {
    return object?.nextChartPopover;
  },
);

export const getCloseAllChartPopover = createSelector(
  [getControl],
  (object) => {
    return object?.closeAllChartPopover;
  },
);

export const getNewGuideInfo = createSelector(
  [getControl],
  (object) => {
    return object?.newGuideInfo;
  },
);

export const getDarkMode = createSelector([getControl], ({ darkMode }) => {
  return darkMode;
});
