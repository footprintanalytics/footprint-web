import { handleActions } from "metabase/lib/redux";
import { createAction } from "redux-actions";
import {
  canShowZkspaceSubmitModal,
  setShowZkspaceFinishTask,
  setShowZkspaceSubmitModal,
} from "metabase/lib/register-activity";

export const LOGIN_MODAL_SHOW = "metabase/control/loginModalShow";

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

export const loginModalShowAction = createAction(
  LOGIN_MODAL_SHOW,
  ({ show, from, channel }) => {
    localStorage.setItem("login-modal-from", from);
    return { show };
  },
);
export const featuresSideHideAction = createAction(
  FEATURES_SIDE_HIDE,
  ({ hide }) => {
    return { hide };
  },
);
export const createModalShowAction = createAction(
  CREATE_MODAL_SHOW,
  ({ show }) => {
    return { show };
  },
);
export const cancelFeedbackAction = createAction(
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
export const setIsCancelFeedbackBlockAction = createAction(
  SET_IS_USER_FEEDBACK_BLOCK,
  ({ isUserFeedbackBlock }) => {
    return { isUserFeedbackBlock };
  },
);
export const setSubmitAddrZkspaceModal = createAction(
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
export const setShowTemplateChart = createAction(
  SHOW_TEMPLATE_CHART,
  ({ show, databaseId }) => {
    return { show, databaseId };
  },
);
export const setShowPreviewChart = createAction(
  SHOW_PREVIEW_CHART,
  ({ show, data }) => {
    return { show, data };
  },
);
export const nextChartPopoverAction = createAction(
  NEXT_CHART_POPOVER_Action,
  ({ time, next }) => {
    return { time, next };
  },
);
export const closeAllChartPopoverAction = createAction(
  CLOSE_ALL_CHART_POPOVER_Action,
  ({ time }) => {
    return { time };
  },
);
export const setNewGuideInfo = createAction(
  SET_NEW_GUIDE_INFO,
  newGuideInfo => {
    return newGuideInfo;
  },
);
export const setDarkMode = createAction(SET_DARK_MODE, darkMode => {
  localStorage.setItem("sql-editor-dark-mode", darkMode);
  return darkMode;
});

export const control = handleActions(
  {
    [LOGIN_MODAL_SHOW]: {
      next: (state, { payload }) => {
        return {
          ...state,
          loginModalShow: payload.show,
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
  },
  {
    newGuideInfo: {},
    darkMode: localStorage.getItem("sql-editor-dark-mode") === "true",
  },
);
