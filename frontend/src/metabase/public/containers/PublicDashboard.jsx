/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import cx from "classnames";
import { withRouter } from "react-router";

import _ from "underscore";
import { debounce, isArray } from "lodash";
import { Breadcrumb, message } from "antd";
import { IFRAMED } from "metabase/lib/dom";

import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper";
import DashboardGrid from "metabase/dashboard/components/DashboardGrid";
import DashboardControls from "metabase/dashboard/hoc/DashboardControls";
import { getDashboardActions } from "metabase/dashboard/components/DashboardActions";
import title from "metabase/hoc/Title";

import { fetchDatabaseMetadata } from "metabase/redux/metadata";
import { setErrorPage } from "metabase/redux/app";
import { getMetadata } from "metabase/selectors/metadata";
import { parseHashOptions } from "metabase/lib/browser";

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
import { parseTitleId } from "metabase/lib/urls";
import {
  updateDashboardPara,
  getDefaultDashboardPara,
} from "metabase/growth/utils/utils";
import { cons } from "cljs/cljs.core";
import { canShowDarkMode } from "metabase/dashboard/components/utils/dark";
import EmbedFrame from "../components/EmbedFrame";
import { trackStructEvent } from "metabase/lib/analytics";
import Button from "metabase/core/components/Button/Button";

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
    updateDashboardPara(parameters, parameterValues, "protocol_slug", [
      project.protocolSlug,
    ]);
    if(project.tokenAddress?.length>0&&project.tokenAddress[0].address){
      updateDashboardPara(parameters, parameterValues, "token_address",
        [project.tokenAddress[0].address]
      );
    }
    if (project.template) {
      const key = "tag";
      const queryCollection = getDefaultDashboardPara(
        parameters,
        parameterValues,
        key,
      );
      const tags = [project.template].concat(queryCollection ?? []);
      updateDashboardPara(
        parameters,
        parameterValues,
        key,
        tags.filter((item, index) => tags.indexOf(item) === index),
      );
    }
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
      if (
        updateDashboardPara(parameters, parameterValues, key, queryCollection)
      ) {
        if (queryCollection === project.nftCollectionAddress?.[0]?.address) {
          updateDashboardPara(parameters, parameterValues, "chain", [
            project.nftCollectionAddress?.[0].chain,
          ]);
        }
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
      updateDashboardPara(
        parameters,
        parameterValues,
        key,
        project.twitter_handler,
      );
    }
    if (project.discord_guild_id) {
      updateDashboardPara(
        parameters,
        parameterValues,
        "project_name",
        project.protocolName,
      );
      updateDashboardPara(
        parameters,
        parameterValues,
        "guild_id",
        project.discord_guild_id,
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
  _fetchDashboardCardData = debounce(
    () => {
      this.props.fetchDashboardCardData({ reload: false, clear: true });
    },
    100,
    {
      leading: false,
      trailing: true,
    },
  );

  _fetchDashboardCardDataRefresh = debounce(
    (params) => {
      this.props.fetchDashboardCardData({ reload: false, clear: true, ignoreCache: true });
    },
    1000,
    {
      leading: true,
      trailing: false,
    },
  );

  _initialize = async () => {
    const {
      initialize,
      fetchDashboard,
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
      this._fetchDashboardCardData();
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
      this._fetchDashboardCardData();
    }
  }

  renderRefreshButton = () => {
    return (
      <Button
        onlyIcon
        className="Question-header-btn"
        iconColor="#7A819B"
        icon={"refresh"}
        iconSize={16}
        style={{
          "position": "fixed",
          "right": "40px",
          "top": "100px",
          "zIndex": 2,
        }}
        onClick={() => {
          this._fetchDashboardCardDataRefresh({ ignoreCache: true })
        }}
      />
    );
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
      disableBreadcrumb,
      className,
      innerClassName,
      router,
      showRefreshButton,
    } = this.props;
    const buttons = !IFRAMED
      ? getDashboardActions(this, { ...this.props, isPublic: true })
      : [];

    const { chart_style } = {
      ...parseHashOptions(location.hash),
    };
    const isFgaPublicDashboard = location.pathname.startsWith("/growth");
    let hideParameters = isFgaPublicDashboard
      ? "gamefi,protocol_slug,twitter_handler,project_name,guild_id"
      : "";
    const hashData = parseHashOptions(location?.hash);
    if (
      isFgaPublicDashboard &&
      hashData?.from &&
      dashboard &&
      !disableBreadcrumb
    ) {
      header = (
        <>
          <Breadcrumb
            className="pl1 pt2"
            items={[
              {
                title: (
                  <a
                    onClick={() => {
                      router?.goBack();
                    }}
                  >
                    {hashData?.from}
                  </a>
                ),
              },
              {
                title: dashboard && dashboard.name,
              },
            ]}
          />
          {header}
        </>
      );
      hideTitle = true;
    }
    if (hideAllParams) {
      parameters.map((para, index) => {
        hideParameters = hideParameters + (index !== 0 ? "," : "") + para.slug;
      });
    }
    const shouldRenderAsNightMode = isNightMode || canShowDarkMode(dashboard);
    return (
      <EmbedFrame
        name={dashboard && dashboard.name}
        description={dashboard && dashboard.description}
        dashboard={dashboard}
        parameters={parameters}
        hideParameters={hideParameters}
        hideTitle={hideTitle}
        headerLayout={header}
        parameterValues={parameterValues}
        setParameterValue={this.props.setParameterValue}
        actionButtons={
          buttons.length > 0 && <div className="flex">{buttons}</div>
        }
        isNightMode={shouldRenderAsNightMode}
        hideFooter={hideFooter || isFgaPublicDashboard}
        className={cx(className, isFgaPublicDashboard && "ml-250 mt-60")}
        innerClassName={cx(innerClassName)}
      >
        <>
          <LoadingAndErrorWrapper
            className={cx("Dashboard p1 flex-full", {
              "Dashboard--fullscreen": isFullscreen,
              "Dashboard--night": shouldRenderAsNightMode,
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
                isNightMode={shouldRenderAsNightMode}
              />
            )}
          </LoadingAndErrorWrapper>
          {showRefreshButton && !!dashboard && (this.renderRefreshButton())}
        </>
      </EmbedFrame>
    );
  }
}

export default _.compose(
  connect(mapStateToProps, mapDispatchToProps),
  title(({ disableUpdateTitle, dashboard }) => !disableUpdateTitle && dashboard && dashboard.name),
  DashboardControls,
)(PublicDashboard);
