import {
  combineReducers,
  createThunkAction,
  handleActions,
} from "metabase/lib/redux";
import { loadAppConfig } from "metabase/new-service";
import { SET_OPTIONS } from "./embed";
import { REFRESH_SITE_SETTINGS } from "./settings";

export const QUESTION_SIDE_HIDE = "metabase/control/QuestionSideHide";

export const questionSideHideAction = createThunkAction(
  QUESTION_SIDE_HIDE,
  ({ hide }) => {
    console.log("questionSideHideAction", hide)
    return { hide };
  },
);

export const LOAD_CONFIG = "metabase/config/LOAD_CONFIG";
export const loadConfig = createThunkAction(LOAD_CONFIG, async () => {
  try {
    return await loadAppConfig();
  } catch (e) {
    return null;
  }
});

const config = handleActions(
  {
    [QUESTION_SIDE_HIDE]: {
      next: (state, { payload }) => {
        return {
          ...state,
          questionSideHide: payload.hide,
        };
      },
    },
    [LOAD_CONFIG]: {
      next: (state, { payload }) => {
        return {
          ...state,
          tableConfigList: payload?.tableConfigList,
        };
      },
    },
  },
  { questionSideHide: false, tableConfigList: [] },
);

export default config;
