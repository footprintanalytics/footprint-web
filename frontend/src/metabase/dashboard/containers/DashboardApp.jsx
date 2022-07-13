/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import fitViewport from "metabase/hoc/FitViewPort";
import title from "metabase/hoc/Title";
// import titleWithLoadingTime from "metabase/hoc/TitleWithLoadingTime";

import Dashboard from "metabase/dashboard/components/Dashboard/Dashboard";

import { fetchDatabaseMetadata } from "metabase/redux/metadata";
import { setErrorPage } from "metabase/redux/app";

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
  getShowAddQuestionSidebar,
} from "../selectors";
import { getDatabases, getMetadata } from "metabase/selectors/metadata";
import { getUser, getUserIsAdmin } from "metabase/selectors/user";

import * as dashboardActions from "../actions";
import { parseHashOptions } from "metabase/lib/browser";
import * as Urls from "metabase/lib/urls";

import Dashboards from "metabase/entities/dashboards";
import QueryCopyModal from "metabase/components/QueryCopyModal";
import {
  loginModalShowAction,
  setIsCancelFeedbackBlockAction,
} from "metabase/redux/control";
import userCancelFeedbackUtil from "metabase/dashboard/components/utils/userCancelFeedbackUtil";

const mapStateToProps = (state, props) => {
  return {
    dashboardId: props.dashboardId || Urls.extractEntityId(props.params.slug),
    urlDashboardName: props.params.dashboardName,
    urlUserName: props.params.name,

    isAdmin: getUserIsAdmin(state, props),
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
    user: getUser(state),
    sidebar: getSidebar(state),
    showAddQuestionSidebar: getShowAddQuestionSidebar(state),
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
};

type DashboardAppState = {
  addCardOnLoad: number | null,
  cardId: String | "",
  cardName: String | "",
};

@connect(mapStateToProps, mapDispatchToProps)
@fitViewport
@title(({ dashboard }) => dashboard && dashboard.name)
// @titleWithLoadingTime("loadingStartTime")
// NOTE: should use DashboardControls and DashboardData HoCs here?
export default class DashboardApp extends Component {
  state: DashboardAppState = {
    addCardOnLoad: null,
    defaultEdit: false,
    cardId: "",
    cardName: "",
  };

  UNSAFE_componentWillMount() {
    const options = parseHashOptions(window.location.hash);
    if (options.add) {
      this.setState({ addCardOnLoad: parseInt(options.add) });
    }
    const { location } = this.props;
    if (location && location.query && location.query.defaultEdit === "true") {
      this.setState({ defaultEdit: true });
    }

    this.props.setIsCancelFeedbackBlockAction({
      isUserFeedbackBlock: this.isCancelFeedbackBlock,
    });
  }

  isCancelFeedbackBlock = () => {
    const scene = "new-dashboard-leave";
    return {
      isBlock:
        ((this.props.dashboardBeforeEditing &&
          this.props.dashboardBeforeEditing.ordered_cards?.length === 0) ||
          (this.props.dashboard &&
            this.props.dashboard.ordered_cards?.length === 0)) &&
        userCancelFeedbackUtil.canBlock(scene, true),
      scene,
    };
  };

  componentWillUnmount = () => {
    this.props.setIsCancelFeedbackBlockAction({
      isCancelFeedbackBlock: undefined,
    });
  };

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

  render() {
    return (
      <div className="shrink-below-content-size flex-full">
        <Dashboard
          addCardOnLoad={this.state.addCardOnLoad}
          duplicateAction={this.duplicateAction}
          defaultEdit={this.state.defaultEdit}
          {...this.props}
        />
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
        {/* For rendering modal urls */}
        {this.props.children}
      </div>
    );
  }
}
