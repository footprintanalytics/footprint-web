/* eslint-disable react/prop-types */
import React from "react";
import connect from "react-redux/lib/connect/connect";
import "./DashboardAd.css";
import { push } from "react-router-redux";
import Recommend from "metabase/containers/news/components/Recommend";
import HotDashboard from "metabase/containers/news/components/HotDashboard";

const DashboardAd = props => {
  return (
    <div className="dashboard-ad html2canvas-filter">
      <div className="dashboard-ad__left">
        <Recommend type="article" title="Top News" moreText="More" />
      </div>
      <div className="dashboard-ad__right">
        <HotDashboard limit={5} tags={props?.dashboard?.name?.split(" ")} />
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DashboardAd);
