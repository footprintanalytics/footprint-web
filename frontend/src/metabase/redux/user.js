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
  GetFgaProjectDetail, getPublicChainProjectDetail,
} from "metabase/new-service";
import arms from "metabase/lib/arms";
import { clearGACache } from "metabase/growth/utils/utils";
import { isABPath, isBusinessTypePath } from "metabase/ab/utils/utils";

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
    console.log("refreshCurrentFgaProject")
    try {
      let res
      if (isABPath()) {
        if (project_id === 153) {
          res = {
            "id": 153,
            "isDemo": false,
            "protocolName": "Project A",
            "protocolSlug": "Project A",
            "logo": "",
            "protocolType": "",
            "tokenAddress": [],
            "nftCollectionAddress": [
              {
                "address": "0x59325733eb952a92e069c87f0a6168b29e80627f",
                "chain": "Ethereum"
              }
            ],
            "twitter": {},
            "discord": {},
            "ga": {}
          }
        }
        if (project_id === 154) {
          res = {
            "id": 154,
            "isDemo": false,
            "protocolName": "Mocaverse",
            "protocolSlug": "Mocaverse",
            "logo": "",
            "protocolType": "",
            "tokenAddress": [],
            "nftCollectionAddress": [
              {
                "address": "0x59325733eb952a92e069c87f0a6168b29e80627f",
                "chain": "Ethereum"
              }
            ],
            "twitter": {},
            "discord": {},
            "ga": {}
          }
        }
        if (project_id === 155) {
          res = {
            "id": 155,
            "isDemo": false,
            "protocolName": "xxx",
            "protocolSlug": "xxx",
            "logo": "",
            "protocolType": "",
            "tokenAddress": [],
            "nftCollectionAddress": [
              {
                "address": "0x59325733eb952a92e069c87f0a6168b29e80627f",
                "chain": "Ethereum"
              }
            ],
            "twitter": {},
            "discord": {},
            "ga": {}
          }
        }
        if (project_id === 156) {
          res = {
            "id": 156,
            "isDemo": false,
            "protocolName": "duke",
            "protocolSlug": "duke",
            "logo": "",
            "protocolType": "",
            "tokenAddress": [],
            "nftCollectionAddress": [
              {
                "address": "0x59325733eb952a92e069c87f0a6168b29e80627f",
                "chain": "Ethereum"
              }
            ],
            "twitter": {},
            "discord": {},
            "ga": {}
          }
        }
        if (project_id === 157) {
          res = {
            "id": 157,
            "isDemo": false,
            "protocolName": "TorqueSquad",
            "protocolSlug": "TorqueSquad",
            "logo": "",
            "protocolType": "",
            "tokenAddress": [],
            "nftCollectionAddress": [
              {
                "address": "0x59325733eb952a92e069c87f0a6168b29e80627f",
                "chain": "Ethereum"
              }
            ],
            "twitter": {},
            "discord": {},
            "ga": {}
          }
        }
      } else {
        res = await GetFgaProjectDetail({
          projectId: project_id,
        });
      }
      if(!res?.protocolSlug||res?.protocolSlug===''){
        res.protocolSlug = 'default';
      }
      window.localStorage.setItem("IsFgaDemoProject", res?.isDemo);
      window.localStorage.setItem("LatestGAProjectId", res?.id);
      return res;
    } catch (e) {
      return null;
    }
  },
);

export const REFRESH_CURRENT_FGA_PROJECT_NEW =
  "metabase/user/REFRESH_CURRENT_FGA_PROJECT_NEW";
export const refreshCurrentFgaProjectNew = createThunkAction(
  REFRESH_CURRENT_FGA_PROJECT,
  async protocolSlug => {
    console.log("refreshCurrentFgaProjectNew", protocolSlug)
    try {
      let res
      if (isBusinessTypePath("public-chain")) {
          res = {
            // "id": 153,
            "protocolName": protocolSlug,
            "protocolSlug": protocolSlug,
            "protocolType": "",
            "tokenAddress": [],
            "nftCollectionAddress": [
              {
                "address": "0x2ed4db5636835acfc583af96c66cde1d8c2c1a25",
                "chain": "Ethereum"
              }
            ],
          }
          const result = await getPublicChainProjectDetail({ "protocolSlug": protocolSlug });
          const temp = result.rows?.length > 0 ? {
            protocolName: result.rows[0][1],
            protocolSlug: result.rows[0][2],
            protocolType: result.rows[0][4],
            tokenAddress: [],
            nftCollectionAddress: result.rows.map(row => {
              return {
                address: row[5],
                chain: result.rows[0][3],
              }
            })
          } : {}
          // res = result.rows?.length > 0 ? temp : res;
        }

       else if (isABPath()) {
        if (protocolSlug === "Project A") {
          res = {
            "id": 153,
            "isDemo": false,
            "protocolName": "Project A",
            "protocolSlug": "Project A",
            "logo": "",
            "protocolType": "",
            "tokenAddress": [],
            "nftCollectionAddress": [
              {
                "address": "0x59325733eb952a92e069c87f0a6168b29e80627f",
                "chain": "Ethereum"
              }
            ],
            "twitter": {},
            "discord": {},
            "ga": {}
          }
        }
        if (protocolSlug === "Mocaverse") {
          res = {
            "id": 154,
            "isDemo": false,
            "protocolName": "Mocaverse",
            "protocolSlug": "Mocaverse",
            "logo": "",
            "protocolType": "",
            "tokenAddress": [],
            "nftCollectionAddress": [
              {
                "address": "0x59325733eb952a92e069c87f0a6168b29e80627f",
                "chain": "Ethereum"
              }
            ],
            "twitter": {},
            "discord": {},
            "ga": {}
          }
        }
        if (protocolSlug === "xxx") {
          res = {
            "id": 155,
            "isDemo": false,
            "protocolName": "xxx",
            "protocolSlug": "xxx",
            "logo": "",
            "protocolType": "",
            "tokenAddress": [],
            "nftCollectionAddress": [
              {
                "address": "0x59325733eb952a92e069c87f0a6168b29e80627f",
                "chain": "Ethereum"
              }
            ],
            "twitter": {},
            "discord": {},
            "ga": {}
          }
        }
        if (protocolSlug === "duke") {
          res = {
            "id": 156,
            "isDemo": false,
            "protocolName": "duke",
            "protocolSlug": "duke",
            "logo": "",
            "protocolType": "",
            "tokenAddress": [],
            "nftCollectionAddress": [
              {
                "address": "0x59325733eb952a92e069c87f0a6168b29e80627f",
                "chain": "Ethereum"
              }
            ],
            "twitter": {},
            "discord": {},
            "ga": {}
          }
        }
        if (protocolSlug === "TorqueSquad") {
          res = {
            "id": 157,
            "isDemo": false,
            "protocolName": "TorqueSquad",
            "protocolSlug": "TorqueSquad",
            "logo": "",
            "protocolType": "",
            "tokenAddress": [],
            "nftCollectionAddress": [
              {
                "address": "0x59325733eb952a92e069c87f0a6168b29e80627f",
                "chain": "Ethereum"
              }
            ],
            "twitter": {},
            "discord": {},
            "ga": {}
          }
        }
      } else {
        // res = await GetFgaProjectDetail({
        //   projectId: project_id,
        // });
      }
      if(!res?.protocolSlug||res?.protocolSlug===''){
        res.protocolSlug = 'default';
      }
      window.localStorage.setItem("IsFgaDemoProject", res?.isDemo);
      window.localStorage.setItem("LatestGAProjectId", res?.id);
      console.log("res", res)
      return res;
    } catch (e) {
      console.log(e)
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
        dispatch(clearCurrentFgaProject());
        await dispatch(refreshCurrentFgaProject(project_id));
      }
    },
);
export const LOAD_CURRENT_FGA_PROJECT_NEW =
  "metabase/user/LOAD_CURRENT_FGA_PROJECT_NEW";
export const loadCurrentFgaProjectNew = createThunkAction(
  LOAD_CURRENT_FGA_PROJECT_NEW,
  (protocolSlug, force = false) =>
    async (dispatch, getState) => {
    console.log("loadCurrentFgaProjectNew", getState().currentFgaProject, protocolSlug)
      if (
        force ||
        !getState().currentFgaProject ||
        getState().currentFgaProject?.protocolSlug !== protocolSlug
      ) {
        dispatch(clearCurrentFgaProject());
        // await dispatch(refreshCurrentFgaProject(project_id));
        await dispatch(refreshCurrentFgaProjectNew(protocolSlug));
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
        if (!payload) {
          return payload;
        }
        return { ...state, ...payload };
      },
    },
    [REFRESH_CURRENT_FGA_PROJECT_NEW]: {
      next: (state, { payload }) => {
        if (!payload) {
          return payload;
        }
        return { ...state, ...payload };
      },
    },
  },
  null,
);
