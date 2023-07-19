/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import _ from "underscore";

import { t } from "ttag";

import title from "metabase/hoc/Title";
import favicon from "metabase/hoc/Favicon";
import titleWithLoadingTime from "metabase/hoc/TitleWithLoadingTime";

import Dashboard from "metabase/dashboard/components/Dashboard/Dashboard";
import Toaster from "metabase/components/Toaster";

import { useLoadingTimer } from "metabase/hooks/use-loading-timer";
import { useWebNotification } from "metabase/hooks/use-web-notification";
import { useOnUnmount } from "metabase/hooks/use-on-unmount";

import { fetchDatabaseMetadata } from "metabase/redux/metadata";
import { getIsNavbarOpen, setErrorPage } from "metabase/redux/app";

import { getDatabases, getMetadata } from "metabase/selectors/metadata";
import QueryCopyModal from "metabase/components/QueryCopyModal";
import {
  getUserIsAdmin,
  canManageSubscriptions,
  getUser, getFgaProject,
} from "metabase/selectors/user";

import {
  loginModalShowAction,
  setIsCancelFeedbackBlockAction,
} from "metabase/redux/control";

import { getEmbedOptions } from "metabase/selectors/embed";

import { parseHashOptions } from "metabase/lib/browser";
import * as Urls from "metabase/lib/urls";

import Dashboards from "metabase/entities/dashboards";

import DataAppContext from "metabase/writeback/containers/DataAppContext";
import { getSqlAndJumpToDoc, replaceTemplateCardUrl } from "metabase/guest/utils";
import * as dashboardActions from "../actions";
import { toggleSidebar } from "../actions";
import {
  getIsEditing,
  getIsSharing,
  getDashboardBeforeEditing,
  getIsEditingParameter,
  getIsDirty,
  getDashboardComplete,
  getCardData,
  getSlowCards,
  getEditingParameter,
  getParameters,
  getParameterValues,
  getLoadingStartTime,
  getClickBehaviorSidebarDashcard,
  getIsAddParameterPopoverOpen,
  getSidebar,
  getFavicon,
  getDocumentTitle,
  getIsRunning,
  getIsLoadingComplete,
  getIsHeaderVisible,
  getIsAdditionalInfoVisible,
} from "../selectors";
import { trackStructEvent } from "metabase/lib/analytics";

function getDashboardId({ dashboardId, location, params }) {
  if (dashboardId) {
    return dashboardId;
  }
  return Urls.isDataAppPagePath(location.pathname)
    ? parseInt(params.pageId)
    : Urls.extractEntityId(params.slug);
}

const mapStateToProps = (state, props) => {
  return {
    dashboardId: getDashboardId(props),
    canManageSubscriptions: canManageSubscriptions(state, props),
    isAdmin: getUserIsAdmin(state, props),
    isNavbarOpen: getIsNavbarOpen(state),
    isEditing: getIsEditing(state, props),
    isSharing: getIsSharing(state, props),
    dashboardBeforeEditing: getDashboardBeforeEditing(state, props),
    isEditingParameter: getIsEditingParameter(state, props),
    isDirty: getIsDirty(state, props),
    dashboard: getDashboardComplete(state, props),
    dashcardData: getCardData(state, props),
    slowCards: getSlowCards(state, props),
    databases: getDatabases(state, props),
    editingParameter: getEditingParameter(state, props),
    parameters: getParameters(state, props),
    parameterValues: getParameterValues(state, props),
    metadata: getMetadata(state),
    loadingStartTime: getLoadingStartTime(state),
    clickBehaviorSidebarDashcard: getClickBehaviorSidebarDashcard(state),
    isAddParameterPopoverOpen: getIsAddParameterPopoverOpen(state),
    sidebar: getSidebar(state),
    pageFavicon: getFavicon(state),
    documentTitle: getDocumentTitle(state),
    isRunning: getIsRunning(state),
    isLoadingComplete: getIsLoadingComplete(state),
    isHeaderVisible: getIsHeaderVisible(state),
    isAdditionalInfoVisible: getIsAdditionalInfoVisible(state),
    embedOptions: getEmbedOptions(state),
    urlDashboardName: props.params.dashboardName,
    urlUserName: props.params.name,
    user: getUser(state),
    projectObject: getFgaProject(state),
  };
};

const mapDispatchToProps = {
  ...dashboardActions,
  archiveDashboard: id => Dashboards.actions.setArchived({ id }, true),
  fetchDatabaseMetadata,
  setErrorPage,
  onChangeLocation: push,
  setLoginModalShow: loginModalShowAction,
  setIsCancelFeedbackBlockAction,
  toggleSidebar,
};

// NOTE: should use DashboardControls and DashboardData HoCs here0?
const DashboardApp = props => {
  const options = parseHashOptions(window.location.hash);
  const { isRunning, isLoadingComplete, dashboard, projectObject, router } = props;

  const [editingOnLoad] = useState(options.edit);
  const [addCardOnLoad] = useState(options.add && parseInt(options.add));

  const [isShowingToaster, setIsShowingToaster] = useState(false);

  const [cardInfo, setCardInfo] = useState(null);


  useEffect(() => {
    if (projectObject?.protocolSlug !== "mocaverse" && location.pathname === "/growth/dashboard/@0xABS/User-Journey-of-Mocaverse-FGA") {
      router.replace("/growth")
    }
  }, [router, projectObject]);

  const onTimeout = useCallback(() => {
    if ("Notification" in window && Notification.permission === "default") {
      setIsShowingToaster(true);
    }
  }, []);

  useLoadingTimer(isRunning, {
    timer: 15000,
    onTimeout,
  });

  const [requestPermission, showNotification] = useWebNotification();

  useOnUnmount(props.reset);

  useEffect(() => {
    if (isLoadingComplete) {
      setIsShowingToaster(false);
      if (
        "Notification" in window &&
        Notification.permission === "granted" &&
        document.hidden
      ) {
        showNotification(
          t`All Set! ${dashboard?.name} is ready.`,
          t`All questions loaded`,
        );
      }
    }
  }, [isLoadingComplete, showNotification, dashboard?.name]);

  const onConfirmToast = useCallback(async () => {
    await requestPermission();
    setIsShowingToaster(false);
  }, [requestPermission]);

  const onDismissToast = useCallback(() => {
    setIsShowingToaster(false);
  }, []);

  const duplicateAction = async item => {
    trackStructEvent(`dashcard click duplicate`);
    if (props.user) {
      setCardInfo({
        cardId: item.id,
        cardName: item.name,
      });
    } else {
      props.setLoginModalShow({
        show: true,
        from: "publicDashboard_query_duplicate",
      });
    }
  };

  const previewAction = (cardId) => {
    trackStructEvent(`dashcard click preview`);
    if (props.user) {
      replaceTemplateCardUrl(props, cardId);
    } else {
      props.setLoginModalShow({
        show: true,
        from: "publicDashboard_query_preview",
      });
    }
  };

  const getDataViaSqlApiAction = ({ cardId, dashcardId, dashboardId }) => {
    trackStructEvent(`dashcard click get-data-via-sql-api`);
    if (props.user) {
      getSqlAndJumpToDoc(props, { cardId, dashcardId, dashboardId });
    } else {
      props.setLoginModalShow({
        show: true,
        from: "publicDashboard_get_data_via_sql_api",
      });
    }
  }

  return (
    <DataAppContext>
      <div className="shrink-below-content-size full-height">
        <Dashboard
          editingOnLoad={editingOnLoad}
          addCardOnLoad={addCardOnLoad}
          duplicateAction={duplicateAction}
          previewAction={previewAction}
          getDataViaSqlApiAction={getDataViaSqlApiAction}
          projectObject={projectObject}
          {...props}
        />
        <QueryCopyModal
          open={cardInfo?.cardId}
          cardId={cardInfo?.cardId}
          name={cardInfo?.cardName}
          onClose={() => setCardInfo(null)}
        />
        {/* For rendering modal urls */}
        {props.children}
        {/*<Toaster
          message={
            dashboard?.is_app_page
              ? t`Would you like to be notified when this page is done loading?`
              : t`Would you like to be notified when this dashboard is done loading?`
          }
          isShown={isShowingToaster}
          onDismiss={onDismissToast}
          onConfirm={onConfirmToast}
          fixed
        />*/}
      </div>
    </DataAppContext>
  );
};

export default _.compose(
  connect(mapStateToProps, mapDispatchToProps),
  favicon(({ pageFavicon }) => pageFavicon),
  title(({ dashboard, documentTitle }) => ({
    title: documentTitle || dashboard?.name,
    titleIndex: 1,
  })),
  titleWithLoadingTime("loadingStartTime"),
)(DashboardApp);
