import { getIn } from "icepick";

import { t } from "ttag";
import promiseLimit from "promise-limit";
import { dynamicParamsApi } from "metabase/new-service";
import { normalize, schema } from "normalizr";
import querystring from "querystring";
import { createAction, createThunkAction } from "metabase/lib/redux";
import { defer } from "metabase/lib/promise";

import { getDashboardUiParameters } from "metabase/parameters/utils/dashboards";
import { getParameterValuesByIdFromQueryParams } from "metabase/parameters/utils/parameter-values";

import Utils from "metabase/lib/utils";

import { addParamValues, addFields } from "metabase/redux/metadata";

import {
  DashboardApi,
  CardApi,
  PublicApi,
  EmbedApi,
  AutoApi,
  MetabaseApi,
  maybeUsePivotEndpoint,
} from "metabase/services";

import { getMetadata } from "metabase/selectors/metadata";
import { getParameterValuesBySlug } from "metabase-lib/parameters/utils/parameter-values";
import { applyParameters } from "metabase-lib/queries/utils/card";
import {
  getDashboardComplete,
  getParameterValues,
  getLoadingDashCards,
} from "../selectors";

import {
  expandInlineDashboard,
  isVirtualDashCard,
  getAllDashboardCards,
  getDashboardType,
  fetchDataOrError,
  getDatasetQueryParams,
} from "../utils";
import { loadMetadataForDashboard } from "./metadata";
const DATASET_SLOW_TIMEOUT = 15 * 1000;

// normalizr schemas
const dashcard = new schema.Entity("dashcard");
const dashboard = new schema.Entity("dashboard", {
  ordered_cards: [dashcard],
});

export const FETCH_DASHBOARD = "metabase/dashboard/FETCH_DASHBOARD";

export const FETCH_DASHBOARD_CARD_DATA =
  "metabase/dashboard/FETCH_DASHBOARD_CARD_DATA";
export const CANCEL_FETCH_DASHBOARD_CARD_DATA =
  "metabase/dashboard/CANCEL_FETCH_DASHBOARD_CARD_DATA";

export const FETCH_CARD_DATA = "metabase/dashboard/FETCH_CARD_DATA";
export const CANCEL_FETCH_CARD_DATA =
  "metabase/dashboard/CANCEL_FETCH_CARD_DATA";

export const MARK_CARD_AS_SLOW = "metabase/dashboard/MARK_CARD_AS_SLOW";
export const CLEAR_CARD_DATA = "metabase/dashboard/CLEAR_CARD_DATA";

export const SET_SHOW_LOADING_COMPLETE_FAVICON =
  "metabase/dashboard/SET_SHOW_LOADING_COMPLETE_FAVICON";

export const SET_LOADING_DASHCARDS_COMPLETE =
  "metabase/dashboard/SET_LOADING_DASHCARDS_COMPLETE";

export const SET_DOCUMENT_TITLE = "metabase/dashboard/SET_DOCUMENT_TITLE";
const setDocumentTitle = createAction(SET_DOCUMENT_TITLE);

export const setShowLoadingCompleteFavicon = createAction(
  SET_SHOW_LOADING_COMPLETE_FAVICON,
);

// real dashcard ids are integers >= 1
function isNewDashcard(dashcard) {
  return dashcard.id < 1 && dashcard.id >= 0;
}

function isNewAdditionalSeriesCard(card, dashcard) {
  return (
    card.id !== dashcard.card_id && !dashcard.series.some(s => s.id === card.id)
  );
}

const updateLoadingTitle = createThunkAction(
  SET_DOCUMENT_TITLE,
  () => (dispatch, getState) => {
    const loadingDashCards = getLoadingDashCards(getState());
    const totalCards = loadingDashCards.dashcardIds.length;
    const loadingComplete = totalCards - loadingDashCards.loadingIds.length;
    return `${loadingComplete}/${totalCards} loaded`;
  },
);

const loadingComplete = createThunkAction(
  SET_LOADING_DASHCARDS_COMPLETE,
  () => (dispatch, getState) => {
    dispatch(setShowLoadingCompleteFavicon(true));
    if (!document.hidden) {
      dispatch(setDocumentTitle(""));
      setTimeout(() => {
        dispatch(setShowLoadingCompleteFavicon(false));
      }, 3000);
    } else {
      const dashboard = getDashboardComplete(getState());
      const message = dashboard?.is_app_age
        ? t`Your page is ready`
        : t`Your dashboard is ready`;
      dispatch(setDocumentTitle(message));
      document.addEventListener(
        "visibilitychange",
        () => {
          dispatch(setDocumentTitle(""));
          setTimeout(() => {
            dispatch(setShowLoadingCompleteFavicon(false));
          }, 3000);
        },
        { once: true },
      );
    }
  },
);

const createDefaultDashboard = () => {
  const defaultDashboard =
    '{"entities":{"dashboard":{"new":{"ordered_cards":[],"can_write":true,"name":"New Dashboard","made_public_by_id":1,"id":"new","parameters":[]}}},"result":"new","dashboardId":"new","parameterValues":{}}';
  return JSON.parse(defaultDashboard);
};

function getOptionsHash() {
  let options = {};
  if (location.hash) {
    const hash = location.hash.replace(/^#/, "");
    if (hash.charAt(0) === "?") {
      options = querystring.parse(hash.substring(1));
    } else {
      options = querystring.parse(hash);
    }
  }
  return options;
}

export const fetchDashboard = createThunkAction(
  FETCH_DASHBOARD,
  function (dashId, queryParams, preserveParameters) {
    let result;
    return async function (dispatch, getState) {
      const dashboardType = getDashboardType(dashId);

      if (dashboardType === "new") {
        return createDefaultDashboard();
      }
      const optionsHash = getOptionsHash();
      if (dashboardType === "public") {
        const secret = optionsHash && optionsHash.secret;
        const responseData = await PublicApi.dashboard({
          uuid: dashId,
          secret: secret,
        });
        if (responseData?.data) {
          result = responseData.data
          result = {
            ...(responseData.data || {}),
            entityId: result.id,
            id: dashId,
            ordered_cards: result.ordered_cards.map(dc => ({
              ...dc,
              dashboard_id: dashId,
            })),
          };
        } else {
          result = responseData
        }
      } else if (dashboardType === "embed") {
        result = await EmbedApi.dashboard({ token: dashId });
        result = {
          ...result,
          id: dashId,
          ordered_cards: result.ordered_cards.map(dc => ({
            ...dc,
            dashboard_id: dashId,
          })),
        };
      } else if (dashboardType === "transient") {
        const subPath = dashId.split("/").slice(3).join("/");
        result = await AutoApi.dashboard({ subPath });
        result = {
          ...result,
          id: dashId,
          ordered_cards: result.ordered_cards.map(dc => ({
            ...dc,
            dashboard_id: dashId,
          })),
        };
      } else if (dashboardType === "inline") {
        // HACK: this is horrible but the easiest way to get "inline" dashboards up and running
        // pass the dashboard in as dashboardId, and replace the id with [object Object] because
        // that's what it will be when cast to a string
        result = expandInlineDashboard(dashId);
        dashId = result.id = String(dashId);
      } else {
        result = await DashboardApi.get({ dashId: dashId });
      }

      if (result?.code === -1) {
        throw result?.message
      }

      if (dashboardType === "normal" || dashboardType === "transient") {
        await dispatch(loadMetadataForDashboard(result.ordered_cards));
      }

      // copy over any virtual cards from the dashcard to the underlying card/question
      result?.ordered_cards?.forEach(card => {
        if (card.visualization_settings.virtual_card) {
          card.card = Object.assign(
            card.card || {},
            card.visualization_settings.virtual_card,
          );
        }
      });

      if (result.param_values) {
        dispatch(addParamValues(result.param_values));
      }
      if (result.param_fields) {
        dispatch(addFields(result.param_fields));
      }

      const metadata = getMetadata(getState());
      const parameters = getDashboardUiParameters(result, metadata);

      const parameterValuesById = preserveParameters
        ? getParameterValues(getState())
        : getParameterValuesByIdFromQueryParams(
            parameters,
            queryParams,
            metadata,
            {
              forcefullyUnsetDefaultedParametersWithEmptyStringValue: true,
            },
          );

      return {
        ...normalize(result, dashboard), // includes `result` and `entities`
        dashboardId: dashId,
        parameterValues: parameterValuesById,
        templateId: result.templateId,
      };
    };
  },
);

export const fetchCardData = createThunkAction(
  FETCH_CARD_DATA,
  function (card, dashcard, { reload, clear, ignoreCache } = {}) {
    return async function (dispatch, getState) {
      // If the dataset_query was filtered then we don't have permisison to view this card, so
      // shortcircuit and return a fake 403
      if (!card.dataset_query) {
        return {
          dashcard_id: dashcard.id,
          card_id: card.id,
          result: { error: { status: 403 } },
        };
      }

      const dashboardType = getDashboardType(dashcard.dashboard_id);

      const { dashboardId, dashboards, parameterValues, dashcardData } =
        getState().dashboard;
      const dashboard = dashboards[dashboardId];

      // if we have a parameter, apply it to the card query before we execute
      const datasetQuery = applyParameters(
        card,
        dashboard.parameters,
        parameterValues,
        dashcard && dashcard.parameter_mappings,
      );

      if (!reload) {
        // if reload not set, check to see if the last result has the same query dict and return that
        const lastResult = getIn(dashcardData, [dashcard.id, card.id]);
        if (
          lastResult &&
          Utils.equals(
            getDatasetQueryParams(lastResult.json_query),
            getDatasetQueryParams(datasetQuery),
          )
        ) {
          return {
            dashcard_id: dashcard.id,
            card_id: card.id,
            result: lastResult,
          };
        }
      }

      cancelFetchCardData(card.id, dashcard.id);

      if (clear) {
        // clears the card data to indicate the card is reloading
        dispatch(clearCardData(card.id, dashcard.id));
      }

      let result = null;

      // start a timer that will show the expected card duration if the query takes too long
      const slowCardTimer = setTimeout(() => {
        if (result === null) {
          dispatch(markCardAsSlow(card, datasetQuery));
        }
      }, DATASET_SLOW_TIMEOUT);

      const deferred = defer();
      setFetchCardDataCancel(card.id, dashcard.id, deferred);

      let cancelled = false;
      deferred.promise.then(() => {
        cancelled = true;
      });

      const queryOptions = {
        cancelled: deferred.promise,
      };

      const dashboard_id =
        dashcard.dashboard_id === "new" ? null : dashcard.dashboard_id;

      // make the actual request
      if (datasetQuery.type === "endpoint") {
        result = await fetchDataOrError(
          MetabaseApi.datasetEndpoint(
            {
              endpoint: datasetQuery.endpoint,
              parameters: datasetQuery.parameters,
            },
            queryOptions,
          ),
        );
      } else if (dashboardType === "public") {
        const isDataApiStatPage = location.pathname === "/data-api/statistics";
        result = await fetchDataOrError(
          maybeUsePivotEndpoint(
            isDataApiStatPage ? PublicApi.dashboardCardQueryDataApiStat : PublicApi.dashboardCardQuery, card)(
            {
              uuid: dashboard_id,
              dashcardId: dashcard.id,
              cardId: card.id,
              parameters: datasetQuery.parameters
                ? JSON.stringify(datasetQuery.parameters)
                : undefined,
              ignore_cache: ignoreCache,
            },
            queryOptions,
          ),
        );
      } else if (dashboardType === "embed") {
        result = await fetchDataOrError(
          maybeUsePivotEndpoint(EmbedApi.dashboardCardQuery, card)(
            {
              token: dashboard_id,
              dashcardId: dashcard.id,
              cardId: card.id,
              ...getParameterValuesBySlug(
                dashboard.parameters,
                parameterValues,
              ),
              ignore_cache: ignoreCache,
            },
            queryOptions,
          ),
        );
      } else if (dashboardType === "transient" || dashboardType === "inline") {
        result = await fetchDataOrError(
          maybeUsePivotEndpoint(MetabaseApi.dataset, card)(
            { ...datasetQuery, ignore_cache: ignoreCache },
            queryOptions,
          ),
        );
      } else {
        // new dashcards and new additional series cards aren't yet saved to the dashboard, so they need to be run using the card query endpoint
        const endpoint =
          isNewDashcard(dashcard) || isNewAdditionalSeriesCard(card, dashcard)
            ? CardApi.query
            : DashboardApi.cardQuery;

        result = await fetchDataOrError(
          maybeUsePivotEndpoint(endpoint, card)(
            {
              dashboardId: dashboard_id,
              dashcardId: dashcard.id,
              cardId: card.id,
              parameters: datasetQuery.parameters,
              ignore_cache: ignoreCache,
              dashboard_id: dashboard_id,
            },
            queryOptions,
          ),
        );
      }

      setFetchCardDataCancel(card.id, dashcard.id, null);
      clearTimeout(slowCardTimer);

      return {
        dashcard_id: dashcard.id,
        card_id: card.id,
        result: cancelled ? null : result,
      };
    };
  },
);

function calculateConcurrency(length) {
  let concurrency = 6;
  const step = 20;

  if (length > step) {
    const decrement = Math.floor(length / step) * 2;
    concurrency = Math.max(1, concurrency - decrement);
  }

  return concurrency;
}

export const fetchDashboardCardData = createThunkAction(
  FETCH_DASHBOARD_CARD_DATA,
  options => (dispatch, getState) => {
    const dashboard = getDashboardComplete(getState());
    const tasks = getAllDashboardCards(dashboard)
      .map(({ card, dashcard }) => {
        if (!isVirtualDashCard(dashcard)) {
          return { card, dashcard }
        }
      })
      .filter(p => !!p)
      .filter(p => !options.cardIds || options.cardIds?.includes(p.card?.id));
    // Optimized requests, concurrent 6, and reduce the concurrency by 2 for every 20 charts, finally to 1
    if (tasks.length) {
      dispatch(setDocumentTitle(t`0/${tasks.length} loaded`));
      const concurrency = calculateConcurrency(tasks.length);
      const limit = promiseLimit(concurrency);
      Promise.all(
        tasks.map(({ card, dashcard }, inx) => {
          return limit(() => doPromise(card, dashcard, inx))
        })
      ).then(() => {
        dispatch(loadingComplete());
      })
    }
    function doPromise (card, dashcard, inx) {
      return new Promise(function (resolve) {
        dispatch(fetchCardData(card, dashcard, options)).then(() => {
          resolve(inx)
          dispatch(updateLoadingTitle());
        });
      })
    }

  },
);
export const GET_DASHBOARD_PARAMETERS =
  "metabase/dashboard/GET_DASHBOARD_PARAMETERS";
export const getDashboardParameters = createThunkAction(
  GET_DASHBOARD_PARAMETERS,
  function(card, dashcard) {
    return async function(dispatch, getState) {
      // If the dataset_query was filtered then we don't have permisison to view this card, so
      // shortcircuit and return a fake 403
      if (!card.dataset_query) {
        return {
          dashcard_id: dashcard.id,
          card_id: card.id,
          result: { error: { status: 403 } },
        };
      }

      const { dashboardId, dashboards, parameterValues } = getState().dashboard;
      const dashboard = dashboards[dashboardId];

      // if we have a parameter, apply it to the card query before we execute
      const datasetQuery = applyParameters(
        card,
        dashboard.parameters,
        parameterValues,
        dashcard && dashcard.parameter_mappings,
      );

      return {
        dashcard_id: dashcard.id,
        card_id: card.id,
        parameters: datasetQuery.parameters,
      };
    };
  },
);

export const reloadDashboardCards = () => async (dispatch, getState) => {
  const dashboard = getDashboardComplete(getState());

  const reloads = getAllDashboardCards(dashboard)
    .filter(({ dashcard }) => !isVirtualDashCard(dashcard))
    .map(({ card, dashcard }) =>
      dispatch(
        fetchCardData(card, dashcard, { reload: true, ignoreCache: true }),
      ),
    );

  await Promise.all(reloads);
};

export const cancelFetchDashboardCardData = createThunkAction(
  CANCEL_FETCH_DASHBOARD_CARD_DATA,
  () => (dispatch, getState) => {
    const dashboard = getDashboardComplete(getState());
    for (const { card, dashcard } of getAllDashboardCards(dashboard)) {
      dispatch(cancelFetchCardData(card.id, dashcard.id));
    }
  },
);

const cardDataCancelDeferreds = {};

function setFetchCardDataCancel(card_id, dashcard_id, deferred) {
  cardDataCancelDeferreds[`${dashcard_id},${card_id}`] = deferred;
}
export const FETCH_DYNAMIC_PARAMS = "metabase/dashboard/FETCH_DYNAMIC_PARAMS";
export const fetchDynamicParams = createThunkAction(
  FETCH_DYNAMIC_PARAMS,
  function(dashboard) {
    return async function(dispatch, getState) {
      const { parameterValues } = getState().dashboard;
      if (!dashboard) {
        return {};
      }
      const { templateId, parameters } = dashboard;
      if (!templateId) {
        return {};
      }
      for (const parameter of parameters || []) {
        parameter.value = parameterValues[parameter.id];
      }
      const dynamicParams = await dynamicParamsApi(templateId, { parameters });
      return {
        ...dynamicParams,
      };
    };
  },
);

// machinery to support query cancellation
export const cancelFetchCardData = createAction(
  CANCEL_FETCH_CARD_DATA,
  (card_id, dashcard_id) => {
    const deferred = cardDataCancelDeferreds[`${dashcard_id},${card_id}`];
    if (deferred) {
      deferred.resolve();
      cardDataCancelDeferreds[`${dashcard_id},${card_id}`] = null;
    }
    return { dashcard_id, card_id };
  },
);

export const clearCardData = createAction(
  CLEAR_CARD_DATA,
  (cardId, dashcardId) => ({ cardId, dashcardId }),
);

export const markCardAsSlow = createAction(MARK_CARD_AS_SLOW, card => ({
  id: card.id,
  result: true,
}));

export const CREATE_DASHBOARD_SECRET =
  "metabase/dashboard/CREATE_DASHBOARD_SECRET";
export const createDashboardSecret = createAction(
  CREATE_DASHBOARD_SECRET,
  async ({ id }) => {
    const { data } = await DashboardApi.secret({ id });
    return data;
  },
);
