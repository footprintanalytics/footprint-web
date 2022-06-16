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

  const data = [
    {
      type: "box",
      entityKey: "creatorRelatedDashboards",
      title: "More dashboards",
    },
    {
      type: "list",
      entityKey: "tableRelatedDashboards",
      title: "Viewers also viewed",
    },
    {
      type: "list",
      entityKey: "tagRelatedDashboards",
      title: "You may like",
    },
  ];

  return (
    <div className="dashboard-ad html2canvas-filter">
      {data.map(item => (
        <RelatedDashboard
          key={item.entityKey}
          type={item.type}
          router={router}
          dashboardId={dashboard?.entityId || dashboard?.id}
          entityKey={item.entityKey}
          title={item.title}
        />
      ))}
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
