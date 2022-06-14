import { handleActions } from "metabase/lib/redux";
import { createAction } from "redux-actions";

export const QUESTION_SIDE_HIDE = "metabase/control/QuestionSideHide";

export const questionSideHideAction = createAction(
  QUESTION_SIDE_HIDE,
  ({ hide }) => {
    return { hide };
  },
);

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
  },
  { questionSideHide: false },
);
