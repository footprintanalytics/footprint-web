import { createSelector } from "reselect";
import { getXraysEnabled } from "metabase/selectors/settings";

export const getControl = state => state.control;

export const getLoginModalShow = createSelector(
  [getControl],
  ({ control }) => {
    return control?.loginModalShow || false;
  },
);

export const getLoginModalRedirect = createSelector(
  [getControl],
  ({ control }) => {
    return control?.loginModalRedirect;
  },
);

export const getFeaturesSideHide = createSelector(
  [getControl],
  ({ control }) => {
    return control?.featuresSideHide || false;
  },
);

export const getCreateModalShow = createSelector(
  [getControl],
  ({ control }) => {
    return control?.createModalShow || false;
  },
);

export const getCancelFeedback = createSelector(
  [getControl],
  ({ control }) => {
    return control?.cancelFeedback || false;
  },
);

export const getSubmitAddrZkspaceModal = createSelector(
  [getControl],
  ({ control }) => {
    return control?.submitAddrZkspaceModal || false;
  },
);

export const getIsUserFeedbackBlock = createSelector(
  [getControl],
  ({ control }) => {
    return control?.isUserFeedbackBlock;
  },
);

export const getShowTemplateChart = createSelector(
  [getControl],
  ({ control }) => {
    return control?.showTemplateChart;
  },
);

export const getShowPreviewChart = createSelector(
  [getControl],
  ({ control }) => {
    return control?.showPreviewChart;
  },
);

export const getNextChartPopover = createSelector(
  [getControl],
  ({ control }) => {
    return control?.nextChartPopover;
  },
);

export const getCloseAllChartPopover = createSelector(
  [getControl],
  ({ control }) => {
    return control?.closeAllChartPopover;
  },
);

export const getNewGuideInfo = createSelector(
  [getControl],
  ({ control }) => {
    return control?.newGuideInfo;
  },
);

export const getDarkMode = createSelector([getControl], ({ darkMode }) => {
  return darkMode;
});
