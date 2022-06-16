/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";
import { push, replace } from "react-router-redux";
import cx from "classnames";

import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper";
import DashboardGrid from "metabase/dashboard/components/DashboardGrid";
import DashboardControls from "metabase/dashboard/hoc/DashboardControls";
import EmbedFrame from "./components/EmbedFrame";
import title from "metabase/hoc/Title";

import { fetchDatabaseMetadata } from "metabase/redux/metadata";
import { setErrorPage } from "metabase/redux/app";
import { getMetadata } from "metabase/selectors/metadata";

// import titleWithLoadingTime from "metabase/hoc/TitleWithLoadingTime";
import PublicMode from "metabase/modes/components/modes/PublicMode";

import {
  getDashboardComplete,
  getCardData,
  getSlowCards,
  getParameters,
  getParameterValues,
} from "metabase/dashboard/selectors";

import * as dashboardActions from "metabase/dashboard/actions";

import { setPublicDashboardEndpoints } from "metabase/services";

import _ from "underscore";
import QueryCopyModal from "metabase/components/QueryCopyModal";
import {
  featuresSideHideAction,
  loginModalShowAction,
} from "metabase/redux/control";
import { throttle } from "lodash";
import { getFeaturesSideHide } from "metabase/selectors/control";
import { parseTitleId } from "metabase/lib/urls";
import DashboardAd from "metabase/containers/news/components/DashboardAd";
import RootOverviewControls from "metabase/dashboard/hoc/RootOverviewControls";
import { parseHashOptions } from "metabase/lib/browser";
import { isDefi360 } from "metabase/lib/project_info";
import MetaViewportControls from "metabase/dashboard/hoc/MetaViewportControls";
import { navigateToGuestQuery } from "metabase/guest/utils";
import MetabaseUtils from "metabase/lib/utils";
import { VisualizationShareFoot } from "metabase/visualizations/components/Visualization";

const THROTTLE_PERIOD = 300;

const mapStateToProps = (state, props) => {
  return {
    user: state.currentUser,
    metadata: getMetadata(state, props),
    dashboardId: parseTitleId(
      props.dashboardId || props.params.dashboardId || props.params.uuid,
    ).id,
    dashboard: getDashboardComplete(state, props),
    dashcardData: getCardData(state, props),
    slowCards: getSlowCards(state, props),
    parameters: getParameters(state, props),
    parameterValues: getParameterValues(state, props),
    featuresSideHide: getFeaturesSideHide(state, props),
  };
};

const mapDispatchToProps = {
  ...dashboardActions,
  fetchDatabaseMetadata,
  setErrorPage,
  onChangeLocation: push,
  onReplaceLocation: replace,
  setLoginModalShow: loginModalShowAction,
  featuresSideHideAction,
};

@connect(mapStateToProps, mapDispatchToProps)
@title(({ dashboard }) => dashboard && dashboard.name)
// @titleWithLoadingTime("loadingStartTime")
@MetaViewportControls
@RootOverviewControls
@DashboardControls
export default class PublicDashboard extends Component {
  constructor() {
    super();
    this.state = {
      cardId: "",
      cardName: "",
    };
  }

  async UNSAFE_componentWillMount() {
    await this.startInitDashboard(this.props.dashboardId);
  }

  startInitDashboard = async dashboardId => {
    const {
      initialize,
      fetchDashboard,
      fetchDashboardCardData,
      setErrorPage,
      location,
    } = this.props;
    if (dashboardId) {
      setPublicDashboardEndpoints();
    }

    initialize();
    try {
      await fetchDashboard(dashboardId, location.query);
      await fetchDashboardCardData({ reload: false, clear: true });
    } catch (error) {
      console.error(error);
      setErrorPage(error);
    }
  };

  componentWillUnmount() {
    this.props.cancelFetchDashboardCardData();
  }

  fetchDashboardCardData = () => {
    this.props.fetchDashboardCardData({ reload: false, clear: true });
  };

  fetchDashboardCardDataThrottle = throttle(
    this.fetchDashboardCardData,
    THROTTLE_PERIOD,
  );

  canUserReplace = () => {
    const { location } = this.props;
    return (
      location &&
      location.pathname &&
      location.pathname.startsWith("/guest/dashboard")
    );
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.dashboardId !== nextProps.dashboardId) {
      this.startInitDashboard(nextProps.dashboardId);
    } else if (
      !_.isEqual(this.props.parameterValues, nextProps.parameterValues)
    ) {
      this.fetchDashboardCardDataThrottle();
    }

    if (!this.props.user && nextProps.user && this.canUserReplace()) {
      const { user, dashboard } = nextProps;
      if (
        (user &&
          dashboard &&
          dashboard.creator &&
          user.id === dashboard.creator.id) ||
        user.is_superuser
      ) {
        this.props.onReplaceLocation(`/dashboard/${dashboard.entityId}`);
      }
    }
  }

  duplicateAction = async item => {
    if (this.props.user) {
      this.setState({
        cardId: item.id,
        cardName: item.name,
      });
    } else {
      this.props.setLoginModalShow({
        show: true,
        from: "publicDashboard_query_duplicate",
      });
    }
  };

  handleSideHide = ({ hide }) => {
    this.props.featuresSideHideAction({ hide });
  };

  render() {
    const {
      dashboard,
      parameters,
      parameterValues,
      isFullscreen,
      isNightMode,
      dashboardId,
      user,
      children,
      router,
      featuresSideHide,
      featuresMode,
    } = this.props;

    const { error } = this.state;

    const creatorId =
      dashboard &&
      (dashboard.creator_id || (dashboard.creator && dashboard.creator.id));

    const showEditButton = user && (user.id === creatorId || user.is_superuser);

    const { chart_style } = {
      ...parseHashOptions(location.hash),
    };
    return (
      <LoadingAndErrorWrapper
        style={{
          width:
            featuresMode && !featuresSideHide ? "calc(100% - 280px)" : "100%",
        }}
        className="shrink-below-content-size full-height flex-full"
        loading={!dashboard}
        error={error}
      >
        <EmbedFrame
          type="dashboard"
          uuid={dashboardId}
          name={dashboard && dashboard.name}
          entityId={dashboard && dashboard.entityId}
          creatorId={creatorId}
          description={dashboard && dashboard.description}
          dashboard={dashboard}
          parameters={parameters}
          parameterValues={parameterValues}
          setParameterValue={this.props.setParameterValue}
          user={user}
          creator={dashboard && dashboard.creator}
          statistics={dashboard && dashboard.statistics}
          createdAt={dashboard && dashboard.createdAt}
          isFavorite={dashboard && dashboard.isFavorite}
          router={router}
          showEditButton={showEditButton}
          handleSideHide={this.handleSideHide}
          hideSide={featuresSideHide}
          featuresMode={featuresMode}
        >
          <LoadingAndErrorWrapper
            className={cx("Dashboard flex-full", {
              "Dashboard--fullscreen": isFullscreen,
              "Dashboard--night": isNightMode,
              "Dashboard--coin360": MetabaseUtils.isCoin360(),
            })}
            key={dashboard && dashboard.id}
            loading={!dashboard}
          >
            {() => (
              <DashboardGrid
                {...this.props}
                className={"spread"}
                key={dashboard && dashboard.id}
                mode={PublicMode}
                metadata={this.props.metadata}
                navigateToNewCardFromDashboard={dashboard =>
                  navigateToGuestQuery(dashboard, this.props)
                }
                duplicateAction={this.duplicateAction}
                hideWatermark={dashboard && dashboard.hideWatermark}
                chartStyle={chart_style}
              />
            )}
            <QueryCopyModal
              open={this.state.cardId}
              cardId={this.state.cardId}
              name={this.state.cardName}
              onClose={() =>
                this.setState({
                  cardId: null,
                })
              }
            />
            {location.pathname.startsWith("/guest/dashboard") && (
              <VisualizationShareFoot location={this.props.location} />
            )}
          </LoadingAndErrorWrapper>
          {!isDefi360() && <DashboardAd dashboard={dashboard} />}
          {children}
        </EmbedFrame>
      </LoadingAndErrorWrapper>
    );
  }
}
