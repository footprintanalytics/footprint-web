import { createSelector } from "reselect";
import { get } from "lodash";

export const getUser = state => state.currentUser;

export const getUserId = createSelector([getUser], user => user?.id);

export const getUserIsAdmin = createSelector(
  [getUser],
  user => (user && user.is_superuser) || false,
);

export const getUserAttributes = createSelector(
  [getUser],
  user => (user && user.login_attributes) || [],
);

export const getUserPersonalCollectionId = createSelector(
  [getUser],
  user => (user && user.personal_collection_id) || null,
);

export const getUserCreateQueryPermission = createSelector([getUser], user => {
  const current = get(user, "vipInfo.currentQuestion", 0);
  const limit = get(user, "vipInfo.questionLimit", 0);
  return current < limit;
});

export const getUserCreateDashboardPermission = createSelector(
  [getUser],
  user => {
    const current = get(user, "vipInfo.currentDashBoard", 0);
    const limit = get(user, "vipInfo.dashBoardLimit", 0);
    return current < limit;
  },
);

export const getUserNativeQueryPermission = createSelector([getUser], user =>
  get(user, "vipInfo.nativeQuery", false),
);

export const getUserAdvancedChartingPermission = createSelector(
  [getUser],
  user => get(user, "vipInfo.advancedCharting", false),
);

export const getUserClearWatermarkPermission = createSelector([getUser], user =>
  get(user, "vipInfo.clearWatermark", false),
);

export const getUserDownloadPermission = createSelector([getUser], user =>
  get(user, "vipInfo.exportToCsv", false),
);

export const getUserSubscribeInfo = createSelector([getUser], user =>
  get(user, "subscribeInfo", {}),
);
