const chunk = require("lodash/chunk");
const kebabCase = require("lodash/kebabCase");
const getSlug = require("speakingurl");

const renderType = type => (type === "dashboard" ? "dashboard" : "chart");

const articleType = type => {
  const array = {
    article: "article",
    dailyNews: "daily-news",
    realTimeInfo: "flash",
  };
  return array[type] || "article";
};

const divisionKey = "fp";

exports.guestUrl = (detail) => {
  return `guest/${dashboardQuestionUrl({ ...detail, id: detail.publicUuid })}`;
}

exports.publicUrl = (detail) => {
  return `public/${dashboardQuestionUrl({ ...detail, id: detail.publicUuid })}`;
}

const dashboardQuestionUrl = ({ type, name, id }) => {
  const rType = renderType(type);
  const title = kebabCase(name);
  return `${rType}/${[title, divisionKey, id].join("-")}`;
}

function speakingUrl(text) {
  if (!text) return text;
  return getSlug(text);
}

exports.articleDetailUrl = ({ type, title, mediaInfoId, shortMediaInfoId }) => {
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
