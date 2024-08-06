import { createSelector } from "reselect";
import { getXraysEnabled } from "metabase/selectors/settings";
import { setGames } from "../redux/control";

export const getControl = state => state.control;

export const getCreateFgaProjectModalShow = createSelector(
  [getControl],
  ({
    createFgaProjectModalShow = false,
    createFgaProjectModalForce = false,
  }) => {
    return createFgaProjectModalShow
      ? { show: createFgaProjectModalShow, force: createFgaProjectModalForce }
      : null;
  },
);
export const getProjectSubmitModalShow = createSelector(
  [getControl],
  ({
     projectSubmitModalShow = false,
     projectSubmitModalForce = false,
  }) => {
    return projectSubmitModalShow
      ? { show: projectSubmitModalShow, force: projectSubmitModalForce }
      : null;
  },
);

export const getLoginModalShow = createSelector(
  [getControl],
  ({ loginModalShow }) => {
    return loginModalShow || false;
  },
);

export const getLoginModalRedirect = createSelector(
  [getControl],
  ({ loginModalRedirect }) => {
    return loginModalRedirect;
  },
);

export const getLoginModalDefaultRegister = createSelector(
  [getControl],
  ({ loginModalDefaultRegister }) => {
    return loginModalDefaultRegister;
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

export const getDarkMode = createSelector([getControl], ({ darkMode }) => {
  return darkMode;
});

export const getGamesByRedux = createSelector([getControl], ({ games }) => {
  return games || [];
});

export const getHistoryGamesByRedux = createSelector([getControl], ({ historyGames }) => {
  const historyGamesStr = window.localStorage.getItem("historyGames")
  let historyGamesInit = []
  try {
    historyGamesInit = JSON.parse(historyGamesStr) || []
  } catch (e) {
  }
  return historyGames || historyGamesInit;
});

export const getBindGameMapping = createSelector([getControl], ({ bindGameMapping }) => {
  return bindGameMapping || {};
});

export const getFgaChain = createSelector([getControl], ({ chain }) => {
  return chain || "Ethereum";
});

export const getPeaToken = createSelector([getControl], ({ peaToken }) => {
  return peaToken || "";
});

export const getFgaFavoriteList = createSelector([getControl], (data) => {
  return data?.fgaFavoriteList;
});

export const getFgaProtocolList = createSelector([getControl], (data) => {
  return data?.fgaProtocolList || [];
});

export const getFgaProjectList = createSelector([getControl], (data) => {
  return data?.fgaProjectList || [];
});
