/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import "./detail.css";
import "./index.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import ActionButtons from "metabase/containers/news/components/ActionButtons";
import { connect } from "react-redux";
import DashboardCardDisplayInfo from "metabase/components/DashboardCardDisplayInfo";
import Recommend from "metabase/containers/news/components/Recommend";
import { mediaDetail } from "metabase/new-service";
import { message, Skeleton } from "antd";
import { push, replace } from "react-router-redux";
import cx from "classnames";
import formatDate from "metabase/containers/news/util/date";
import { formatOssUrl, getOssUrl } from "metabase/lib/image";
import Button from "metabase/components/Button";
import { trackStructEvent } from "metabase/lib/analytics";
import Meta from "metabase/components/Meta";
import { getContentFirstImg } from "metabase/containers/news/util/image";
import { parseObjectByMediaId, parseTitleId } from "metabase/lib/urls";
import ArticleHot from "metabase/containers/news/components/ArticleHot";
import { formatImgAlt } from "metabase/containers/news/util/handle";
import { articleTitle } from "metabase/lib/formatting";
import title, { updateTitle } from "metabase/hoc/Title";
import { IconBack } from "metabase/components/IconBack";
import TagsPanel from "metabase/query_builder/components/view/TagsPanel";

const Detail = props => {
  const {
    user,
    mediaInfoId,
    onChangeLocation,
    onReplaceLocation,
    router,
  } = props;

  const editorRef = React.createRef();
  const [data, setData] = useState();
  const [errorData, setErrorData] = useState();

  const isCreator = user && data && user.id === data.creator.id;

  const isArticle = data && data.type !== "realTimeInfo";
  const isFlash = data && data.type === "realTimeInfo";
  const initHtml = (data && data.html) || "";

  const isMarket = user && user.isMarket;
  const isAdmin = user && user.is_superuser;
  const hasPublishPermission = user && user.hasPublishPermission;

  useEffect(() => {
    const _getDetail = async () => {
      const hide = message.loading("Loading...");
      try {
        const data = await mediaDetail(parseObjectByMediaId(mediaInfoId));
        updateTitle(data?.title);
        setData(data);
      } catch (e) {
        setErrorData(true);
      } finally {
        hide && hide();
      }
    };

    _getDetail();
  }, [mediaInfoId]);

  const getOgImage = data => {
    if (!data) {
      return "";
    }
    return data.thumbnail || getContentFirstImg(data.html);
  };

  const removeSuccess = () => {
    onReplaceLocation(`news/featured`);
  };

  const errorDataPanel = () => {
    return (
      <div className="article-detail__no-data">
        <img
          src={getOssUrl("img-no-article-data.png")}
          alt="Footprint analytics"
        />
        <div>This article has been deleted or not exists.</div>
        <Button
          onClick={() => {
            trackStructEvent("news detail errordata click back");
            onReplaceLocation("/news/featured");
          }}
        >
          Back
        </Button>
      </div>
    );
  };

  const getContentPanel = () => {
    return (
      <React.Fragment>
        {(data.content || data.html) && (
          <div
            ref={editorRef}
            className="article-detail__content toastui-editor-contents markdown"
            dangerouslySetInnerHTML={{
              __html: formatImgAlt(formatOssUrl(initHtml), data.title),
            }}
          />
        )}
      </React.Fragment>
    );
  };

  const getArticlePanel = () => {
    return (
      <React.Fragment>
        {getTagPanel()}
        <DashboardCardDisplayInfo
          // authorName={data.creator && data.creator.name}
          date={data.publishTime}
        />
        {getContentPanel()}
      </React.Fragment>
    );
  };

  const getTagPanel = () => {
    const isMarket = user && user.isMarket;
    const isAdmin = user && user.is_superuser;
    return (
      <TagsPanel
        tagEntityId={data.mediaInfoId}
        isEditPermission={isMarket || isAdmin}
        type="news"
        canClick={false}
      />
    );
  };

  const getFlashPanel = () => {
    return (
      <React.Fragment>
        {getTagPanel()}
        <div className="article-detail__time">
          {formatDate(data.publishTime)}
        </div>
        {getContentPanel()}
        <Recommend type="article" />
      </React.Fragment>
    );
  };

  const getPanel = () => {
    if (!data) {
      return <Skeleton active />;
    }
    return (
      <React.Fragment>
        {data.mediaInfoId && (
          <ActionButtons
            onChangeLocation={onChangeLocation}
            item={data}
            isCreator={isCreator}
            isMarket={isMarket}
            isAdmin={isAdmin}
            hasPublishPermission={hasPublishPermission}
            removeSuccess={removeSuccess}
            detailUrl={window.location.href}
          />
        )}
        <article>
          <header>
            <IconBack
              router={router}
              url={`news/${
                data.type === "dailyNews" ? "daily-news" : "featured"
              }`}
            />
            <h1 className="article-detail__title">{articleTitle(data)}</h1>
          </header>
          {isArticle && getArticlePanel()}
          {isFlash && getFlashPanel()}
        </article>
      </React.Fragment>
    );
  };

  if (errorData) {
    return errorDataPanel();
  }

  return (
    <div className="article-detail">
      <Meta
        description={data?.description || articleTitle(data)}
        image={getOssUrl(getOgImage(data), { resize: true })}
      />
      <div className="article-detail__container">
        <div
          className={cx("article-detail__inner", {
            "article-detail__style": isArticle,
          })}
        >
          {getPanel()}
        </div>

        {data && <ArticleHot tags={data?.title?.split(" ")} />}
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: state.currentUser,
    mediaInfoId:
      props.params.id || parseTitleId(props.params.titleAndId, "news").id,
  };
};

const mapDispatchToProps = {
  onChangeLocation: push,
  onReplaceLocation: replace,
};

export default title()(connect(mapStateToProps, mapDispatchToProps)(Detail));
