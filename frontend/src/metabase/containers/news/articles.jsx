/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { push } from "react-router-redux";
import connect from "react-redux/lib/connect/connect";
import InfiniteScroll from "react-infinite-scroll-component";
import { Pagination, Skeleton } from "antd";
import { capitalize } from "lodash";
import DashboardCardDisplayInfo from "metabase/components/DashboardCardDisplayInfo";
import { useMediaList } from "metabase/containers/news/use";
import Thumb from "metabase/components/Thumb";
// import KeepAliveControls from "metabase/hoc/KeepAliveControls";
import { articleDetailUrl, urlAddChannel } from "metabase/lib/urls";
import ActionButtons from "metabase/containers/news/components/ActionButtons";
import { trackStructEvent } from "metabase/lib/analytics";
import NoData from "metabase/containers/news/components/NoData";
import Link from "metabase/core/components/Link";
import { formatOssUrl } from "metabase/lib/image";
import ArticleHot from "metabase/containers/news/components/ArticleHot";
import { getChannel } from "metabase/selectors/app";
import { articleTitle } from "metabase/lib/formatting";
import Meta from "metabase/components/Meta";

const Articles = props => {
  const {
    location,
    user,
    onChangeLocation,
    channel,
    type,
    tag,
    sortBy = "publishTime",
    sortDirection = "desc",
    showPublishTime = true,
    canShowHot = true,
  } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  const { mediaData, setMediaData, mediaTotal, isLoading } = useMediaList({
    type: type,
    tag: tag,
    currentPage,
    user,
    sortBy,
    sortDirection,
    pageSize,
  });
  const showHot = !!mediaTotal && mediaTotal > 0 && canShowHot;

  const removeSuccess = mediaInfoId => {
    setMediaData(mediaData.filter(item => item.mediaInfoId !== mediaInfoId));
  };

  if (isLoading) {
    return (
      <div className="news-articles__container">
        <div style={{ width: "100%", padding: "0 40px" }}>
          <Skeleton active />
        </div>
      </div>
    );
  }

  const renderList = () => {
    if (mediaTotal === undefined) {
      return <Skeleton active />;
    }

    if (mediaTotal === 0) {
      return <NoData title="No Data" />;
    }
    return (
      <div>
        {mediaData.map(item => {
          const isCreator = user && item && user.id === item.creator.id;
          const isMarket = user && user.isMarket;
          const isAdmin = user && user.is_superuser;
          const hasPublishPermission = user && user.hasPublishPermission;
          return (
            <article key={item.mediaInfoId}>
              <Link
                to={item.url || articleDetailUrl(item)}
                href={item.url || articleDetailUrl(item)}
                className="news-articles__item"
                onClick={e => {
                  e.preventDefault();
                  trackStructEvent("articles click item");
                  if (item.url) {
                    return window.open(item.url);
                  }
                  onChangeLocation(urlAddChannel(articleDetailUrl(item), channel));
                }}
              >
                <div className="news-articles__item-left">
                  <div className="news-articles__item-head">
                    {showPublishTime && (
                      <DashboardCardDisplayInfo
                        // authorName={item.creator && item.creator.name}
                        date={item.publishTime}
                        pointerEvents="auto"
                      />
                    )}
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
                  <h1
                    className="news-articles__item-title footprint-title1"
                    style={{ WebkitBoxOrient: "vertical" }}
                  >
                    {articleTitle(item)}
                  </h1>
                  <div
                    className="news-articles__item-desc footprint-secondary-text1"
                    style={{ WebkitBoxOrient: "vertical" }}
                  >
                    {item.description}
                  </div>
                </div>
                <div className="news-articles__item-image">
                  <Thumb
                    src={`${formatOssUrl(item.thumbnail)}`}
                    name={item.title}
                    defaultThumb="img-article-thumb-default.png"
                  />
                </div>
              </Link>
            </article>
          );
        })}
        <Pagination
          style={{ textAlign: "right", marginTop: 40 }}
          defaultCurrent={currentPage}
          total={mediaTotal}
          pageSize={pageSize}
          onChange={(page, pageSize) => {
            const element = document.getElementById("app-content"); // 获取元素
            element.scrollTo(0, 0);
            setCurrentPage(page)
          }
        }/>
      </div>
    );
  };

  return (
    <>
    {type && (<Meta
      title={`${capitalize(type)} - Footprint Analytics`}
    />)}
    <div className="news-articles__container">
      <div style={{ flex: 1, maxWidth: 1000 }}>{renderList()}</div>
      {showHot && <ArticleHot />}
    </div>
    </>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: state.currentUser,
    channel: getChannel(state, props),
  };
};

const mapDispatchToProps = {
  onChangeLocation: push,
};

// export default KeepAliveControls("articles")(
//   connect(mapStateToProps, mapDispatchToProps)(Articles),
// );
export default connect(mapStateToProps, mapDispatchToProps)(Articles);
