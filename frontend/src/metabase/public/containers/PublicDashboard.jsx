/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import cx from "classnames";

import { IFRAMED } from "metabase/lib/dom";

import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper";
import DashboardGrid from "metabase/dashboard/components/DashboardGrid";
import DashboardControls from "metabase/dashboard/hoc/DashboardControls";
import { getDashboardActions } from "metabase/dashboard/components/DashboardActions";
import EmbedFrame from "../components/EmbedFrame";
import title from "metabase/hoc/Title";

import { fetchDatabaseMetadata } from "metabase/redux/metadata";
import { setErrorPage } from "metabase/redux/app";
import { getMetadata } from "metabase/selectors/metadata";

import PublicMode from "metabase/modes/components/modes/PublicMode";

import {
  getDashboardComplete,
  getCardData,
  getSlowCards,
  getParameters,
  getParameterValues,
} from "metabase/dashboard/selectors";

import * as dashboardActions from "metabase/dashboard/actions";

import {
  setPublicDashboardEndpoints,
  setEmbedDashboardEndpoints,
} from "metabase/services";

import type { Dashboard } from "metabase-types/types/Dashboard";
import type { Parameter } from "metabase-types/types/Parameter";

import _ from "underscore";
import { parseTitleId } from "metabase/lib/urls";
import { parseHashOptions } from "metabase/lib/browser";
import MetabaseUtils from "metabase/lib/utils";
import { get } from "lodash";
import { isWhiteLabel } from "metabase/lib/white_label";

const mapStateToProps = (state, props) => {
  return {
    metadata: getMetadata(state, props),
    dashboardId: parseTitleId(
      props.params.dashboardId || props.params.uuid || props.params.token,
    ).id,
    dashboard: getDashboardComplete(state, props),
    dashcardData: getCardData(state, props),
    slowCards: getSlowCards(state, props),
    parameters: getParameters(state, props),
    parameterValues: getParameterValues(state, props),
  };
};

const mapDispatchToProps = {
  ...dashboardActions,
  fetchDatabaseMetadata,
  setErrorPage,
  onChangeLocation: push,
};

type Props = {
  params: { uuid?: string, token?: string },
  location: { query: { [key: string]: string } },
  dashboardId: string,

  dashboard?: Dashboard,
  parameters: Parameter[],
  parameterValues: { [key: string]: string },

  initialize: () => void,
  isFullscreen: boolean,
  isNightMode: boolean,
  fetchDashboard: (
    dashId: string,
    query: { [key: string]: string },
  ) => Promise<void>,
  fetchDashboardCardData: (options: {
    reload: boolean,
    clear: boolean,
  }) => Promise<void>,
  cancelFetchDashboardCardData: () => Promise<void>,
  setParameterValue: (id: string, value: string) => void,
  setErrorPage: (error: { status: number }) => void,
};

@connect(mapStateToProps, mapDispatchToProps)
@title(({ dashboard }) => dashboard && dashboard.name)
@DashboardControls
// NOTE: this should use DashboardData HoC
export default class PublicDashboard extends Component {
  props: Props;

  async UNSAFE_componentWillMount() {
    const whiteLabelUsers = [14330];
    const {
      initialize,
      fetchDashboard,
      fetchDashboardCardData,
      setErrorPage,
      location,
      params,
    } = this.props;
    const uuid = parseTitleId(params.uuid).id;
    const token = params.token;

    if (uuid) {
      setPublicDashboardEndpoints();
    } else if (token) {
      setEmbedDashboardEndpoints();
    }

    initialize();
    try {
      const dashboardResult = await fetchDashboard(
        uuid || token,
        location.query,
      );
      if (isWhiteLabel) {
        const userId = get(
          dashboardResult?.payload?.entities?.dashboard,
          uuid || token,
        )?.creator?.id;
        if (!whiteLabelUsers.includes(userId)) {
          throw new Error(
            "You do not have permission to access, please contact the official.",
          );
        }
      }
      await fetchDashboardCardData({ reload: false, clear: true });
    } catch (error) {
      console.error(error);
      setErrorPage(error);
    }
  }

  componentWillUnmount() {
    this.props.cancelFetchDashboardCardData();
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (!_.isEqual(this.props.parameterValues, nextProps.parameterValues)) {
      this.props.fetchDashboardCardData({ reload: false, clear: true });
    }
  }

  render() {
    const {
      dashboard,
      parameters,
      parameterValues,
      isFullscreen,
      isNightMode,
      router,
    } = this.props;
    const buttons = !IFRAMED
      ? getDashboardActions(this, { ...this.props, isPublic: true })
      : [];

    const { chart_style } = {
      ...parseHashOptions(location.hash),
    };

    return (
      <EmbedFrame
        name={dashboard && dashboard.name}
        description={dashboard && dashboard.description}
        dashboard={dashboard}
        creatorId={dashboard && dashboard.creator_id}
        parameters={parameters}
        parameterValues={parameterValues}
        setParameterValue={this.props.setParameterValue}
        actionButtons={
          buttons.length > 0 && <div className="flex">{buttons}</div>
        }
        creator={dashboard && dashboard.creator}
        statistics={dashboard && dashboard.statistics}
        createdAt={dashboard && dashboard.createdAt}
        isFavorite={dashboard && dashboard.isFavorite}
        router={router}
      >
        <LoadingAndErrorWrapper
          className={cx("Dashboard p1 flex-full", {
            "Dashboard--fullscreen": isFullscreen,
            "Dashboard--night": isNightMode,
            "Dashboard--coin360": MetabaseUtils.isCoin360(),
          })}
          loading={!dashboard}
        >
          {() => (
            <DashboardGrid
              {...this.props}
              className={"spread"}
              mode={PublicMode}
              metadata={this.props.metadata}
              navigateToNewCardFromDashboard={() => {}}
              hideWatermark={dashboard && dashboard.hideWatermark}
              chartStyle={chart_style}
            />
          )}
        </LoadingAndErrorWrapper>
      </EmbedFrame>
    );
  }
}
