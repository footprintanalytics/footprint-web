/* eslint-disable react/prop-types */
import React from "react";
import { formatOssUrl, getOssUrl } from "metabase/lib/image";
import SectionHead from "metabase/containers/home/components/SectionHead";
import formatDate from "metabase/containers/news/util/date";
import { trackStructEvent } from "metabase/lib/analytics";
import { articleDetailUrl, urlAddChannel } from "metabase/lib/urls";
import DashboardCardDisplayInfo from "metabase/components/DashboardCardDisplayInfo";
import Thumb from "metabase/components/Thumb";
import Link from "metabase/components/Link";
import { getChannel } from "metabase/selectors/app";
import connect from "react-redux/lib/connect/connect";

const HomeArticles = props => {
  const { mediaInfos, channel } = props;
  if (!mediaInfos || !mediaInfos.length) {
    return null;
  }

  const onClick = item => {
    trackStructEvent("home articles click item");
    if (item.url) {
      return window.open(item.url);
    }

    window.open(urlAddChannel(articleDetailUrl(item), channel));
  };

  const titleDiv = item => {
    return (
      <Link
        className="news-flash__item-title footprint-primary-text"
        to={item.url || articleDetailUrl(item)}
        style={{ WebkitBoxOrient: "vertical" }}
        onClick={e => {
          e.preventDefault();
          onClick(item);
        }}
      >
        {item.title}
      </Link>
    );
  };

  const articleDiv = item => {
    return (
      <React.Fragment>
        <div className="news-articles__item-image">
          <Thumb
            src={`${formatOssUrl(item.thumbnail)}`}
            name={item.title}
            backgroundModel={false}
            defaultThumb="img-article-thumb-default.png"
          />
        </div>
        <div>
          {titleDiv(item)}
          <DashboardCardDisplayInfo
            // authorName={item.creator && item.creator.name}
            date={item.publishTime}
            pointerEvents="auto"
          />
        </div>
        <div></div>
      </React.Fragment>
    );
  };

  const realTimeInfo = item => {
    return (
      <React.Fragment>
        <div className="news-flash__item-head">
          <div className="footprint-secondary-text2">
            {formatDate(item.publishTime)}
          </div>
        </div>
        {titleDiv(item)}
      </React.Fragment>
    );
  };

  return (
    <div className="home-article-root">
      <div className="home-article-container">
        <SectionHead
          className="home-article-head"
          img={getOssUrl("img_home_articles.png")}
          title="News"
          link="news/featured"
        />
        <ul role="link" className="home-article-list">
          {mediaInfos.map(item => (
            <li
              key={item.mediaInfoId}
              className="home-article-list-item"
              style={{
                height: item.type !== "realTimeInfo" ? 240 : 100,
                justifyContent:
                  item.type !== "realTimeInfo" ? "space-between" : "center",
              }}
            >
              {item.type === "realTimeInfo"
                ? realTimeInfo(item)
                : articleDiv(item)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    channel: getChannel(state, props),
  };
};

export default connect(mapStateToProps)(HomeArticles);
