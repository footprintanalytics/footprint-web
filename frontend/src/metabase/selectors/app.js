import { createSelector } from "reselect";

export const getErrorMessage = state =>
  state.app.errorPage &&
  state.app.errorPage.data &&
  (state.app.errorPage.data.message || state.app.errorPage.data);

export const getApp = state => state.app;

export const getChannel = createSelector([getApp], ({ channel }) => {
  return channel || "";
});
