import { createAction } from "redux-actions";
import { createThunkAction } from "metabase/lib/redux";

import { PulseApi } from "metabase/services";
import Pulses from "metabase/entities/pulses";

import { setErrorPage } from "metabase/redux/app";

import {
  getDefaultChannel,
  createChannel,
  NEW_PULSE_TEMPLATE,
} from "metabase/lib/pulse";
import { getEditingPulse, getPulseFormInput } from "./selectors";

export const SET_EDITING_PULSE = "SET_EDITING_PULSE";
export const UPDATE_EDITING_PULSE = "UPDATE_EDITING_PULSE";
export const SAVE_PULSE = "SAVE_PULSE";
export const SAVE_EDITING_PULSE = "SAVE_EDITING_PULSE";
export const TEST_PULSE = "TEST_PULSE";

export const FETCH_PULSE_FORM_INPUT = "FETCH_PULSE_FORM_INPUT";
export const FETCH_PULSE_CARD_PREVIEW = "FETCH_PULSE_CARD_PREVIEW";

export const FETCH_PULSE_LIST_BY_DASHBOARD_ID =
  "FETCH_PULSE_LIST_BY_DASHBOARD_ID";

export const setEditingPulse = createThunkAction(
  SET_EDITING_PULSE,
  function (id, initialCollectionId = null) {
    return async function (dispatch, getState) {
      if (id != null) {
        try {
          return Pulses.HACK_getObjectFromAction(
            await dispatch(Pulses.actions.fetch({ id })),
          );
        } catch (e) {
          console.error(e);
          dispatch(setErrorPage(e));
        }
      } else {
        // HACK: need a way to wait for form_input to finish loading
        const channels =
          getPulseFormInput(getState()).channels ||
          (await PulseApi.form_input()).channels;
        const defaultChannelSpec = getDefaultChannel(channels);
        return {
          ...NEW_PULSE_TEMPLATE,
          channels: defaultChannelSpec
            ? [createChannel(defaultChannelSpec)]
            : [],
          collection_id: initialCollectionId,
        };
      }
    };
  },
);

export const updateEditingPulse = createAction(UPDATE_EDITING_PULSE);

export const saveEditingPulse = createThunkAction(
  SAVE_EDITING_PULSE,
  function () {
    return async function (dispatch, getState) {
      const editingPulse = getEditingPulse(getState());
      if (editingPulse.id != null) {
        return Pulses.HACK_getObjectFromAction(
          await dispatch(Pulses.actions.update(editingPulse)),
        );
      } else {
        return Pulses.HACK_getObjectFromAction(
          await dispatch(Pulses.actions.create(editingPulse)),
        );
      }
    };
  },
);

export const testPulse = createThunkAction(TEST_PULSE, function (pulse) {
  return async function (dispatch, getState) {
    return await PulseApi.test(pulse);
  };
});

export const fetchPulseFormInput = createThunkAction(
  FETCH_PULSE_FORM_INPUT,
  function () {
    return async function (dispatch, getState) {

      // const result = await PulseApi.form_input();

      const result = {
        "channels": {
          "email": {
            "type": "email",
            "name": "Email",
            "allows_recipients": false,
            // "recipients": ["user", "email"],
            "schedules": ["hourly", "daily", "weekly", "monthly"],
            "configured": true,
            "no_detail": true,
          },
          /*"slack": {
            "type": "slack",
            "name": "Slack",
            "allows_recipients": false,
            "schedules": ["hourly", "daily", "weekly", "monthly"],
            "fields": [{
              "name": "channel",
              "type": "select",
              "displayName": "Post to",
              "options": [],
              "required": true,
            }],
            "configured": true,
          },*/
          "telegram": {
            "type": "telegram",
            "name": "Telegram",
            "allows_recipients": false,
            "schedules": ["hourly", "daily", "weekly", "monthly"],
            "fields": [{
              "name": "telegram_bot_token",
              "type": "input",
              "displayName": "Bot token",
              "options": [],
              "required": false,
            }, {
              "name": "telegram_room_id",
              "type": "input",
              "displayName": "Room id",
              "options": [],
              "required": false,
            }],
            "configured": true,
          },
          "discord": {
            "type": "discord",
            "name": "Discord",
            "allows_recipients": false,
            "schedules": ["hourly", "daily", "weekly", "monthly"],
            "fields": [{
              "name": "discord_webhook_url",
              "type": "select",
              "displayName": "Webhook url",
              "options": [],
              "required": false,
            }],
            "configured": true,
          },
        },
      };
      return result;
    };
  },
);

export const fetchPulseCardPreview = createThunkAction(
  FETCH_PULSE_CARD_PREVIEW,
  function (id) {
    return async function (dispatch, getState) {
      return await PulseApi.preview_card({ id: id });
    };
  },
);

export const fetchPulsesByDashboardId = createThunkAction(
  FETCH_PULSE_LIST_BY_DASHBOARD_ID,
  function (dashboard_id) {
    return async function (dispatch, getState) {
      return await PulseApi.list({ dashboard_id: dashboard_id });
    };
  },
);
