import { handleActions } from "metabase/lib/redux";
import { createAction } from "redux-actions";
import { loadAppConfig } from "metabase/new-service";

export const QUESTION_SIDE_HIDE = "metabase/control/QuestionSideHide";

export const questionSideHideAction = createAction(
  QUESTION_SIDE_HIDE,
  ({ hide }) => {
    return { hide };
  },
);

export const LOAD_CONFIG = "metabase/config/LOAD_CONFIG";
export const loadConfig = createAction(LOAD_CONFIG, async () => {
  try {
    return await loadAppConfig();
  } catch (e) {
    return null;
  }
});

export const config = handleActions(
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
