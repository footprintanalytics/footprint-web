import { handleActions } from "metabase/lib/redux";
import { createAction } from "redux-actions";

export const CACHE_RECOMMEND_DATA = "metabase/control/cacheRecommendData";
export const CACHE_RECOMMEND_DAILY_DATA =
  "metabase/control/cacheRecommendDailyData";

export const cacheRecommendAction = createAction(
  CACHE_RECOMMEND_DATA,
  ({ data }) => {
    return { data };
  },
);

export const cacheRecommendDailyAction = createAction(
  CACHE_RECOMMEND_DAILY_DATA,
  ({ data }) => {
    return { data };
  },
);

export const cache = handleActions(
  {
    [CACHE_RECOMMEND_DATA]: {
      next: (state, { payload }) => {
        return {
          ...state,
          recommend: payload.data,
        };
      },
    },
    [CACHE_RECOMMEND_DAILY_DATA]: {
      next: (state, { payload }) => {
        return {
          ...state,
          recommendDaily: payload.data,
        };
      },
    },
  },
  {},
);
