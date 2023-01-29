/* eslint-disable curly */
/* eslint-disable import/no-commonjs */
const { createWriteStream } = require("fs");
const { SitemapStream } = require("sitemap");
const dayjs = require("dayjs");
const axios = require("axios");
const kebabCase = require("lodash/kebabCase");
const {
  getContentFirstImg,
} = require("../../frontend/src/metabase/containers/news/util/image");
const { articleDetailUrl } = require("./utils/helper");

const hostname = "https://www.footprint.network";
const lastmod = dayjs().format("YYYY-MM-DD HH:mm:ss");
const sitemap = new SitemapStream({ hostname });
const writeStream = createWriteStream(
  "./resources/frontend_client/sitemap-article.xml",
);

const formatName = name => {
  return kebabCase(name);
};

const getMediaList = async type => {
  const res = await axios.post(`${hostname}/api/v1/media/list`, {
    pageSize: 8000,
    current: 1,
    type: type,
    sortBy: "publishTime",
    sortDirection: "desc",
  });
  return {
    list: res.data.data.data,
  };
};

const getArticleImg = data => {
  if (!data) {
    return "";
  }
  const url = data.thumbnail || getContentFirstImg(data.html);
  return `${url}?image_process=resize,w_920/crop,h_480/format,jpg`;
};

const newsItemToSitemap = (list, sitemap) => {
  list.forEach(item => {
    const img = [
      {
        url: getArticleImg(item),
        caption: formatName(item.title).trim(),
        title: formatName(item.title).trim(),
      },
    ];
    const url = `/${articleDetailUrl(item)}`;
    sitemap.write({ url, lastmod, img });
    log(url);
  });
};

const log = msg => {
  // const _msg = msg.includes("https://") ? msg : hostname + msg;
  // console.log(_msg);
};

const run = async () => {
  let total = 0;

  console.log(`sitemap-article.xml...`);
  sitemap.pipe(writeStream);

  // article
  const articles = await getMediaList();
  const articlesList = articles.list.filter(article => article.type !== "realTimeInfo");
  newsItemToSitemap(articlesList, sitemap);
  total += articlesList.length;

  sitemap.end();
  console.log(`sitemap-article.xml ${total}`);
};

run();
