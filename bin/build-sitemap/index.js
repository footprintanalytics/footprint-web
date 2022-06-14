/* eslint-disable curly */
/* eslint-disable import/no-commonjs */
const { createWriteStream } = require("fs");
const { SitemapStream } = require("sitemap");
const dayjs = require("dayjs");
const axios = require("axios");
const kebabCase = require("lodash/kebabCase");
const page = require("./page.json");
const {
  getContentFirstImg,
} = require("../../frontend/src/metabase/containers/news/util/image");
const { articleDetailUrl, guestUrl } = require("./utils/helper");

const hostname = "https://www.footprint.network";
const lastmod = dayjs().format("YYYY-MM-DD HH:mm:ss");
const sitemap = new SitemapStream({ hostname });
const writeStream = createWriteStream(
  "./resources/frontend_client/sitemap.xml",
);
const cache = {};

const formatName = name => {
  return kebabCase(name);
};

const getTopicList = async () => {
  const res = await axios.get(`${hostname}/api/v1/home/menu`);

  return {
    list: res.data.data.list.filter(item => item.subMenus.length),
  };
};

const getProjectList = async () => {
  const res = await axios.get(`${hostname}/api/v1/landing/project/list`);

  return {
    list: res.data.data.data,
  };
};

const getChainList = async () => {
  const res = await axios.get(`${hostname}/api/v1/landing/chain/list`);

  return {
    list: res.data.data.data,
  };
};

const getExploreList = async () => {
  const res = await axios.post(`${hostname}/api/v1/exploreByTags`, {
    pageSize: 5000,
    current: 1,
    category: "exploreAll",
  });

  return {
    list: res.data.data.data,
  };
};

const getMediaList = async type => {
  const res = await axios.post(`${hostname}/api/v1/media/list`, {
    pageSize: 5000,
    current: 1,
    type: type,
  });
  return {
    list: res.data.data.data,
  };
};

const getImg = (id, type) => {
  return `https://static.footprint.network/${type}/${id}.png?image_process=resize,w_920/crop,h_480/format,jpg`;
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

  console.log(`sitemap.xml...`);
  sitemap.pipe(writeStream);

  page.list.forEach(item => {
    sitemap.write({ url: item, lastmod });
    log(item);
  });
  total += page.list.length;

  // const topic = await getTopicList();
  // let topicLen = 0;
  // topic.list.forEach(item => {
  //   if (item.subMenus) {
  //     topicLen += item.subMenus.length;
  //     item.subMenus.forEach(subMenu => {
  //       const url = `/topic/${item.value}/${subMenu.value}`;
  //       sitemap.write({ url, lastmod });
  //       log(url);
  //     });
  //   }
  // });
  // total += topicLen;

  // const project = await getProjectList();
  // project.list.forEach(item => {
  //   const dashboard = item.dashboardList[0];
  //   const url = `/project/Detail/${item.landingId}/${formatName(item.name)}`;
  //   if (dashboard) {
  //     sitemap.write({
  //       url,
  //       lastmod,
  //       img: [
  //         {
  //           url: getImg(dashboard.id, dashboard.type),
  //           caption: dashboard.name.trim(),
  //           title: dashboard.name.trim(),
  //         },
  //       ],
  //     });
  //   }
  //   log(url);
  // });
  // total += project.list.length;

  // const chain = await getChainList();
  // chain.list.forEach(item => {
  //   const dashboard = item.dashboardList[0];
  //   const url = `/chain/Detail/${item.landingId}/${formatName(item.name)}`;
  //   if (dashboard) {
  //     sitemap.write({
  //       url,
  //       lastmod,
  //       img: [
  //         {
  //           url: getImg(dashboard.id, dashboard.type),
  //           caption: dashboard.name.trim(),
  //           title: dashboard.name.trim(),
  //         },
  //       ],
  //     });
  //   }
  //   log(url);
  // });
  // total += chain.list.length;

  // dashboard & question
  // const explore = await getExploreList();
  // explore.list.forEach(item => {
  //   const title = item.name.trim();
  //   if (cache[title]) return;
  //   cache[title] = true;
  //   const img = [{ url: getImg(item.id, item.type), caption: title, title }];
  //   const guestUrlStr = `/${guestUrl(item)}`;
  //   sitemap.write({ url: guestUrlStr, lastmod, img });
  //   log(guestUrlStr);
  //   total += 1;
  // });

  // article
  // const articles = await getMediaList("article");
  // newsItemToSitemap(articles.list, sitemap);
  // total += articles.list.length;

  // realTimeInfo
  // const realTimeInfos = await getMediaList("realTimeInfo");
  // newsItemToSitemap(realTimeInfos.list, sitemap);
  // total += realTimeInfos.list.length;

  // dailyNews
  // const dailyNews = await getMediaList("dailyNews");
  // newsItemToSitemap(dailyNews.list, sitemap);
  // total += dailyNews.list.length;

  sitemap.end();
  console.log(`sitemap.xml ${total}`);
};

run();
