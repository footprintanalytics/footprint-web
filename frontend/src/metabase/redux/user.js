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
  GetFgaProjectDetail, getPublicChainProjectDetail, getProtocolDetail, getProtocolDetailById,
} from "metabase/new-service";
import arms from "metabase/lib/arms";
import { clearGACache } from "metabase/growth/utils/utils";
import { isABPath, isBusinessTypePath } from "metabase/ab/utils/utils";
import { debounce } from 'lodash';
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
  async (configUser) => {
    if (configUser) {
      return configUser;
    }
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
        const fistLogin = res?.first_login ? Math.floor(new Date(res.first_login).getTime() / 1000) : Math.floor(new Date() / 1000)
        if (window.fgaSDK) {
          window.fgaSDK.setUserProperties({
            userId: res.id,
            userName: res.name,
            signUpAt: fistLogin,
          })
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
      let res
      if (isABPath()) {
        res = await GetFgaProjectDetail({
          projectId: project_id,
        });
      }
      // if (isABPath()) {
      //   if (project_id === 153) {
      //     res = {
      //       "id": 153,
      //       "isDemo": false,
      //       "protocolName": "Demo Project",
      //       "protocolSlug": "Demo Project",
      //       "logo": "",
      //       "protocolType": "",
      //       "tokenAddress": [],
      //       "nftCollectionAddress": [
      //         {
      //           "address": "0x59325733eb952a92e069c87f0a6168b29e80627f",
      //           "chain": "Ethereum"
      //         }
      //       ],
      //       "twitter": {},
      //       "discord": {},
      //       "ga": {}
      //     }
      //   }
      //   if (project_id === 154) {
      //     res = {
      //       "id": 154,
      //       "isDemo": false,
      //       "protocolName": "Mocaverse",
      //       "protocolSlug": "Mocaverse",
      //       "logo": "",
      //       "protocolType": "",
      //       "tokenAddress": [],
      //       "nftCollectionAddress": [
      //         {
      //           "address": "0x59325733eb952a92e069c87f0a6168b29e80627f",
      //           "chain": "Ethereum"
      //         }
      //       ],
      //       "twitter": {},
      //       "discord": {},
      //       "ga": {}
      //     }
      //   }
      //   if (project_id === 155) {
      //     res = {
      //       "id": 155,
      //       "isDemo": false,
      //       "protocolName": "xxx",
      //       "protocolSlug": "xxx",
      //       "logo": "",
      //       "protocolType": "",
      //       "tokenAddress": [],
      //       "nftCollectionAddress": [
      //         {
      //           "address": "0x59325733eb952a92e069c87f0a6168b29e80627f",
      //           "chain": "Ethereum"
      //         }
      //       ],
      //       "twitter": {},
      //       "discord": {},
      //       "ga": {}
      //     }
      //   }
      //   if (project_id === 156) {
      //     res = {
      //       "id": 156,
      //       "isDemo": false,
      //       "protocolName": "duke",
      //       "protocolSlug": "duke",
      //       "logo": "",
      //       "protocolType": "",
      //       "tokenAddress": [],
      //       "nftCollectionAddress": [
      //         {
      //           "address": "0x59325733eb952a92e069c87f0a6168b29e80627f",
      //           "chain": "Ethereum"
      //         }
      //       ],
      //       "twitter": {},
      //       "discord": {},
      //       "ga": {}
      //     }
      //   }
      //   if (project_id === 157) {
      //     res = {
      //       "id": 157,
      //       "isDemo": false,
      //       "protocolName": "TorqueSquad",
      //       "protocolSlug": "TorqueSquad",
      //       "logo": "",
      //       "protocolType": "",
      //       "tokenAddress": [],
      //       "nftCollectionAddress": [
      //         {
      //           "address": "0x59325733eb952a92e069c87f0a6168b29e80627f",
      //           "chain": "Ethereum"
      //         }
      //       ],
      //       "twitter": {},
      //       "discord": {},
      //       "ga": {}
      //     }
      //   }
      // }
      else {
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
  async (protocolSlug, from) => {
    try {
      let res
      if (isABPath()) {
        if (protocolSlug === "Demo Project") {
           res = {
             "isDemo": true,
             "protocolSlug": "Demo Project",
             "contractAddress": [
               {
                 "chain": "Ethereum",
                 "address": "0x5cc5b05a8a13e3fbdb0bb9fccd98d38e50f90c38",
                 "standard": "ERC721"
               },
               {
                 "chain": "Ethereum",
                 "address": "0x50f5474724e0ee42d9a4e711ccfb275809fd6d4a",
                 "standard": "ERC721"
               },
               {
                 "chain": "Ethereum",
                 "address": "0x3845badade8e6dff049820680d1f14bd3903a5d0",
                 "standard": "ERC20"
               },
               {
                 "chain": "BNB Chain",
                 "address": "0x67b725d7e342d7b611fa85e859df9697d9378b2e",
                 "standard": "ERC20"
               }
             ],
             "tokenAddress": [
               {
                 "chain": "Ethereum",
                 "address": "0x3845badade8e6dff049820680d1f14bd3903a5d0",
                 "standard": "ERC20"
               },
               {
                 "chain": "BNB Chain",
                 "address": "0x67b725d7e342d7b611fa85e859df9697d9378b2e",
                 "standard": "ERC20"
               }
             ],
             "nftCollectionAddress": [
               {
                 "chain": "Ethereum",
                 "address": "0x5cc5b05a8a13e3fbdb0bb9fccd98d38e50f90c38",
                 "standard": "ERC721"
               },
               {
                 "chain": "Ethereum",
                 "address": "0x50f5474724e0ee42d9a4e711ccfb275809fd6d4a",
                 "standard": "ERC721"
               }
             ],
             "protocolType": "NFT",
             "protocolName": "Demo Project",
             "twitter": {},
             "discord": {},
             "ga": {},
             "id": 1,
             "existsWeb2Data": true
           }
         } else if (protocolSlug === "Gaming Demo Project") {
          res = {
            "isDemo": true,
            "protocolSlug": "Gaming Demo Project",
            "contractAddress": [
              {
                "chain": "Polygon",
                "address": "0x5b30cc4def69ae2dfcddbc7ebafea82cedae0190",
                "standard": "ERC721"
              },
              {
                "chain": "Polygon",
                "address": "0x3a85ac1a9344a5940c614b4b79fe74b40469f936",
                "standard": "ERC721"
              },
              {
                "chain": "Ethereum",
                "address": "0x1fe1ffffef6b4dca417d321ccd37e081f604d1c7",
                "standard": "ERC721"
              },
              {
                "chain": "Polygon",
                "address": "0x60adeeabe344d34eb0473350192d7efef7176610",
                "standard": "ERC721"
              },
              {
                "chain": "Ethereum",
                "address": "0xd9016a907dc0ecfa3ca425ab20b6b785b42f2373",
                "symbol": "GMEE",
                "name": "GAMEE"
              },
            ],
            "tokenAddress": [
              {
                "chain": "Ethereum",
                "address": "0xd9016a907dc0ecfa3ca425ab20b6b785b42f2373",
                "symbol": "GMEE",
                "name": "GAMEE"
              },
            ],
            "nftCollectionAddress": [
              {
                "chain": "Polygon",
                "address": "0x5b30cc4def69ae2dfcddbc7ebafea82cedae0190",
                "standard": "ERC721"
              },
              {
                "chain": "Polygon",
                "address": "0x3a85ac1a9344a5940c614b4b79fe74b40469f936",
                "standard": "ERC721"
              },
              {
                "chain": "Ethereum",
                "address": "0x1fe1ffffef6b4dca417d321ccd37e081f604d1c7",
                "standard": "ERC721"
              },
              {
                "chain": "Polygon",
                "address": "0x60adeeabe344d34eb0473350192d7efef7176610",
                "standard": "ERC721"
              },
            ],
            "protocolType": "NFT",
            "protocolName": "Gaming Demo Project",
            "twitter": {},
            "discord": {},
            "ga": {},
            "id": 2,
            "existsWeb2Data": true,
            "walletRetentionChain": "Ethereum"
          }
        } else if (protocolSlug === "Gaming Demo Project 2") {
          res = {
            "isDemo": true,
            "protocolSlug": "Gaming Demo Project 2",
            "contractAddress": [
              {
                "chain": "Ethereum",
                "address": "0x59325733eb952a92e069C87F0A6168b29E80627f",
                "standard": "ERC721"
              },
              /*{
                "chain": "Polygon",
                "address": "0x97e114d21063a331312bea8cf00db2b580238003",
                "standard": "ERC721"
              },
              {
                "chain": "Polygon",
                "address": "0x2ed9bdbf99c28082e3565395cbce61623b2689b9",
                "standard": "ERC721"
              },
              {
                "chain": "Polygon",
                "address": "0x0686113b494851402389e6371ca7c76da4ed0875",
                "standard": "ERC721"
              },
              {
                "chain": "Polygon",
                "address": "0x7e4522f8ec18ba87326caaeac4bdd0dd9323f505",
                "standard": "ERC721"
              },
              {
                "chain": "Polygon",
                "address": "0xbd662d0d765428a79aee9ae7b003e7037d77f041",
                "standard": "ERC721"
              },
              {
                "chain": "Ethereum",
                "address": "0x39fa15e7dffd76bdeec83c9a1a8ef023661c9b6c",
                "standard": "ERC721"
              },*/
              {
                "chain": "Ethereum",
                "address": "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
                "symbol": "ASTRAFER",
                "name": "Astrafer"
              },
            ],
            "tokenAddress": [
              {
                "chain": "Ethereum",
                "address": "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
                "symbol": "ASTRAFER",
                "name": "Astrafer"
              },
            ],
            "nftCollectionAddress": [
              {
                "chain": "Ethereum",
                "address": "0x59325733eb952a92e069C87F0A6168b29E80627f",
                "standard": "ERC721"
              },
              /*{
                "chain": "Ethereum",
                "address": "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
                "standard": "ERC721"
              },*/
              /*{
                "chain": "Polygon",
                "address": "0x2ed9bdbf99c28082e3565395cbce61623b2689b9",
                "standard": "ERC721"
              },
              {
                "chain": "Polygon",
                "address": "0x0686113b494851402389e6371ca7c76da4ed0875",
                "standard": "ERC721"
              },
              {
                "chain": "Polygon",
                "address": "0x7e4522f8ec18ba87326caaeac4bdd0dd9323f505",
                "standard": "ERC721"
              },
              {
                "chain": "Polygon",
                "address": "0xbd662d0d765428a79aee9ae7b003e7037d77f041",
                "standard": "ERC721"
              },
              {
                "chain": "Ethereum",
                "address": "0x39fa15e7dffd76bdeec83c9a1a8ef023661c9b6c",
                "standard": "ERC721"
              },*/
            ],
            "protocolType": "NFT",
            "protocolName": "Gaming Demo Project 2",
            "twitter": {},
            "discord": {},
            "ga": {},
            "id": from === 'pro' ? 631 : 3,
            "existsWeb2Data": true,
            "walletRetentionChain": "Polygon"
          }
        } else if (protocolSlug === "Metaverse Demo Project") {
          res = {
            "isDemo": true,
            "protocolSlug": "Metaverse Demo Project",
            "contractAddress": [
              {
                "chain": "Ethereum",
                "address": "0xa87a7edca1ec2163febae43648eb39d0e88aefb5",
                "standard": "ERC721"
              },
              {
                "chain": "Ethereum",
                "address": "0x5cc5b05a8a13e3fbdb0bb9fccd98d38e50f90c38",
                "standard": "ERC721"
              },
              {
                "chain": "Polygon",
                "address": "0x9d305a42a3975ee4c1c57555bed5919889dce63f",
                "standard": "ERC721"
              },
              {
                "chain": "Ethereum",
                "address": "0xf8173a39c56a554837c4c7f104153a005d284d11",
                "symbol": "EDU",
                "name": "EDU Coin"
              },
            ],
            "tokenAddress": [
              {
                "chain": "Ethereum",
                "address": "0xf8173a39c56a554837c4c7f104153a005d284d11",
                "symbol": "EDU",
                "name": "EDU Coin"
              },
            ],
            "nftCollectionAddress": [
              {
                "chain": "Ethereum",
                "address": "0xa87a7edca1ec2163febae43648eb39d0e88aefb5",
                "standard": "ERC721"
              },
              {
                "chain": "Ethereum",
                "address": "0x5cc5b05a8a13e3fbdb0bb9fccd98d38e50f90c38",
                "standard": "ERC721"
              },
              {
                "chain": "Polygon",
                "address": "0x9d305a42a3975ee4c1c57555bed5919889dce63f",
                "standard": "ERC721"
              },
            ],
            "protocolType": "NFT",
            "protocolName": "Metaverse Demo Project",
            "twitter": {},
            "discord": {},
            "ga": {},
            "id": 4,
            "existsWeb2Data": true,
            "walletRetentionChain": "Ethereum"
          }
        } else {
          // res = {
          //   // "id": 153,
          //   "protocolName": protocolSlug,
          //   "protocolSlug": protocolSlug,
          //   "protocolType": "",
          //   "tokenAddress": [],
          //   "nftCollectionAddress": [
          //     {
          //       "address": "0x2ed4db5636835acfc583af96c66cde1d8c2c1a25",
          //       "chain": "Ethereum"
          //     }
          //   ],
          // }
          res = await getProtocolDetail({ "protocolSlug": protocolSlug });
        }
        //   const result = await getPublicChainProjectDetail({ "protocolSlug": protocolSlug });
        //   const temp = result.rows?.length > 0 ? {
        //     protocolName: result.rows[0][1],
        //     protocolSlug: result.rows[0][2],
        //     protocolType: result.rows[0][4],
        //     tokenAddress: [],
        //     nftCollectionAddress: result.rows.map(row => {
        //       return {
        //         address: row[5],
        //         chain: result.rows[0][3],
        //       }
        //     })
        //   } : {}
        // res.protocolName = temp.protocolName
        // res.protocolSlug = temp.protocolName
        // res.nftCollectionAddress = temp.nftCollectionAddress
        // console.log("xxxxxx", res, temp)
          // res = result.rows?.length > 0 ? temp : res;
        // }

       // else if (isABPath()) {
       //  if (protocolSlug === "Demo Project") {
       //    res = {
       //      "id": 153,
       //      "isDemo": false,
       //      "protocolName": "Demo Project",
       //      "protocolSlug": "Demo Project",
       //      "logo": "",
       //      "protocolType": "",
       //      "tokenAddress": [],
       //      "nftCollectionAddress": [
       //        {
       //          "address": "0x59325733eb952a92e069c87f0a6168b29e80627f",
       //          "chain": "Ethereum"
       //        }
       //      ],
       //      "twitter": {},
       //      "discord": {},
       //      "ga": {}
       //    }
       //  }
       //  if (protocolSlug === "Mocaverse") {
       //    res = {
       //      "id": 154,
       //      "isDemo": false,
       //      "protocolName": "Mocaverse",
       //      "protocolSlug": "Mocaverse",
       //      "logo": "",
       //      "protocolType": "",
       //      "tokenAddress": [],
       //      "nftCollectionAddress": [
       //        {
       //          "address": "0x59325733eb952a92e069c87f0a6168b29e80627f",
       //          "chain": "Ethereum"
       //        }
       //      ],
       //      "twitter": {},
       //      "discord": {},
       //      "ga": {}
       //    }
       //  }
       //  if (protocolSlug === "xxx") {
       //    res = {
       //      "id": 155,
       //      "isDemo": false,
       //      "protocolName": "xxx",
       //      "protocolSlug": "xxx",
       //      "logo": "",
       //      "protocolType": "",
       //      "tokenAddress": [],
       //      "nftCollectionAddress": [
       //        {
       //          "address": "0x59325733eb952a92e069c87f0a6168b29e80627f",
       //          "chain": "Ethereum"
       //        }
       //      ],
       //      "twitter": {},
       //      "discord": {},
       //      "ga": {}
       //    }
       //  }
       //  if (protocolSlug === "duke") {
       //    res = {
       //      "id": 156,
       //      "isDemo": false,
       //      "protocolName": "duke",
       //      "protocolSlug": "duke",
       //      "logo": "",
       //      "protocolType": "",
       //      "tokenAddress": [],
       //      "nftCollectionAddress": [
       //        {
       //          "address": "0x59325733eb952a92e069c87f0a6168b29e80627f",
       //          "chain": "Ethereum"
       //        }
       //      ],
       //      "twitter": {},
       //      "discord": {},
       //      "ga": {}
       //    }
       //  }
       //  if (protocolSlug === "TorqueSquad") {
       //    res = {
       //      "id": 157,
       //      "isDemo": false,
       //      "protocolName": "TorqueSquad",
       //      "protocolSlug": "TorqueSquad",
       //      "logo": "",
       //      "protocolType": "",
       //      "tokenAddress": [],
       //      "nftCollectionAddress": [
       //        {
       //          "address": "0x59325733eb952a92e069c87f0a6168b29e80627f",
       //          "chain": "Ethereum"
       //        }
       //      ],
       //      "twitter": {},
       //      "discord": {},
       //      "ga": {}
       //    }
       //  }
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
      // res.id=153;
      return res;
    } catch (e) {
      console.log(e)
      return null;
    }
  },
);
export const refreshCurrentFgaProjectById = createThunkAction(
  REFRESH_CURRENT_FGA_PROJECT,
  async (projectId, from) => {
    try {
      const res = await getProtocolDetailById({ "projectId": projectId });
      if(!res?.protocolSlug || res?.protocolSlug === ''){
        res.protocolSlug = 'default';
      }
      window.localStorage.setItem("IsFgaDemoProject", res?.isDemo);
      window.localStorage.setItem("LatestGAProjectId", res?.id);
      // res.id=153;
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
  (protocolSlug, from, force = false, clearCurrent = true) =>
    async (dispatch, getState) => {
      if (
        force ||
        !getState().currentFgaProject ||
        getState().currentFgaProject?.protocolSlug !== protocolSlug
      ) {
        if (clearCurrent) {
          dispatch(clearCurrentFgaProject());
        }
        // await dispatch(refreshCurrentFgaProject(project_id));
        await dispatch(refreshCurrentFgaProjectNew(protocolSlug, from));
      }
    },
);
export const loadCurrentFgaProjectById = createThunkAction(
  LOAD_CURRENT_FGA_PROJECT_NEW,
  (projectId, from, force = false, clearCurrent = true) =>
    async (dispatch, getState) => {
      if (
        force ||
        !getState().currentFgaProject ||
        getState().currentFgaProject?.projectId !== projectId
      ) {
        if (clearCurrent) {
          dispatch(clearCurrentFgaProject());
        }
        // await dispatch(refreshCurrentFgaProject(project_id));
        await dispatch(refreshCurrentFgaProjectById(projectId, from));
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
