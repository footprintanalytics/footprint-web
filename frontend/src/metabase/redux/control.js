import { createThunkAction, handleActions } from "metabase/lib/redux";
import {
  canShowZkspaceSubmitModal,
  setShowZkspaceFinishTask,
  setShowZkspaceSubmitModal,
} from "metabase/lib/register-activity";
import { getProjectList, getProtocolFavorite, getProtocolList } from "../new-service";
import { isBusinessTypePath } from "../ab/utils/utils";

export const LOGIN_MODAL_SHOW = "metabase/control/loginModalShow";
export const CREATE_FGA_PROJECT_MODAL_SHOW =
  "metabase/control/createFgaProjectModalShow";
export const PROJECT_SUBMIT_MODAL_SHOW =
  "metabase/control/projectSubmitModalShow";

export const FEATURES_SIDE_HIDE = "metabase/control/featuresSideHide";
export const CREATE_MODAL_SHOW = "metabase/control/createModalShow";
export const CANCEL_FEEDBACK_SHOW = "metabase/control/cancelFeedbackShow";
export const SET_IS_USER_FEEDBACK_BLOCK =
  "metabase/control/setIsUserFeedbackBlock";
export const SET_SUBMIT_ADDR_ZKSPACE_MODAL =
  "metabase/control/setSubmitAddrZkspaceModal";
export const SHOW_TEMPLATE_CHART = "metabase/control/showTemplateChart";
export const SHOW_PREVIEW_CHART = "metabase/control/showPreviewChart";
export const NEXT_CHART_POPOVER_Action =
  "metabase/control/nextChartPopoverAction";
export const CLOSE_ALL_CHART_POPOVER_Action =
  "metabase/control/closeAllChartPopoverAction";
export const SET_NEW_GUIDE_INFO = "metabase/control/setNewGuideInfo";
export const SET_DARK_MODE = "metabase/control/setDarkMode";
export const SET_GAMES = "metabase/control/SET_GAMES";
export const SET_HISTORY_GAMES = "metabase/control/SET_HISTORY_GAMES";
export const SET_BIND_GAME_MAPPING = "metabase/control/SET_BIND_GAME_MAPPING";
export const SET_FGA_CHAIN = "metabase/control/SET_FGA_CHAIN";
export const SET_PEA_TOKEN = "metabase/control/SET_PEA_TOKEN";

export const createFgaProjectModalShowAction = createThunkAction(
  CREATE_FGA_PROJECT_MODAL_SHOW,
  ({ show, projectObject, mode, force = false }) => {
    return { show: show, projectObject, mode, force: force };
  },
);

export const projectSubmitModalShowAction = createThunkAction(
  PROJECT_SUBMIT_MODAL_SHOW,
  ({ show, force = false }) => {
    return { show: show, force: force };
  },
);
export const loginModalShowAction = createThunkAction(
  LOGIN_MODAL_SHOW,
  ({ show, from, redirect, defaultRegister= false, channel }) => {
    return { show, redirect, defaultRegister };
  },
);
export const featuresSideHideAction = createThunkAction(
  FEATURES_SIDE_HIDE,
  ({ hide }) => {
    return { hide };
  },
);
export const createModalShowAction = createThunkAction(
  CREATE_MODAL_SHOW,
  ({ show, redirect }) => {
    return { show, redirect };
  },
);
export const cancelFeedbackAction = createThunkAction(
  CANCEL_FEEDBACK_SHOW,
  ({ show, afterSuccess = undefined, type, scene, isLimit = false }) => {
    if (show && isLimit) {
      const times = localStorage.getItem(`cancel-feedback-times-normal`);
      let timesArray = [];
      if (times) {
        try {
          timesArray = times.split(",");
        } catch (e) {}
      }
      timesArray.push(new Date().getTime());
      localStorage.setItem(
        `cancel-feedback-times-normal`,
        timesArray.join(","),
      );
    }
    if (show) {
      const time = new Date().getTime();
      localStorage.setItem(`cancel-feedback-last-time`, `${time}`);
    }
    return { show, afterSuccess, scene, type };
  },
);
export const setIsCancelFeedbackBlockAction = createThunkAction(
  SET_IS_USER_FEEDBACK_BLOCK,
  ({ isUserFeedbackBlock }) => {
    return { isUserFeedbackBlock };
  },
);
export const setSubmitAddrZkspaceModal = createThunkAction(
  SET_SUBMIT_ADDR_ZKSPACE_MODAL,
  ({ submitAddrZkspaceModal, email }) => {
    if (!email) {
      return { submitAddrZkspaceModal: false };
    }
    if (submitAddrZkspaceModal) {
      setShowZkspaceFinishTask(email);
      if (!canShowZkspaceSubmitModal(email)) {
        return { submitAddrZkspaceModal: false };
      }
    }
    setShowZkspaceSubmitModal(email);
    return { submitAddrZkspaceModal };
  },
);
export const setShowTemplateChart = createThunkAction(
  SHOW_TEMPLATE_CHART,
  ({ show, databaseId }) => {
    return { show, databaseId };
  },
);
export const setShowPreviewChart = createThunkAction(
  SHOW_PREVIEW_CHART,
  ({ show, data }) => {
    return { show, data };
  },
);
export const nextChartPopoverAction = createThunkAction(
  NEXT_CHART_POPOVER_Action,
  ({ time, next }) => {
    return { time, next };
  },
);
export const closeAllChartPopoverAction = createThunkAction(
  CLOSE_ALL_CHART_POPOVER_Action,
  ({ time }) => {
    return { time };
  },
);
export const setNewGuideInfo = createThunkAction(
  SET_NEW_GUIDE_INFO,
  newGuideInfo => {
    return newGuideInfo;
  },
);

//设置用户额外信息
export const setDarkMode = createThunkAction(SET_DARK_MODE, darkMode => {
  localStorage.setItem("sql-editor-dark-mode", darkMode);
  return darkMode;
});

export const setGames = createThunkAction(SET_GAMES, games => {
  return games;
});

export const setHistoryGames = createThunkAction(SET_HISTORY_GAMES, games => {
  window.localStorage.setItem("historyGames", JSON.stringify(games))
  return games;
});

export const setBindGameMapping = createThunkAction(SET_BIND_GAME_MAPPING, mapping => {
  return mapping;
});

export const setFgaChain = createThunkAction(SET_FGA_CHAIN, chain => {
  return chain;
});

export const setPeaToken = createThunkAction(SET_PEA_TOKEN, token => {
  return token;
});

export const LOAD_FGA_FAVORITE_LIST =
  "metabase/user/LOAD_FGA_FAVORITE_LIST";
export const loadFgaFavoriteList = createThunkAction(
  LOAD_FGA_FAVORITE_LIST,
  () =>
    async (dispatch, getState) => {
      if (getState().currentUser) {
        return await getProtocolFavorite();
      } else {
        return { protocolList: [] }
      }
    },
);

export const LOAD_FGA_PROTOCOL_LIST =
  "metabase/user/LOAD_FGA_PROTOCOL_LIST";
export const loadFgaProtocolList = createThunkAction(
  LOAD_FGA_PROTOCOL_LIST,
  (chain) =>
    async (dispatch, getState) => {
      if (isBusinessTypePath("public-chain")) {
        return await getProtocolList({ chain });
      }
      let result = await getProtocolList();
      if (result) {
        return {
          protocolList: [
            ...result.protocolList,
            {
              "protocolSlug": "Demo Project",
              "protocolName": "Demo Project",
            }
          ]
        };
      } else {
        return result;
      }
    },
);
export const LOAD_FGA_PROJECT_LIST =
  "metabase/user/LOAD_FGA_PROJECT_LIST";
export const loadFgaProjectList = createThunkAction(
  LOAD_FGA_PROJECT_LIST,
  ({ from, clear }) =>
    async (dispatch, getState) => {
      if (clear) {
        return null
      }
      return await getProjectList({ from: from || "" });
    },
);
export const LOAD_FGA_DASHBOARD_KEY =
  "metabase/user/LOAD_FGA_DASHBOARD_KEY";
export const setFgaDashboardKey = createThunkAction(
  LOAD_FGA_DASHBOARD_KEY,
  ({ key }) =>
    async (dispatch, getState) => {
      return key;
    },
);

export const resetFgaProtocolList = createThunkAction(
  LOAD_FGA_PROTOCOL_LIST,
  () =>
    async (dispatch, getState) => {
      return null;
    },
);

export const control = handleActions(
  {
    [CREATE_FGA_PROJECT_MODAL_SHOW]: {
      next: (state, { payload }) => {
        return {
          ...state,
          createFgaProjectModalShow: payload,
        };
      },
    },
    [PROJECT_SUBMIT_MODAL_SHOW]: {
      next: (state, { payload }) => {
        return {
          ...state,
          projectSubmitModalShow: payload.show,
          projectSubmitModalForce: payload.force,
        };
      },
    },
    [LOGIN_MODAL_SHOW]: {
      next: (state, { payload }) => {
        return {
          ...state,
          loginModalShow: payload.show,
          loginModalRedirect: payload.redirect,
          loginModalDefaultRegister: payload.defaultRegister,
        };
      },
    },
    [FEATURES_SIDE_HIDE]: {
      next: (state, { payload }) => {
        return {
          ...state,
          featuresSideHide: payload.hide,
        };
      },
    },
    [CREATE_MODAL_SHOW]: {
      next: (state, { payload }) => {
        return {
          ...state,
          createModalShow: payload.show,
        };
      },
    },
    [CANCEL_FEEDBACK_SHOW]: {
      next: (state, { payload }) => {
        return {
          ...state,
          cancelFeedback: payload,
        };
      },
    },
    [SET_IS_USER_FEEDBACK_BLOCK]: {
      next: (state, { payload }) => {
        return {
          ...state,
          isUserFeedbackBlock: payload.isUserFeedbackBlock,
        };
      },
    },
    [SET_SUBMIT_ADDR_ZKSPACE_MODAL]: {
      next: (state, { payload }) => {
        return {
          ...state,
          submitAddrZkspaceModal: payload.submitAddrZkspaceModal,
        };
      },
    },
    [SHOW_TEMPLATE_CHART]: {
      next: (state, { payload }) => {
        return {
          ...state,
          showTemplateChart: payload,
        };
      },
    },
    [SHOW_PREVIEW_CHART]: {
      next: (state, { payload }) => {
        return {
          ...state,
          showPreviewChart: payload,
        };
      },
    },
    [NEXT_CHART_POPOVER_Action]: {
      next: (state, { payload }) => {
        return {
          ...state,
          nextChartPopover: payload,
        };
      },
    },
    [CLOSE_ALL_CHART_POPOVER_Action]: {
      next: (state, { payload }) => {
        return {
          ...state,
          closeAllChartPopover: payload,
        };
      },
    },
    [SET_NEW_GUIDE_INFO]: {
      next: (state, { payload }) => {
        return {
          ...state,
          newGuideInfo: payload,
        };
      },
    },
    [SET_DARK_MODE]: {
      next: (state, { payload }) => {
        return {
          ...state,
          darkMode: payload,
        };
      },
    },
    [SET_GAMES]: {
      next: (state, { payload }) => {
        return {
          ...state,
          games: payload,
        };
      },
    },
    [SET_HISTORY_GAMES]: {
      next: (state, { payload }) => {
        return {
          ...state,
          historyGames: payload,
        };
      },
    },
    [SET_BIND_GAME_MAPPING]: {
      next: (state, { payload }) => {
        return {
          ...state,
          bindGameMapping: payload,
        };
      },
    },
    [SET_FGA_CHAIN]: {
      next: (state, { payload }) => {
        return {
          ...state,
          chain: payload,
        };
      },
    },
    [SET_PEA_TOKEN]: {
      next: (state, { payload }) => {
        return {
          ...state,
          peaToken: payload,
        };
      },
    },
    [LOAD_FGA_FAVORITE_LIST]: {
      next: (state, { payload }) => {
        return {
          ...state,
          fgaFavoriteList: payload?.protocolList,
        };
      },
    },
    [LOAD_FGA_PROTOCOL_LIST]: {
      next: (state, { payload }) => {
        return {
          ...state,
          fgaProtocolList: payload?.protocolList,
        };
      },
    },
    [LOAD_FGA_PROJECT_LIST]: {
      next: (state, { payload }) => {
        return {
          ...state,
          fgaProjectList: payload,
        };
      },
    },
    [LOAD_FGA_DASHBOARD_KEY]: {
      next: (state, { payload }) => {
        return {
          ...state,
          fgaDashboardKey: payload,
        };
      },
    },
  },
  {
    newGuideInfo: {},
    darkMode: localStorage.getItem("sql-editor-dark-mode") !== "false",
  },
);

export default control;
