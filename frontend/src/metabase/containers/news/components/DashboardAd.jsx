/* eslint-disable react/prop-types */
import React from "react";
import connect from "react-redux/lib/connect/connect";
import "./DashboardAd.css";
import { push } from "react-router-redux";
import RelatedDashboard from "metabase/containers/news/components/RelatedDashboard";
import _ from "underscore";
import fitViewport from "metabase/hoc/FitViewPort";
import { withRouter } from "react-router";
import "../../dashboards/components/Dashboards/index.css";

const DashboardAd = props => {
  const { dashboard, router } = props;

  return (
    <div className="dashboard-ad html2canvas-filter">
      <RelatedDashboard
        type="box"
        router={router}
        dashboardId={dashboard?.entityId || dashboard?.id}
        entityKey="creatorRelatedDashboards"
        title="Creator Related Dashboards"
      />
      <RelatedDashboard
        type="list"
        router={router}
        dashboardId={dashboard?.entityId || dashboard?.id}
        entityKey="tableRelatedDashboards"
        title="Table Related Dashboards"
      />
      <RelatedDashboard
        type="list"
        router={router}
        dashboardId={dashboard?.entityId || dashboard?.id}
        entityKey="tagRelatedDashboards"
        title="Tag Related Dashboards"
      />
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
};

export default _.compose(
  connect(mapStateToProps, mapDispatchToProps),
  fitViewport,
  withRouter,
)(DashboardAd);
