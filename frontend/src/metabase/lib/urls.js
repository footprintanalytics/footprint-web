import slugg from "slugg";
import { serializeCardForUrl } from "metabase/lib/card";
import { SAVED_QUESTIONS_VIRTUAL_DB_ID } from "metabase/lib/constants";
import MetabaseSettings from "metabase/lib/settings";
import Question from "metabase-lib/lib/Question";
import { optionsToHashParams } from "metabase/public/lib/embed";
import chunk from "lodash/chunk";
import querystring from "querystring";
import { getProject, isDefi360 } from "metabase/lib/project_info";
import { get } from "lodash";

function appendSlug(path, slug) {
  return slug ? `${path}-${slug}` : path;
}

function fpKebabCase(text) {
  if (!text) {
    return text;
  }
  return encodeURIComponent(text.trim().replaceAll(/[-_\s]+/g, "-"));
}

// provides functions for building urls to things we care about

export const activity = "/activity";

export const exportFormats = ["csv", "xlsx", "json"];

export const newQuestionFlow = () => "/question/new";

export const newDashboard = collectionId =>
  `collection/${collectionId}/new_dashboard`;

export const newPulse = () => `/pulse/create`;

export const newCollection = collectionId =>
  `collection/${collectionId}/new_collection`;

export function question(card, hash = "", query = "") {
  const defaultPath = isDefi360() ? "/defi360/chart" : "/chart";
  if (hash && typeof hash === "object") {
    hash = serializeCardForUrl(hash);
  }
  if (query && typeof query === "object") {
    query = extractQueryParams(query)
      .map(kv => kv.map(encodeURIComponent).join("="))
      .join("&");
  }
  if (hash && hash.charAt(0) !== "#") {
    hash = "#" + hash;
  }
  if (query && query.charAt(0) !== "?") {
    query = "?" + query;
  }
  if (!card || !card.id) {
    return `${defaultPath}${query}${hash}`;
  }
  if (!card.name) {
    return `${defaultPath}/${card.id}${query}${hash}`;
  }
  const path = dashboardQuestionUrl({
    type: "question",
    name: card.name,
    id: card.id,
  });
  return `${path}${query}${hash}`;
}

export function serializedQuestion(card) {
  return question(null, card);
}

export const extractQueryParams = (query: Object): Array => {
  return [].concat(...Object.entries(query).map(flattenParam));
};

const flattenParam = ([key, value]) => {
  if (value instanceof Array) {
    return value.map(p => [key, p]);
  }

  return [[key, value]];
};

export function newQuestion({ mode, ...options } = {}) {
  const url = Question.create(options).getUrl();
  if (mode) {
    return url.replace(/^\/chart/, `/chart\/${mode}`);
  } else {
    return url;
  }
}

export function dashboard(dashboard, { addCardWithId } = {}) {
  const userName = get(dashboard, "creator.name");
  const dashboardName =
    get(dashboard, "uniqueName") || get(dashboard, "unique_name");
  let path = "";
  if (isDefi360() || !userName || !dashboardName) {
    path = dashboardQuestionUrl({
      type: "dashboard",
      name: dashboard.name,
      id: dashboard.id,
    });
  } else {
    path = dashboardUrl(dashboard);
  }
  return addCardWithId != null
    ? // NOTE: no-color-literals rule thinks #add is a color, oops
      // eslint-disable-next-line no-color-literals
      `/${path}#add=${addCardWithId}`
    : `/${path}`;
}

function prepareModel(item) {
  if (item.model_object) {
    return item.model_object;
  }
  return {
    id: item.model_id,
    ...item.details,
  };
}

export function modelToUrl(item) {
  const modelData = prepareModel(item);

  switch (item.model) {
    case "card":
      return question(modelData);
    case "dashboard":
      return dashboard(modelData);
    case "pulse":
      return pulse(modelData.id);
    case "table":
      return tableRowsQuery(modelData.db_id, modelData.id);
    default:
      return null;
  }
}

export function pulse(pulseId) {
  return `/pulse/${pulseId}`;
}

export function pulseEdit(pulseId) {
  return `/pulse/${pulseId}`;
}

export function tableRowsQuery(databaseId, tableId, metricId, segmentId) {
  let query = `?db=${databaseId}&table=${tableId}`;

  if (metricId) {
    query += `&metric=${metricId}`;
  }

  if (segmentId) {
    query += `&segment=${segmentId}`;
  }

  return question(null, query);
}

function slugifyPersonalCollection(collection) {
  // Current user's personal collection name is replaced with "Your personal collection"
  // `originalName` keeps the original name like "John Doe's Personal Collection"
  const name = collection.originalName || collection.name;

  // Will keep single quote characters,
  // so "John's" can be converted to `john-s` instead of `johns`
  let slug = slugg(name, {
    toStrip: /["”“]/g,
  });

  // If can't build a slug out of user's name (e.g. if it contains only emojis)
  // removes the "s-" part of a slug
  if (slug === "s-personal-collection") {
    slug = slug.replace("s-", "");
  }

  return slug;
}

export function collection(collection) {
  const isSystemCollection =
    !collection || collection.id === null || typeof collection.id === "string";

  if (isSystemCollection) {
    const id = collection && collection.id ? collection.id : "root";
    return `/collection/${id}`;
  }

  const isPersonalCollection = typeof collection.personal_owner_id === "number";
  const slug = isPersonalCollection
    ? slugifyPersonalCollection(collection)
    : slugg(collection.name);

  return appendSlug(`/collection/${collection.id}`, slug);
}

export function isCollectionPath(path) {
  return /collection\/.*/.test(path);
}

export function label(label) {
  return `/questions/search?label=${encodeURIComponent(label.slug)}`;
}

export function formatName(name) {
  return fpKebabCase(name);
}

export function dashboardUrl({ creator, uniqueName, unique_name }) {
  const userName = get(creator, "name");
  const dashboardName = uniqueName || unique_name;
  return `@${userName}/${dashboardName}`;
}

export function publicQuestion({ uuid, name, search = "", options = null }) {
  const siteUrl = MetabaseSettings.get("site-url");
  return `${siteUrl}/${publicUrl({
    publicUuid: uuid,
    name,
    type: "question",
  })}${search}${optionsToHashParams(options)}`;
}

export function guestQuestion({ uuid, name, search = "", options = null }) {
  const siteUrl = `${MetabaseSettings.get("site-url")}${
    isDefi360(getProject()) ? "/defi360" : ""
  }`;
  return `${siteUrl}/${guestUrl({
    publicUuid: uuid,
    name,
    type: "question",
  })}${search}${optionsToHashParams(options)}`;
}

export function generalQuestion({ id, name, search = "", options = null }) {
  const questionUrl = dashboardQuestionUrl({ id, name, type: "question" });
  const siteUrl = `${MetabaseSettings.get("site-url")}${
    isDefi360(getProject()) && !questionUrl.includes("defi360")
      ? "/defi360"
      : ""
  }`;
  return `${siteUrl}/${questionUrl}${search}${optionsToHashParams(options)}`;
}

export function publicDashboard({ uuid, name, search = "", options = null }) {
  const siteUrl = MetabaseSettings.get("site-url");

  return `${siteUrl}/${publicUrl({
    publicUuid: uuid,
    name,
    type: "dashboard",
  })}${search}${optionsToHashParams(options)}`;
}

export function guestDashboard({
  uuid,
  name,
  search = "",
  options = null,
  uniqueName,
  creator,
}) {
  const siteUrl = `${MetabaseSettings.get("site-url")}${
    isDefi360(getProject()) ? "/defi360" : ""
  }`;
  if (isDefi360()) {
    return `${siteUrl}/${guestUrl({
      publicUuid: uuid,
      name,
      type: "dashboard",
    })}${search}${optionsToHashParams(options)}`;
  }
  return `${siteUrl}/${dashboardUrl({
    creator,
    uniqueName,
  })}${search}${optionsToHashParams(options)}`;
}

export function embedCard(token, type = null) {
  const siteUrl = MetabaseSettings.get("site-url");
  return `${siteUrl}/embed/question/${token}` + (type ? `.${type}` : ``);
}

export function embedDashboard(token) {
  const siteUrl = MetabaseSettings.get("site-url");
  return `${siteUrl}/embed/dashboard/${token}`;
}

export function myProfileUrl(userName) {
  return `/@${userName}`;
}

export function accountSettings() {
  return `/account/profile`;
}

export function newUser() {
  return `/admin/people/new`;
}

export function editUser(userId) {
  return `/admin/people/${userId}/edit`;
}

export function resetPassword(userId) {
  return `/admin/people/${userId}/reset`;
}

export function newUserSuccess(userId) {
  return `/admin/people/${userId}/success`;
}

export function deactivateUser(userId) {
  return `/admin/people/${userId}/deactivate`;
}

export function reactivateUser(userId) {
  return `/admin/people/${userId}/reactivate`;
}

export function browseDatabase(database) {
  const name =
    database.id === SAVED_QUESTIONS_VIRTUAL_DB_ID
      ? "Saved Queries"
      : database.name;

  return appendSlug(`/browse/${database.id}`, slugg(name));
}

export function questionWithDatabase(database) {
  return `/question?dbId=${database.id}`;
}

export function browseSchema(table) {
  return `/browse/${table.db.id}/schema/${table.schema_name}`;
}

export function browseTable(table) {
  return `/browse/${table.db.id}/schema/${table.schema_name}`;
}

export function extractEntityId(slug) {
  if (slug === "new") {
    return slug;
  }
  const idStr = parseTitleId(slug).id;
  const id = parseInt(idStr, 10);
  return Number.isSafeInteger(id) ? id : undefined;
}

export function extractCollectionId(slug) {
  if (slug === "root" || slug === "users") {
    return slug;
  }
  return extractEntityId(slug);
}

const renderType = type => (type === "dashboard" ? "dashboard" : "chart");

const articleType = type => {
  const array = {
    article: "article",
    dailyNews: "daily-news",
    daily: "daily-news",
    realTimeInfo: "flash",
  };
  return array[type];
};

const divisionKey = "fp";

export function guestUrl(detail) {
  if (detail.cardId) {
    return `${dashboardQuestionUrl({
      ...detail,
      id: detail.cardId,
    })}`;
  }
  if (detail.publicUuid) {
    return `guest/${dashboardQuestionUrl({
      ...detail,
      id: detail.publicUuid,
    })}`;
  }
}

export function publicUrl(detail) {
  return `public/${dashboardQuestionUrl({
    ...detail,
    id: detail.publicUuid,
    checkDefi360: false,
  })}`;
}

export function publicSceneUrl(detail) {
  return `public/scene/${dashboardQuestionUrl({
    ...detail,
    id: detail.publicUuid,
  })}`;
}

export function dashboardQuestionUrl({ type, name, id, checkDefi360 = true }) {
  const rType = renderType(type);
  const title = fpKebabCase(name);
  const projectPath = isDefi360() && checkDefi360 ? `defi360/` : "";
  return `${projectPath}${rType}/${[title, divisionKey, id].join("-")}`;
}

export function articleDetailUrl({ type, title, mediaInfoId }) {
  if (!mediaInfoId) {
    return "";
  }
  const rType = articleType(type);
  const id = chunk(mediaInfoId.split(""), 8)
    .map(array => array.join(""))
    .join("-");
  const rTitle = fpKebabCase(title);
  return `${rType}/${[rTitle, divisionKey, id].join("-")}`;
}

export function creatorUrl({ user_name }) {
  return `/@${user_name}`;
}

export function protocolsDetailUrl({ title, protocolId }) {
  if (!protocolId) {
    return "";
  }
  const rTitle = fpKebabCase(title);
  return `protocols/${[rTitle, divisionKey, protocolId].join("-")}`;
}

export const parseTitleId = (titleAndId, type = "") => {
  if (!titleAndId) {
    return {};
  }
  if (!titleAndId.includes(divisionKey)) {
    return defaultTitleIdResult(titleAndId);
  }
  if (type === "news") {
    return parseTitleIdFromArticle(titleAndId);
  }
  return parseTitleIdFromDashboard(titleAndId);
};

const parseTitleIdFromDashboard = titleAndId => {
  const wordArray = titleAndId.split("-");
  const division = wordArray.lastIndexOf(divisionKey);
  const id = wordArray.slice(division + 1, wordArray.length).join("-");
  const title = wordArray.slice(0, division).join("-");
  return { title, id };
};

const parseTitleIdFromArticle = titleAndId => {
  const wordArray = titleAndId.split("-");
  const division = wordArray.lastIndexOf(divisionKey);
  const id = wordArray.slice(division + 1, wordArray.length).join("");
  const title = wordArray.slice(0, division).join("-");
  return { title, id };
};

const defaultTitleIdResult = titleAndId => {
  return {
    title: "",
    id: titleAndId,
  };
};

export const searchAddChannel = (search, channel) => {
  return searchAddParam(search, "channel", channel);
};

export const searchAddParam = (search, key, value) => {
  if (!key || !value) {
    return search;
  }
  if (!search) {
    return `?${key}=${value}`;
  }
  const params = querystring.parse(search.replace("?", ""));
  params[key] = value;
  return `?${querystring.stringify(params)}`;
};

export const urlAddChannel = (url, channel) => {
  if (channel === "homepage") {
    return url;
  }
  return urlAddParam(url, "channel", channel);
};

export const urlAddParam = (url, key, value) => {
  if (value !== undefined) {
    value = encodeURI(value);
  }
  let hashIndex = url.indexOf("#") | 0;
  if (hashIndex === -1) {
    hashIndex = url.length | 0;
  }
  const urls = url.substring(0, hashIndex).split("?");
  const baseUrl = urls[0];
  let parameters = "";
  const outPara = {};
  if (urls.length > 1) {
    parameters = urls[1];
  }
  if (parameters !== "") {
    parameters = parameters.split("&");
    for (const k in parameters) {
      let keyVal = parameters[k];
      keyVal = keyVal.split("=");
      const eKey = keyVal[0];
      let eValue = "";
      if (keyVal.length > 1) {
        eValue = keyVal[1];
      }
      outPara[eKey] = eValue;
    }
  }

  if (value !== undefined) {
    outPara[key] = value;
  } else {
    delete outPara[key];
  }
  parameters = [];
  for (const k in outPara) {
    parameters.push(k + "=" + outPara[k]);
  }

  let finalUrl = baseUrl;

  if (parameters.length > 0) {
    finalUrl += "?" + parameters.join("&");
  }

  return finalUrl + url.substring(hashIndex);
};

export const isPublicPath = () => {
  if (!window) {
    return false;
  }
  return window.location.pathname.startsWith("/public");
};

export const isPublicScenePath = () => {
  if (!window) {
    return false;
  }
  return window.location.pathname.startsWith("/public/scene");
};

export const isActivatePath = () => {
  if (!window) {
    return false;
  }
  return window.location.pathname.startsWith("/activate");
};
