import querystring from "querystring";
import getSlug from "speakingurl";
import chunk from "lodash/chunk";
import { isDefi360 } from "metabase/lib/project_info";

export function appendSlug(path, slug) {
  return slug ? `${path}-${slug}` : String(path);
}

function fpKebabCase(text) {
  if (!text) {
    return text;
  }
  return encodeURIComponent(text.trim().replaceAll(/[-_\s]+/g, "-"));
}

function speakingUrl(text) {
  if (!text) return text;
  return getSlug(text);
}

export function extractEntityId(slug = "") {
  //新增new dashboard的判断
  if (slug === "new") {
    return slug;
  }
  const idStr = parseTitleId(slug).id;
  const id = parseInt(idStr, 10);
  return Number.isSafeInteger(id) ? id : undefined;
}

//从path里的title和id字符串解析出id返回
export const parseTitleId = (titleAndId, type = "") => {
  if (!titleAndId) {
    return {};
  }
  if (type === "news") {
    return parseTitleIdFromArticle(titleAndId);
  }
  if (!titleAndId.includes(divisionKey)) {
    return defaultTitleIdResult(titleAndId);
  }
  return parseTitleIdFromDashboard(titleAndId);
};


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
  return array[type] || "article";
};

const divisionKey = "fp";

export function guestUrl(detail) {
  const id = detail.cardId || detail.id;
  if (id) {
    return `${dashboardQuestionUrl({
      ...detail,
      id: id,
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

export function articleDetailUrl({
                                   type,
                                   title,
                                   mediaInfoId,
                                   shortMediaInfoId,
                                 }) {
  const mediaId = shortMediaInfoId || mediaInfoId;
  if (!mediaId) {
    return "";
  }
  const rType = articleType(type);
  const id = chunk(mediaId.split(""), 8)
    .map(array => array.join(""))
    .join("-");
  const rTitle = speakingUrl(title);
  return `${rType}/${[rTitle, shortMediaInfoId ? null : divisionKey, id]
    .filter(i => i)
    .join("-")}`;
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

export const parseObjectByMediaId = mediaInfoId => {
  if (!mediaInfoId) {
    return {};
  }
  let params;
  if (mediaInfoId.length === 8) {
    params = {
      shortMediaInfoId: mediaInfoId,
    };
  } else {
    params = {
      mediaInfoId: mediaInfoId,
    };
  }
  return params;
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
  let division = wordArray.lastIndexOf(divisionKey);
  if (division < 0) {
    division = wordArray.length - 2;
  }
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

//[key, value]: [string, any]
function flattenParam([key, value]) {
  if (value instanceof Array) {
    return value.map(p => [key, p]);
  }
  return [[key, value]];
}

//query: Array<string, any>
export function extractQueryParams(query) {
  return Object.entries(query).map(flattenParam).flat();
}

export function myProfileUrl(userName) {
  return `/@${userName}`;
}

export function formatName(name) {
  return fpKebabCase(name);
}
