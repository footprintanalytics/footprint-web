const chunk = require("lodash/chunk");
const kebabCase = require("lodash/kebabCase");

const renderType = type => (type === "dashboard" ? "dashboard" : "chart");

const articleType = type => {
  const array = {
    article: "article",
    dailyNews: "daily-news",
    realTimeInfo: "flash",
  };
  return array[type];
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

exports.articleDetailUrl = ({ type, title, mediaInfoId }) => {
  const rType = articleType(type);
  const id = chunk(mediaInfoId.split(""), 8)
    .map(array => array.join(""))
    .join("-");
  const rTitle = kebabCase(title);
  return `${rType}/${[rTitle, divisionKey, id].join("-")}`;
}
