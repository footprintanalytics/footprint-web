/* eslint-disable react/prop-types */

import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { push, replace } from "react-router-redux";
import Icon from "metabase/components/Icon";
import { fetchDashboard } from "metabase/dashboard/actions";
import "./PreviewDashboardCard.css";
import QueryCopyModal from "metabase/components/QueryCopyModal";
import { ossPath } from "metabase/lib/ossPath";
import { loginModalShowAction } from "metabase/redux/control";
import Favorite from "metabase/containers/explore/components/Favorite";
import { Box } from "grid-styled";
import { trackStructEvent } from "metabase/lib/analytics";
import Button from "metabase/components/Button";
import moment from "moment";
import DashboardCopyModal from "metabase/dashboard/components/DashboardCopyModal";
import { getOssUrl } from "metabase/lib/image";
import Link from "metabase/components/Link";
import Thumb from "metabase/components/Thumb";
import { formatTitle } from "metabase/lib/formatting";
import colors from "metabase/lib/colors";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper";
import fitViewport from "metabase/hoc/FitViewPort";
import { isDefi360 } from "metabase/lib/project_info";
import ArchiveQuestionModal from "metabase/query_builder/containers/ArchiveQuestionModal";
import Modal from "metabase/components/Modal";
import ArchiveDashboardModal from "metabase/dashboard/containers/ArchiveDashboardModal";
import * as Urls from "metabase/lib/urls";

const PreviewDashboardCard = props => {
  const {
    item,
    user,
    onChangeLocation,
    // onReplaceLocation,
    shareAction,
    /*location: { search },*/
    setLoginModalShow,
    favoriteClickSuccess,
    archiveSuccess,
    thumbMode,
    onlyShowTitle,
    hideShareButton,
    hideButtons,
    onlyViewByButton,
    loading,
    fitClassNames,
    disableLinkClick,
    showArchiveButton,
  } = props;

  // const pathname = window.location.pathname;
  // const copyPathPrefix = pathname === "/" ? "preview" : pathname.split("/")[1];

  const [cardId, setCardId] = useState(null); //query copy modal
  const [showArchiveCard, setShowArchiveCard] = useState(null); //query archive modal
  const [showArchiveDashboard, setShowArchiveDashboard] = useState(null); //dashboad archive modal
  const [showDashboardCopyModal, setShowDashboardCopyModal] = useState(false); //dashboard copy modal
  const thumbUrl = `${ossPath(item.type || item.model)}/${item.id}.png`;
  const showButtons = !Urls.isPublicPath() && !hideButtons;
  const showCopyButton = true;
  // item.type === "card" ||
  // (user && (user.groups?.includes("Inner") || user.is_superuser));

  const showShareButton = !hideShareButton;

  let linkUrl = "";
  if (item.menu && item.subMenu) {
    linkUrl = `/topic/${item.menu}/${item.subMenu}`;
  } else if (!user || (user.id !== item.creatorId && !user.is_superuser)) {
    if (item.type === "dashboard") {
      linkUrl = Urls.dashboard(item);
    } else {
      linkUrl = Urls.guestUrl(item);
    }
  } else {
    if (item.type === "dashboard") {
      linkUrl = Urls.dashboard(item);
    } else {
      linkUrl = Urls.dashboardQuestionUrl(item);
    }
  }

  const publicSceneLinkUrl = Urls.publicSceneUrl(item);

  const onLinkClick = e => {
    e.preventDefault();
    if (disableLinkClick) {
      return;
    }
    if (Urls.isPublicPath()) {
      onChangeLocation(publicSceneLinkUrl);
      return;
    }
    trackStructEvent("click Preview Dashboard Card");
    if (isDefi360()) {
      window.open(linkUrl.replace("guest/", "defi360/guest/"));
    } else {
      const go = e.ctrlKey || e.metaKey ? window.open : onChangeLocation;
      go(linkUrl);
    }
  };

  if (loading) {
    return (
      <div className="preview-dashboard-card">
        <LoadingAndErrorWrapper className={fitClassNames} loading />
      </div>
    );
  }

  return (
    <div key={item.name} className="preview-dashboard-card">
      <QueryCopyModal
        open={cardId}
        cardId={cardId}
        name={item.name}
        onClose={() => setCardId(null)}
      />

      <DashboardCopyModal
        isOpen={showDashboardCopyModal}
        onClose={() => setShowDashboardCopyModal(false)}
        dashboardId={item.id}
        fromRoute={false}
      />

      {showArchiveCard && (
        <Modal onClose={() => setShowArchiveCard(null)}>
          <ArchiveQuestionModal
            cardId={item.id}
            onClose={() => setShowArchiveCard(null)}
            otherSuccessAction={() => archiveSuccess(item)}
          />
        </Modal>
      )}

      {showArchiveDashboard && (
        <Modal onClose={() => setShowArchiveDashboard(null)}>
          <ArchiveDashboardModal
            id={item.id}
            onClose={() => setShowArchiveDashboard(null)}
            otherSuccessAction={() => archiveSuccess(item)}
          />
        </Modal>
      )}

      <Link
        to={linkUrl}
        onClick={onLinkClick}
        className="preview-dashboard-card__thumb-wrap"
      >
        <Thumb
          src={`${getOssUrl(thumbUrl, { resize: true })}`}
          name={item.name}
        />
      </Link>

      {!thumbMode && (
        <div className="preview-dashboard-card-foot">
          <Link
            to={linkUrl}
            onClick={onLinkClick}
            className="preview-dashboard-card__name"
          >
            <img
              src={
                item.type === "dashboard"
                  ? getOssUrl("img_home_dashboard.png")
                  : getOssUrl("img_home_query.png")
              }
              alt=""
            />
            <Box ml={10} />
            <span
              className="text-pre-wrap footprint-title2 text-wrap"
              style={{ WebkitBoxOrient: "vertical" }}
            >
              {formatTitle(item.name)}
            </span>
          </Link>
          {!onlyShowTitle && (
            <div className="preview-dashboard-card__bottom">
              {showButtons && (
                <div className="preview-dashboard-card__fun">
                  <Button
                    small
                    borderless
                    className="p0 mr2 cursor-default footprint-secondary-text1"
                    icon="read"
                    iconSize={16}
                    color={colors["footprint-color-secondary-text2"]}
                    iconColor={colors["footprint-color-secondary-text2"]}
                    onClick={async e => {
                      e.stopPropagation();
                    }}
                  >
                    {item && item.statistics && `${item.statistics.view}`}
                  </Button>
                  {showCopyButton && (
                    <Button
                      small
                      borderless
                      className="p0 mr2 footprint-secondary-text1"
                      icon="duplicate"
                      iconSize={16}
                      color={colors["footprint-color-secondary-text2"]}
                      iconColor={colors["footprint-color-secondary-text2"]}
                      onClick={async e => {
                        e.stopPropagation();
                        if (onlyViewByButton) {
                          return;
                        }
                        trackStructEvent(
                          "click review Dashboard Card Duplicate",
                        );
                        if (user) {
                          if (item.type === "dashboard") {
                            setShowDashboardCopyModal(true);
                          } else {
                            setCardId(item.id);
                          }
                        } else {
                          setLoginModalShow({
                            show: true,
                            from: "preview_dashboard_card_duplicate",
                          });
                        }
                      }}
                    >
                      {item && item.statistics && `${item.statistics.copy}`}
                    </Button>
                  )}
                  {!isDefi360() && (
                    <Favorite
                      borderless
                      className="p0 mr2 footprint-secondary-text1"
                      uuid={item.publicUuid}
                      id={item.id}
                      type={item.type}
                      like={item.statistics && item.statistics.favorite}
                      isLike={item && item.isFavorite}
                      favoriteClickSuccess={data => {
                        trackStructEvent(
                          "click Preview Dashboard Card Favorite",
                        );
                        favoriteClickSuccess(data);
                      }}
                    />
                  )}

                  {showShareButton && (
                    <Icon
                      name="share"
                      size={16}
                      className="p0 mr2"
                      style={{ cursor: "pointer" }}
                      color={colors["footprint-color-secondary-text2"]}
                      onClick={async e => {
                        e.stopPropagation();
                        if (onlyViewByButton) {
                          return;
                        }
                        trackStructEvent("click Preview Dashboard Card Share");
                        shareAction && shareAction(item);
                      }}
                    />
                  )}

                  {showArchiveButton && (
                    <Icon
                      name="delete"
                      size={16}
                      className="p0 mr2"
                      style={{ cursor: "pointer" }}
                      color={colors["footprint-color-secondary-text2"]}
                      onClick={async e => {
                        e.stopPropagation();
                        if (onlyViewByButton) {
                          return;
                        }
                        trackStructEvent(
                          "click Preview Dashboard Card archive",
                        );
                        if (item.type === "dashboard") {
                          setShowArchiveDashboard(true);
                        } else {
                          setShowArchiveCard(true);
                        }
                      }}
                    />
                  )}
                </div>
              )}
              <span className="footprint-secondary-text2">
                {item.createdAt
                  ? moment(new Date(item.createdAt).getTime()).format(
                      "YYYY-MM-DD",
                    )
                  : " "}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

const mapDispatchToProps = {
  onChangeLocation: push,
  onReplaceLocation: replace,
  fetchDashboard,
  setLoginModalShow: loginModalShowAction,
};

export default withRouter(
  fitViewport(
    connect(mapStateToProps, mapDispatchToProps)(PreviewDashboardCard),
  ),
);
