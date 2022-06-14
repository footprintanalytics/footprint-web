import { createSelector } from "reselect";

export const getControl = state => state.control;

export const getLoginModalShow = createSelector(
  [getControl],
  ({ loginModalShow }) => {
    return loginModalShow || false;
  },
);

export const getFeaturesSideHide = createSelector(
  [getControl],
  ({ featuresSideHide }) => {
    return featuresSideHide || false;
  },
);

export const getCreateModalShow = createSelector(
  [getControl],
  ({ createModalShow }) => {
    return createModalShow || false;
  },
);

export const getCancelFeedback = createSelector(
  [getControl],
  ({ cancelFeedback }) => {
    return cancelFeedback || false;
  },
);

export const getSubmitAddrZkspaceModal = createSelector(
  [getControl],
  ({ submitAddrZkspaceModal }) => {
    return submitAddrZkspaceModal || false;
  },
);

export const getIsUserFeedbackBlock = createSelector(
  [getControl],
  ({ isUserFeedbackBlock }) => {
    return isUserFeedbackBlock;
  },
);

export const getShowTemplateChart = createSelector(
  [getControl],
  ({ showTemplateChart }) => {
    return showTemplateChart;
  },
);

export const getShowPreviewChart = createSelector(
  [getControl],
  ({ showPreviewChart }) => {
    return showPreviewChart;
  },
);

export const getNextChartPopover = createSelector(
  [getControl],
  ({ nextChartPopover }) => {
    return nextChartPopover;
  },
);

export const getCloseAllChartPopover = createSelector(
  [getControl],
  ({ closeAllChartPopover }) => {
    return closeAllChartPopover;
  },
);

export const getNewGuideInfo = createSelector(
  [getControl],
  ({ newGuideInfo }) => {
    return newGuideInfo;
  },
);
