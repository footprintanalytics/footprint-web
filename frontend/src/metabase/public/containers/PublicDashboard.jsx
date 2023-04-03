/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import cx from "classnames";

import _ from "underscore";
import { isArray } from "lodash";
import { IFRAMED } from "metabase/lib/dom";

import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper";
import DashboardGrid from "metabase/dashboard/components/DashboardGrid";
import DashboardControls from "metabase/dashboard/hoc/DashboardControls";
import { getDashboardActions } from "metabase/dashboard/components/DashboardActions";
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
import { parseHashOptions } from "metabase/lib/browser";
import { parseTitleId } from "metabase/lib/urls";
import {
  updateDashboardPara,
  getDefaultDashboardPara,
} from "metabase/growth/utils/utils";
import EmbedFrame from "../components/EmbedFrame";
import { cons } from "cljs/cljs.core";

const mapStateToProps = (state, props) => {
  const parameters = getParameters(state, props);
  const parameterValues = getParameterValues(state, props);
  const project = props.project;
  const location = props.location;
  if (project) {
    // switch protocol
    updateDashboardPara(parameters, parameterValues, "gamefi", [
      project.protocolSlug,
    ]);
    if (project.nftCollectionAddress?.length > 0) {
      const key = "collection_contract_address";
      let queryCollection = getDefaultDashboardPara(
        parameters,
        parameterValues,
        key,
      );
      let queryCollectionInUrl = location.query.collection_contract_address;
      queryCollectionInUrl =
        project.nftCollectionAddress.findIndex(
          item => item.address === queryCollectionInUrl,
        ) !== -1
          ? queryCollectionInUrl
          : null;
      queryCollection =
        queryCollection &&
        !isArray(queryCollection) &&
        project.nftCollectionAddress.findIndex(
          item => item.address === queryCollectionInUrl,
        ) !== -1
          ? queryCollection
          : queryCollectionInUrl ?? project.nftCollectionAddress?.[0]?.address;
      updateDashboardPara(parameters, parameterValues, key, queryCollection);
      if (queryCollection === project.nftCollectionAddress?.[0]?.address) {
        updateDashboardPara(parameters, parameterValues, "chain", [
          project.nftCollectionAddress?.[0].chain,
        ]);
      }
    }
    // mutiple collection
    if (project.nftCollectionAddress?.length > 0) {
      const key = "collection_contract_addresses";
      const mutipleCollection = project.nftCollectionAddress.map(item => {
        return item.address;
      });
      updateDashboardPara(parameters, parameterValues, key, mutipleCollection);
    }
    if (project.twitter_handler) {
      const key = "twitter_handler";
      // let queryHandler = getDefaultDashboardPara(
      //   parameters,
      //   parameterValues,
      //   key,
      // );
      // const queryHandlerInUrl = location.query.twitter_handler;
      // console.log(
      //   "hanlder",
      //   project.twitter_handler,
      //   queryHandler,
      //   queryHandlerInUrl,
      // );
      // queryHandler =
      //   queryHandler ?? queryHandlerInUrl ?? project.twitter_handler;
      updateDashboardPara(
        parameters,
        parameterValues,
        key,
        project.twitter_handler,
      );
    }
    if (project.discord_guild_id) {
      const key = "project_name";
      updateDashboardPara(
        parameters,
        parameterValues,
        key,
        project.protocolName,
      );
    }
    if (project.campaignTitle) {
      const key = "campaign_title";
      updateDashboardPara(
        parameters,
        parameterValues,
        key,
        project.campaignTitle,
      );
    }
  }
  return {
    metadata: getMetadata(state, props),
    project: props.project,
    header: props.header,
    hideAllParams: props.hideAllParams,
    hideTitle: props.hideTitle,
    dashboardId:
      props.params.dashboardId ||
      parseTitleId(props.params.uuid || props.params.token).id,
    dashboard: getDashboardComplete(state, props),
    dashcardData: getCardData(state, props),
    slowCards: getSlowCards(state, props),
    parameters: parameters,
    parameterValues: parameterValues,
  };
};

const mapDispatchToProps = {
  ...dashboardActions,
  fetchDatabaseMetadata,
  setErrorPage,
  onChangeLocation: push,
};

// NOTE: this should use DashboardData HoC
class PublicDashboard extends Component {
  _initialize = async () => {
    const {
      initialize,
      fetchDashboard,
      fetchDashboardCardData,
      setErrorPage,
      location,
      params: { dashboardId, uuid, token },
    } = this.props;
    let publicUuid;
    if (!dashboardId) {
      publicUuid = parseTitleId(uuid).id;
      if (publicUuid) {
        setPublicDashboardEndpoints();
      } else if (token) {
        setEmbedDashboardEndpoints();
      }
    }
    initialize();
    try {
      await fetchDashboard(dashboardId || publicUuid || token, location.query);
      await fetchDashboardCardData({ reload: false, clear: true });
    } catch (error) {
      console.error(error);
      setErrorPage(error);
    }
  };

  async componentDidMount() {
    this._initialize();
  }

  componentWillUnmount() {
    this.props.cancelFetchDashboardCardData();
  }

  async componentDidUpdate(prevProps) {
    if (this.props.dashboardId !== prevProps.dashboardId) {
      return this._initialize();
    }
    if (!_.isEqual(this.props.parameterValues, prevProps.parameterValues)) {
      this.props.fetchDashboardCardData({ reload: false, clear: true });
    }
  }

  render() {
    let {
      dashboard,
      parameters,
      parameterValues,
      isFullscreen,
      isNightMode,
      project,
      header,
      hideFooter,
      hideTitle,
      hideAllParams,
      className,
    } = this.props;
    const buttons = !IFRAMED
      ? getDashboardActions(this, { ...this.props, isPublic: true })
      : [];

    const { chart_style } = {
      ...parseHashOptions(location.hash),
    };
    let hideParameters = "";
    if (hideAllParams) {
      parameters.map((para, index) => {
        hideParameters = hideParameters + (index !== 0 ? "," : "") + para.slug;
      });
    }
    return (
      <EmbedFrame
        name={dashboard && dashboard.name}
        description={dashboard && dashboard.description}
        dashboard={dashboard}
        parameters={parameters}
        hideParameters={hideParameters}
        hideTitle={hideTitle}
        parameterValues={parameterValues}
        setParameterValue={this.props.setParameterValue}
        actionButtons={
          buttons.length > 0 && <div className="flex">{buttons}</div>
        }
        hideFooter={hideFooter}
        className={className}
      >
        <>
          {header ?? <></>}
          <LoadingAndErrorWrapper
            className={cx("Dashboard p1 flex-full", {
              "Dashboard--fullscreen": isFullscreen,
              "Dashboard--night": isNightMode,
            })}
            loading={!dashboard}
          >
            {() => (
              <DashboardGrid
                {...this.props}
                className="spread"
                mode={PublicMode}
                metadata={this.props.metadata}
                navigateToNewCardFromDashboard={() => {}}
                hideWatermark={dashboard && dashboard.hideWatermark}
                chartStyle={chart_style}
              />
            )}
          </LoadingAndErrorWrapper>
        </>
      </EmbedFrame>
    );
  }
}

export default _.compose(
  connect(mapStateToProps, mapDispatchToProps),
  title(({ dashboard }) => dashboard && dashboard.name),
  DashboardControls,
)(PublicDashboard);
