/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import Icon from "metabase/components/Icon";
import { useMediaList } from "metabase/containers/news/use";
import { push } from "react-router-redux";
import connect from "react-redux/lib/connect/connect";
import InfiniteScroll from "react-infinite-scroll-component";
import formatDate from "metabase/containers/news/util/date";
import { Skeleton } from "antd";
import { articleDetailUrl, urlAddChannel } from "metabase/lib/urls";
import { trackStructEvent } from "metabase/lib/analytics";
import NoData from "metabase/containers/news/components/NoData";
import ActionButtons from "metabase/containers/news/components/ActionButtons";
import Link from "metabase/components/Link";
import { formatOssUrl } from "metabase/lib/image";
import { formatImgAlt } from "metabase/containers/news/util/handle";
import { getChannel } from "metabase/selectors/app";

const Flash = props => {
  const { location, user, onChangeLocation, loadedMediaData, channel } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const { mediaData, setMediaData, mediaTotal } = useMediaList({
    type: "realTimeInfo",
    currentPage,
    user,
  });
  const [hasMore, setHasMore] = useState(
    mediaData && mediaTotal && mediaData.length < mediaTotal,
  );

  useEffect(() => {
    loadedMediaData && loadedMediaData(mediaTotal && mediaTotal > 0);
  }, [mediaTotal, loadedMediaData]);

  const loadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const removeSuccess = mediaInfoId => {
    setMediaData(mediaData.filter(item => item.mediaInfoId !== mediaInfoId));
  };

  if (mediaTotal === undefined) {
    return <Skeleton active />;
  }

  if (mediaTotal === 0) {
    return <NoData title="No Flash" />;
  }

  return (
    <div className="flash">
      <div className="article-recommend__section-head">
        <div className="article-recommend__section-head-title">
          <Icon name="flash" size={18} mr={10} color="#A6AABE" />
          <span className="article-recommend__title footprint-title1">
            Flash
          </span>
        </div>
      </div>
      <InfiniteScroll
        dataLength={mediaData.length}
        next={loadMore}
        hasMore={hasMore}
        className="news-articles__list"
        onScroll={() => {
          const isActive = location.pathname === window.location.pathname;
          const canLoadMore = isActive && mediaData.length < mediaTotal;
          if (canLoadMore !== hasMore) {
            setHasMore(canLoadMore);
          }
        }}
      >
        {mediaData.map(item => {
          const isCreator = user && item && user.id === item.creator.id;
          const isMarket = user && user.isMarket;
          const isAdmin = user && user.is_superuser;
          const hasPublishPermission = user && user.hasPublishPermission;
          const initHtml = (item && item.html) || "";
          return (
            <article key={item.mediaInfoId} className="news-flash__item">
              <div className="news-flash__item-head">
                <div className="footprint-secondary-text2">
                  {formatDate(item.publishTime)}
                </div>
                <ActionButtons
                  onChangeLocation={onChangeLocation}
                  item={item}
                  isCreator={isCreator}
                  isMarket={isMarket}
                  isAdmin={isAdmin}
                  hasPublishPermission={hasPublishPermission}
                  tooltipEnabled={true}
                  borderless={true}
                  removeSuccess={removeSuccess}
                  detailUrl={
                    item.url ||
                    `${window.location.origin}/${articleDetailUrl(item)}`
                  }
                />
              </div>
              <Link
                to={item.url || articleDetailUrl(item)}
                href={item.url || articleDetailUrl(item)}
                style={{ WebkitBoxOrient: "vertical" }}
                onClick={e => {
                  e.preventDefault();
                  trackStructEvent("flash click item");
                  if (item.url) {
                    return window.open(item.url);
                  }
                  onChangeLocation(
                    urlAddChannel(articleDetailUrl(item), channel),
                  );
                }}
              >
                <h1 className="news-flash__item-title footprint-primary-text">
                  {item.title}
                </h1>
              </Link>
              <div className="news-flash__item-detail">
                {(item.content || item.html) && (
                  <div
                    className="news-flash__item-content toastui-editor-contents"
                    dangerouslySetInnerHTML={{
                      __html: formatImgAlt(formatOssUrl(initHtml), item.title),
                    }}
                  />
                )}
              </div>
            </article>
          );
        })}
      </InfiniteScroll>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
    channel: getChannel(state),
  };
};

const mapDispatchToProps = {
  onChangeLocation: push,
};

export default connect(mapStateToProps, mapDispatchToProps)(Flash);
