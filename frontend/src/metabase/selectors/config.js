import { createSelector } from "reselect";

export const getConfig = state => state.config;

export const getTableConfigList = createSelector(
  [getConfig],
  ({ tableConfigList }) => {
    return tableConfigList || [];
  },
);

export const getRealtimeList = createSelector(
  [getConfig],
  ({ realtimeList }) => {
    return realtimeList || [];
  },
);
