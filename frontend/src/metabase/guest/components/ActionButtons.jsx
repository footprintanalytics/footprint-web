/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
// import Icon from "metabase/components/Icon";
import Tooltip from "metabase/components/Tooltip";
import { t } from "ttag";
// import { DashboardHeaderButton } from "metabase/dashboard/components/DashboardHeader.styled";
import ShareModal from "metabase/containers/home/components/ShareModal";
import QueryCopyModal from "metabase/components/QueryCopyModal";
import { loginModalShowAction } from "metabase/redux/control";
import Button from "metabase/components/Button";
import Favorite from "metabase/containers/explore/components/Favorite";
import DashboardCopyModal from "metabase/dashboard/components/DashboardCopyModal";
import { trackStructEvent } from "../../lib/analytics";
import { snapshot } from "metabase/dashboard/components/utils/snapshot";
import colors from "metabase/lib/colors";
import { isDefi360 } from "metabase/lib/project_info";
import PopoverWithTrigger from "metabase/components/PopoverWithTrigger";
import TaggingModal from "metabase/components/TaggingModal";
import HomePriorityModal from "metabase/components/HomePriorityModal";
import { replaceTemplateCardUrl } from "metabase/guest/utils";
import QueryDownloadWidget from "metabase/query_builder/components/QueryDownloadWidget";

const ActionButtons = ({
  user,
  name,
  uniqueName, //dashboard uniqueName
  creator, //user creator
  entityId,
  uuid,
  type,
  creatorId,
  onRefreshData,
  onChangeLocation,
  setLoginModalShow,
  statistics,
  isFavorite,
  showEditButton,
  result,
  card,
}) => {
  const [shareModalResource, setShareModalResource] = useState({});
  const [cardId, setCardId] = useState(null); //query copy modal
  const [showDashboardCopyModal, setShowDashboardCopyModal] = useState(false); //dashboard copy modal
  const pathType = type === "card" ? "chart" : type;
  const showCopyButton = true;
  // type === "card" || (user && (user.isAnalyst || user.is_superuser));
  const isMarket = user && user.isMarket;
  const isAdmin = user && user.is_superuser;
  const [seoTaggingModal, setSeoTaggingModal] = useState({});
  const [homePriorityModal, setHomePriorityModal] = useState({});

  const extraButtonClassNames =
    "bg-brand-hover text-white-hover py2 px3 text-bold block cursor-pointer";
  const extraButtons = [];
  extraButtons.push(
    <div
      className={extraButtonClassNames}
      onClick={() => setSeoTaggingModal({ id: entityId, creatorId: creatorId })}
    >
      Seo tagging
    </div>,
  );
  type === "dashboard" &&
    extraButtons.push(
      <div
        className={extraButtonClassNames}
        onClick={() => setHomePriorityModal({ id: entityId })}
      >
        Home priority
      </div>,
    );

  return (
    <div className="chart-buttons flex align-center ml-auto">
      {!isDefi360() && (
        <Tooltip tooltip={t`Add to favorite list`}>
          <Favorite
            onlyIcon
            className="ml1 Question-header-btn-with-text"
            like={
              -1
              // statistics && statistics.favorite
            }
            isLike={isFavorite}
            type={type}
            id={entityId}
            uuid={uuid}
          />
        </Tooltip>
      )}
      {showEditButton && (
        <Tooltip tooltip={t`Edit`}>
          <Button
            className="ml1 Question-header-btn-with-text"
            iconColor={colors["footprint-color-secondary-text2"]}
            icon="pencil"
            iconSize={16}
            color={colors["footprint-color-secondary-text2"]}
            onClick={() => {
              trackStructEvent(`click Chart Edit`);
              onChangeLocation(`/${pathType}/${entityId}?defaultEdit=true`);
            }}
          />
        </Tooltip>
      )}
      {!showEditButton && type === "card" && (
        <Tooltip tooltip={t`Preview`}>
          <Button
            className="ml1 Question-header-btn-with-text"
            iconColor={colors["footprint-color-secondary-text2"]}
            icon="chart_preview"
            iconSize={16}
            color={colors["footprint-color-secondary-text2"]}
            onClick={() => {
              trackStructEvent(`click Chart Preview`);
              replaceTemplateCardUrl({ user, setLoginModalShow }, entityId);
            }}
          />
        </Tooltip>
      )}
      {showCopyButton && (
        <Tooltip
          key={type === "dashboard" ? "duplicate-dashboard" : "duplicate-query"}
          tooltip={
            type === "dashboard" ? t`Duplicate dashboard` : t`Duplicate chart`
          }
        >
          <Button
            className="ml1 Question-header-btn-with-text"
            iconColor={colors["footprint-color-secondary-text2"]}
            icon="duplicate"
            iconSize={16}
            color={colors["footprint-color-secondary-text2"]}
            onClick={() => {
              trackStructEvent(`click Duplicate`);
              if (user) {
                if (type === "dashboard") {
                  setShowDashboardCopyModal(true);
                } else {
                  setCardId(entityId);
                }
              } else {
                setLoginModalShow({
                  show: true,
                  from: "action-buttons-duplicate",
                });
              }
            }}
          >
            {statistics && `${statistics.copy}`}
          </Button>
        </Tooltip>
      )}

      <Tooltip key="share-dashboard" tooltip={t`Sharing`}>
        <Button
          className="ml1 Question-header-btn Question-header-btn--auto"
          iconColor={colors["footprint-color-secondary-text2"]}
          icon="share"
          iconSize={16}
          onClick={() => {
            trackStructEvent(`click Share`);
            setShareModalResource({
              open: true,
              public_uuid: uuid,
              type,
              name,
              id: entityId,
              creatorId,
              uniqueName: uniqueName,
              creator: creator,
            });
          }}
        />
      </Tooltip>

      <Tooltip key="download-dashboard" tooltip={t`Snapshot`}>
        <Button
          className="ml1 Question-header-btn Question-header-btn--auto"
          iconColor={colors["footprint-color-secondary-text2"]}
          icon="camera"
          iconSize={16}
          onClick={() => {
            trackStructEvent(`click Snapshot`);
            if (user) {
              snapshot({
                public_uuid: uuid,
                isDashboard: type === "dashboard",
                user,
              });
            } else {
              setLoginModalShow({ show: true, from: `${type}-snapshot` });
            }
          }}
        />
      </Tooltip>

      {card && result && (
        <QueryDownloadWidget
          className="ml1"
          key="download"
          iconColor="#acacb2"
          card={card}
          result={result}
        />
      )}

      {(isMarket || isAdmin) && (
        <PopoverWithTrigger
          targetOffsetY={10}
          triggerElement={
            <Button
              onlyIcon
              className="ml1 Question-header-btn"
              iconColor="#7A819B"
              icon="more"
              iconSize={16}
            />
          }
        >
          <div className="py1">
            {extraButtons.map((b, i) => (
              <div key={i}>{b}</div>
            ))}
          </div>
        </PopoverWithTrigger>
      )}

      <QueryCopyModal
        open={cardId}
        cardId={cardId}
        name={name}
        onClose={() => setCardId(null)}
      />

      <DashboardCopyModal
        isOpen={showDashboardCopyModal}
        onClose={() => setShowDashboardCopyModal(false)}
        dashboardId={entityId}
        fromRoute={false}
      />

      <ShareModal
        resource={shareModalResource}
        onRefreshData={onRefreshData}
        onClose={() => {
          setShareModalResource({});
        }}
      />

      {seoTaggingModal.id && (
        <TaggingModal
          onClose={() => setSeoTaggingModal({})}
          id={seoTaggingModal.id}
          name={seoTaggingModal.name}
          creatorId={seoTaggingModal.creatorId}
          type="dashboard"
        />
      )}
      {homePriorityModal.id && (
        <HomePriorityModal
          onClose={() => setHomePriorityModal({})}
          id={homePriorityModal.id}
          name={homePriorityModal.name}
          type="dashboard"
        />
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
  setLoginModalShow: loginModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionButtons);
