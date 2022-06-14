/* eslint-disable import/no-commonjs */
const dayjs = require("dayjs");
const RSS = require("rss");
const { articleDetailUrl } = require("../build-sitemap/utils/helper");
const axios = require("axios");
const fs = require("fs");

const lastMod = dayjs().format("YYYY-MM-DD");
const author = "Footprint Analytics";
const fpWebsite = "https://www.footprint.network";
const categories = ["Featured", "Articles"];
const email = "market@footprint.network";
const copyright = "2021 Footprint Analytics";
const pageTitle = "Footprint Analytics";
const pageDesc =
  "Explore Cross-Chain Web3.0 Data about NFTs, GameFi, Metaverse and DeFi(Decentralized Finance) DApps here. A platform for discovering and visualizing blockchain data without coding.";
const logo = "https://static.footprint.network/img_nav_logo.png";
const language = "en-us";

const hostname = "https://www.footprint.network";

//https://github.com/dylang/node-rss

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

const outputToFile = (fileName, xml) => {
  fs.writeFile(fileName, xml, err => {
    console.log("outputToFile", err);
    if (err) {
      throw err;
    }
  });
};

const runMedia = async ({ type, feedUrl, siteUrl, outputName }) => {
  const feedOptions = {
    title: pageTitle,
    description: pageDesc,
    feed_url: feedUrl,
    site_url: siteUrl,
    image_url: logo,
    managingEditor: email,
    webMaster: email,
    copyright: copyright,
    language: language,
    categories: categories,
    pubDate: lastMod,
    lastBuildDate: lastMod,
    comments: fpWebsite,
  };
  const feed = new RSS(feedOptions);

  const medias = await getMediaList(type);
  medias.list.forEach(item => {
    const url = item.url || `${hostname}/${articleDetailUrl(item)}`;
    const date = new Date(item.publishTime);
    const dateStr = dayjs()
      .set(date)
      .format("YYYY-MM-DD");
    feed.item({
      title: item.title,
      description:
        type !== "realTimeInfo" ? `<p>${item.description}</p>` : item.html,
      enclosure: {
        url: item.thumbnail,
      },
      url: url,
      link: url,
      author: author,
      date: dateStr,
      pubDate: dateStr,
      categories: categories,
    });
  });

  const xml = feed.xml({ indent: true });

  outputToFile(`./resources/frontend_client/${outputName}`, xml);

  console.log(`${outputName} ${medias.list.length} ${feedUrl}`);
};

const run = async () => {
  runMedia({
    type: "article",
    feedUrl: `${hostname}/rss-articles.xml`,
    siteUrl: `${hostname}/news/articles`,
    outputName: "rss-articles.xml",
  });
  runMedia({
    type: "realTimeInfo",
    feedUrl: `${hostname}/rss-featured.xml`,
    siteUrl: `${hostname}/news/featured`,
    outputName: "rss-featured.xml",
  });
  runMedia({
    type: "dailyNews",
    feedUrl: `${hostname}/rss-daily-news.xml`,
    siteUrl: `${hostname}/news/daily-news`,
    outputName: "rss-daily-news.xml",
  });
};

run();
