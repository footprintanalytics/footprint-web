import { combineReducers, handleActions } from "metabase/lib/redux";

import { LOCATION_CHANGE } from "react-router-redux";
import { createAction } from "redux-actions";

export const SET_ERROR_PAGE = "metabase/app/SET_ERROR_PAGE";
export const SET_CHANNEL = "metabase/app/SET_CHANNEL";

export function setErrorPage(error) {
  console.error("Error:", error);
  return {
    type: SET_ERROR_PAGE,
    payload: error,
  };
}

const errorPage = handleActions(
  {
    [SET_ERROR_PAGE]: (state, { payload }) => payload,
    [LOCATION_CHANGE]: () => null,
  },
  null,
);

export const setChannel = createAction(SET_CHANNEL, channel => {
  return { channel };
});

const channel = handleActions(
  {
    [SET_CHANNEL]: (state, { payload }) => payload.channel,
  },
  "",
);

export default combineReducers({
  errorPage,
  channel,
});
