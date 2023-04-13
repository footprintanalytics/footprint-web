import {
  createAction,
  createThunkAction,
  handleActions,
} from "metabase/lib/redux";
import { UserApi } from "metabase/services";
// import { CLOSE_QB_NEWB_MODAL } from "metabase/query_builder/actions";
import Users from "metabase/entities/users";
import {
  getUserVipInfo,
  getDataApiVipInfo,
  GetFgaProjectDetail,
} from "metabase/new-service";
import arms from "metabase/lib/arms";

export const REFRESH_CURRENT_USER = "metabase/user/REFRESH_CURRENT_USER";
/*export const refreshCurrentUser = createAction(REFRESH_CURRENT_USER, () => {
  try {
    return UserApi.current();
  } catch (e) {
    return null;
  }
});*/

export const refreshCurrentUser = createAction(
  REFRESH_CURRENT_USER,
  async () => {
    try {
      const res = await UserApi.current();
      if (res.id) {
        window.localStorage.setItem("GAUserId", res.id);
      }
      if (res.email) {
        if (window.gtag) {
          window.gtag("set", { user_id: res.email });
          window.gtag("set", "user_properties", {
            common_name: res.common_name,
            email: res.email,
          });
        }
        if (window.TINGYUN) {
          window.TINGYUN.setDid(res.email);
        }
        if (arms) {
          arms.setConfig({
            uid: res.email,
            setUsername: () => res.name,
            disabled: ["refreshCache"].includes(res.name),
          });
        }
      }
      return res;
    } catch (e) {
      return null;
    }
  },
);

export const LOAD_CURRENT_USER = "metabase/user/LOAD_CURRENT_USER";
export const loadCurrentUser = createThunkAction(
  LOAD_CURRENT_USER,
  () => async (dispatch, getState) => {
    if (!getState().currentUser) {
      await dispatch(refreshCurrentUser());
    }
  },
);

export const CLEAR_CURRENT_USER = "metabase/user/CLEAR_CURRENT_USER";
export const clearCurrentUser = createAction(CLEAR_CURRENT_USER);

export const LOAD_CURRENT_USER_VIP = "metabase/user/LOAD_CURRENT_USER_VIP";
export const loadCurrentUserVip = createThunkAction(
  LOAD_CURRENT_USER_VIP,
  () => (dispatch, getState) => {
    if (getState().currentUser) {
      return getUserVipInfo();
    }
  },
);

export const LOAD_CURRENT_USER_VIP_DATA_API =
  "metabase/user/LOAD_CURRENT_USER_VIP_DATA_API";
export const loadCurrentUserVipDataApi = createThunkAction(
  LOAD_CURRENT_USER_VIP_DATA_API,
  () => (dispatch, getState) => {
    if (getState().currentUser) {
      return getDataApiVipInfo();
    }
  },
);

export const UPDATE_SUBSCRIBE_INFO = "metabase/user/UPDATE_SUBSCRIBE_INFO";
export const updateSubscribeInfo = createThunkAction(
  UPDATE_SUBSCRIBE_INFO,
  subscribeInfo => (dispatch, getState) => {
    if (getState().currentUser) {
      return subscribeInfo;
    }
  },
);

export const currentUser = handleActions(
  {
    [CLEAR_CURRENT_USER]: { next: (state, payload) => null },
    // [REFRESH_CURRENT_USER]: { next: (state, { payload }) => payload },
    // [CLOSE_QB_NEWB_MODAL]: {
    //   next: (state, { payload }) => ({ ...state, is_qbnewb: false }),
    // },
    [Users.actionTypes.UPDATE]: {
      next: (state, { payload }) => {
        const isCurrentUserUpdated = state.id === payload.user.id;
        if (isCurrentUserUpdated) {
          return {
            ...state,
            ...payload.user,
          };
        }
        return state;
      },
    },
    [REFRESH_CURRENT_USER]: {
      next: (state, { payload }) => {
        if (!payload) {
          return payload;
        }
        return { ...payload, vipInfo: state?.vipInfo };
      },
    },
    [LOAD_CURRENT_USER_VIP]: {
      next: (state, { payload }) => {
        if (payload) {
          return { ...state, vipInfo: { ...payload } };
        }
        return state;
      },
    },
    [LOAD_CURRENT_USER_VIP_DATA_API]: {
      next: (state, { payload }) => {
        if (payload) {
          return { ...state, vipInfoDataApi: { ...payload } };
        }
        return state;
      },
    },
    [UPDATE_SUBSCRIBE_INFO]: {
      next: (state, { payload }) => {
        if (payload) {
          return { ...state, subscribeInfo: payload };
        }
        return state;
      },
    },
  },
  null,
);

export const REFRESH_CURRENT_FGA_PROJECT =
  "metabase/user/REFRESH_CURRENT_FGA_PROJECT";
export const refreshCurrentFgaProject = createThunkAction(
  REFRESH_CURRENT_FGA_PROJECT,
  async project_id => {
    try {
      const res = await GetFgaProjectDetail({
        projectId: project_id,
      });
      // if (res.id) {
      //   window.localStorage.setItem("LatestGAProjectId", res.id);
      // }
      return res;
    } catch (e) {
      return null;
    }
  },
);

export const LOAD_CURRENT_FGA_PROJECT =
  "metabase/user/LOAD_CURRENT_FGA_PROJECT";
export const loadCurrentFgaProject = createThunkAction(
  LOAD_CURRENT_FGA_PROJECT,
  (project_id, force = false) =>
    async (dispatch, getState) => {
      if (!project_id) {
        return;
      }
      if (
        force ||
        !getState().currentFgaProject ||
        getState().currentFgaProject?.id !== project_id
      ) {
        await dispatch(refreshCurrentFgaProject(project_id));
      }
    },
);

export const CLEAR_CURRENT_FGA_PROJECT =
  "metabase/user/CLEAR_CURRENT_FGA_PROJECT";
export const clearCurrentFgaProject = createAction(CLEAR_CURRENT_FGA_PROJECT);

export const currentFgaProject = handleActions(
  {
    [CLEAR_CURRENT_FGA_PROJECT]: { next: (state, payload) => null },
    [REFRESH_CURRENT_FGA_PROJECT]: {
      next: (state, { payload }) => {
        console.log("REFRESH_CURRENT_FGA_PROJECT", payload);
        if (!payload) {
          return payload;
        }
        return { ...state, ...payload };
      },
    },
  },
  null,
);
