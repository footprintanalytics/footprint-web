/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import DashboardCardDisplayInfo from "metabase/components/DashboardCardDisplayInfo";
import "./Recommend.css";
import Icon from "metabase/components/Icon";
import Link from "metabase/components/Link";
import connect from "react-redux/lib/connect/connect";
import { push } from "react-router-redux";
import { mediaRecommend } from "metabase/new-service";
import Thumb from "metabase/components/Thumb";
import { articleDetailUrl, urlAddChannel } from "metabase/lib/urls";
import { trackStructEvent } from "metabase/lib/analytics";
import { formatOssUrl } from "metabase/lib/image";
import {
  cacheRecommendAction,
  cacheRecommendDailyAction,
} from "metabase/redux/cache";
import { getChannel } from "metabase/selectors/app";
import { articleTitle } from "metabase/lib/formatting";

const Recommend = props => {
  const {
    title,
    moreText,
    cacheRecommend,
    cacheRecommendDaily,
    cacheRecommendAction,
    cacheRecommendDailyAction,
    channel,
    type = "article",
    seeAllLink = "/news/articles",
    itemHeight = 256,
    titleLineClamp = 2,
    icon = "recommend",
  } = props;
  const [data, setData] = useState([]);
  const [hasMediaApi, setHasMediaApi] = useState(false);

  const cacheArray = {
    article: {
      cache: cacheRecommend,
      cacheAction: cacheRecommendAction,
    },
    dailyNews: {
      cache: cacheRecommendDaily,
      cacheAction: cacheRecommendDailyAction,
    },
  };

  useEffect(() => {
    const _getRecommend = async () => {
      let data = (cacheArray[type] || {}).cache;
      if ((!data || data.length === 0) && !hasMediaApi) {
        try {
          const res = await mediaRecommend({
            type: type,
            pageSize: 4,
            currentPage: 0,
          });
          const action = (cacheArray[type] || {}).cacheAction;
          action && action({ data: res.data });
          data = res.data;
        } catch (e) {}
        setHasMediaApi(true);
      }
      const resData = data || [];
      setData(resData);
    };

    _getRecommend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const recommendItemOnClick = item => {
    trackStructEvent("news click recommenditem");
    if (item.url) {
      return window.open(item.url);
    }
    window.open(urlAddChannel(articleDetailUrl(item), channel));
  };

  const onLinkClick = e => {
    trackStructEvent("news click seeall");
    e.preventDefault();
    window.open(urlAddChannel(seeAllLink, channel));
  };

  return data.length > 0 ? (
    <div className="article-recommend">
      <div className="article-recommend__section-head">
        <div className="article-recommend__section-head-title">
          <Icon name={icon} size={18} mr={10} color="#A6AABE" />
          <span className="article-recommend__title footprint-title1">
            {title || "Recommended Articles"}
          </span>
        </div>
        {seeAllLink && (
          <Link
            to={seeAllLink}
            href={seeAllLink}
            onClick={onLinkClick}
            className="article-recommend-see footprint-primary-text"
          >
            {moreText || "See all"} <Icon name="arrow_right_simple" />
          </Link>
        )}
      </div>
      <div className="recommend__list-wrap">
        <div className="article-recommend__list" style={{ height: itemHeight }}>
          {data.map((item, index) => {
            return (
              <React.Fragment key={item.mediaInfoId}>
                <Link
                  key={item.mediaInfoId}
                  to={item.url || articleDetailUrl(item)}
                  href={item.url || articleDetailUrl(item)}
                  className="article-recommend__item"
                  onClick={e => {
                    e.preventDefault();
                    recommendItemOnClick(item);
                  }}
                >
                  <div className="article-recommend__item-image">
                    <Thumb
                      src={`${formatOssUrl(item.thumbnail)}`}
                      name={item.title}
                      defaultThumb="img-article-thumb-default.png"
                    />
                  </div>
                  <div
                    className="article-recommend__item-title footprint-primary-text"
                    style={{
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: titleLineClamp,
                    }}
                  >
                    {articleTitle(item)}
                  </div>
                  <DashboardCardDisplayInfo
                    // authorName={item.creator && item.creator.name}
                    date={item.publishTime}
                  />
                  {/*<div
                  className="article-recommend__item-desc"
                  style={{ WebkitBoxOrient: "vertical" }}
                >
                  {item.description}
                </div>*/}
                </Link>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  ) : (
    <React.Fragment />
  );
};

const mapStateToProps = (state, props) => ({
  cacheRecommend: state.cache.recommend,
  cacheRecommendDaily: state.cache.recommendDaily,
  channel: getChannel(state, props),
});

const mapDispatchToProps = {
  onChangeLocation: push,
  cacheRecommendAction,
  cacheRecommendDailyAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Recommend);
