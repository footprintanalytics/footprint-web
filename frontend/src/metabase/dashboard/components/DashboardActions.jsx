/* eslint-disable no-unused-vars */
/* eslint-disable react/no-string-refs */
import React from "react";
import { t } from "ttag";
// import cx from "classnames";
// import FullscreenIcon from "metabase/components/icons/FullscreenIcon";
// import Icon from "metabase/components/Icon";
// import MetabaseSettings from "metabase/lib/settings";
// import NightModeIcon from "metabase/components/icons/NightModeIcon";
// import PopoverWithTrigger from "metabase/components/PopoverWithTrigger";
import RefreshWidget from "metabase/dashboard/components/RefreshWidget";
import Tooltip from "metabase/components/Tooltip";
import Button from "metabase/components/Button";
// import { DashboardHeaderButton } from "./DashboardHeader.styled";

export const getDashboardActions = (
  self,
  {
    dashboard,
    isAdmin,
    user,
    isEditing = false,
    isEmpty = false,
    isFullscreen,
    // isNightMode,
    isPublic = false,
    // onNightModeChange,
    onFullscreenChange,
    refreshPeriod,
    setRefreshElapsedHook,
    onRefreshPeriodChange,
    onSharingClick,
  },
  canEdit,
) => {
  // const isPublicLinksEnabled = MetabaseSettings.get("enable-public-sharing");
  // const isEmbeddingEnabled = MetabaseSettings.get("enable-embedding");
  const buttons = [];

  const isLoaded = !!dashboard;
  const hasCards = isLoaded && dashboard.ordered_cards.length > 0;

  // dashcardData only contains question cards, text ones don't appear here
  const hasDataCards =
    hasCards &&
    dashboard.ordered_cards.some(
      dashCard =>
        dashCard.card.display !== "text" && dashCard.card.display !== "image",
    );

  const canShareDashboard = hasCards;

  // Getting notifications with static text-only cards doesn't make a lot of sense
  const canSubscribeToDashboard = hasDataCards;

  // const isOwner =
  //   user && (user.id === dashboard.creator_id || user.is_superuser);

  if (!isEditing && !isEmpty && !isPublic) {
    // const extraButtonClassNames =
    //   "bg-brand-hover text-white-hover py2 px3 text-bold block cursor-pointer";

    buttons.push(
      <Tooltip tooltip="Embed Widget">
        <Button
          onlyIcon
          className="ml1 Question-header-btn"
          iconColor="#7A819B"
          icon="embed"
          iconSize={16}
          onClick={() => onSharingClick({ onlyEmbed: true })}
        />
      </Tooltip>,
    );
    if (canSubscribeToDashboard) {
      buttons.push(
        <Tooltip
          tooltip={
            canShareDashboard ? t`Sharing` : t`Add data to share this dashboard`
          }
        >
          <Button
            onlyIcon
            className="ml1 Question-header-btn"
            iconColor="#7A819B"
            icon="share"
            iconSize={16}
            onClick={onSharingClick}
          />
        </Tooltip>,
        /*<PopoverWithTrigger
          ref="popover"
          disabled={!canShareDashboard}
          targetOffsetY={10}
          triggerElement={
            <Tooltip
              tooltip={
                canShareDashboard
                  ? t`Sharing`
                  : t`Add data to share this dashboard`
              }
            >
              {/!* <DashboardHeaderButton>
                <Icon
                  name="share"
                  size={24}
                  className={cx({
                    "text-brand-hover": canShareDashboard,
                    "text-light": !canShareDashboard,
                  })}
                />
              </DashboardHeaderButton> *!/}
              <Button
                onlyIcon
                className="ml1 Question-header-btn"
                iconColor="#7A819B"
                icon="share"
                iconSize={16}
              />
            </Tooltip>
          }
        >
          <div className="py1">
            {/!* <div>
              <a
                className={extraButtonClassNames}
                data-metabase-event={"Dashboard;Subscriptions"}
                onClick={() => {
                  self.refs.popover.close();
                  onSharingClick();
                }}
              >
                {t`Dashboard subscriptions`}
              </a>
            </div> *!/}
            <div>
              <DashboardSharingEmbeddingModal
                additionalClickActions={() => self.refs.popover.close()}
                dashboard={dashboard}
                enabled={
                  !isEditing &&
                  !isFullscreen &&
                  ((isPublicLinksEnabled && (isAdmin || isOwner)) ||
                    (isEmbeddingEnabled && isAdmin))
                }
                linkClassNames={extraButtonClassNames}
                linkText={t`Sharing and embedding`}
                key="dashboard-embed"
              />
            </div>
          </div>
        </PopoverWithTrigger>,*/
      );
    } else {
      buttons.push(
        <Tooltip
          tooltip={
            canShareDashboard ? t`Sharing` : t`Add data to share this dashboard`
          }
        >
          <Button
            onlyIcon
            className="ml1 Question-header-btn"
            iconColor="#7A819B"
            icon="share"
            iconSize={16}
            onClick={onSharingClick}
          />
        </Tooltip>,
        /*<DashboardSharingEmbeddingModal
          key="dashboard-embed"
          additionalClickActions={() => self.refs.popover.close()}
          dashboard={dashboard}
          enabled={
            !isEditing &&
            !isFullscreen &&
            ((isPublicLinksEnabled && (isAdmin || dashboard.public_uuid)) ||
              (isEmbeddingEnabled && isAdmin))
          }
          isLinkEnabled={canShareDashboard}
          linkText={
            <Tooltip
              isLinkEnabled={canShareDashboard}
              tooltip={
                canShareDashboard
                  ? t`Sharing`
                  : t`Add data to share this dashboard`
              }
            >
              {/!* <DashboardHeaderButton>
                <Icon
                  name="share"
                  className={cx({
                    "text-brand-hover": canShareDashboard,
                    "text-light": !canShareDashboard,
                  })}
                  size={24}
                />
              </DashboardHeaderButton> *!/}
              <Button
                onlyIcon
                className="ml1 Question-header-btn"
                iconColor="#7A819B"
                icon="share"
                iconSize={16}
              />
            </Tooltip>
          }
        />,*/
      );
    }
  }

  if (!isEditing && !isEmpty && canEdit) {
    buttons.push(
      <RefreshWidget
        key="refresh"
        data-metabase-event="Dashboard;Refresh Menu Open"
        className="text-brand-hover"
        period={refreshPeriod}
        setRefreshElapsedHook={setRefreshElapsedHook}
        onChangePeriod={onRefreshPeriodChange}
      />,
    );
  }

  // if (!isEditing && isFullscreen) {
  //   buttons.push(
  //     <Tooltip
  //       key="night"
  //       tooltip={isNightMode ? t`Daytime mode` : t`Nighttime mode`}
  //     >
  //       <span data-metabase-event={"Dashboard;Night Mode;" + !isNightMode}>
  //         <DashboardHeaderButton>
  //           <NightModeIcon
  //             className="text-brand-hover cursor-pointer"
  //             isNightMode={isNightMode}
  //             onClick={() => onNightModeChange(!isNightMode)}
  //             size={24}
  //           />
  //         </DashboardHeaderButton>
  //       </span>
  //     </Tooltip>,
  //   );
  // }

  if (!isEditing && !isEmpty && canEdit) {
    // option click to enter fullscreen without making the browser go fullscreen
    buttons.push(
      <Tooltip
        key="fullscreen"
        tooltip={isFullscreen ? t`Exit fullscreen` : t`Enter fullscreen`}
      >
        {/* <span
          data-metabase-event={"Dashboard;Fullscreen Mode;" + !isFullscreen}
        >
          <DashboardHeaderButton
            onClick={e => onFullscreenChange(!isFullscreen, !e.altKey)}
          >
            <FullscreenIcon
              className="text-brand-hover"
              isFullscreen={isFullscreen}
            />
          </DashboardHeaderButton>
        </span> */}
        <Button
          onlyIcon
          className="ml1 Question-header-btn"
          iconColor="#7A819B"
          icon={isFullscreen ? "contract" : "expand"}
          iconSize={16}
          onClick={e => onFullscreenChange(!isFullscreen, !e.altKey)}
        />
      </Tooltip>,
    );
  }

  return buttons;
};
