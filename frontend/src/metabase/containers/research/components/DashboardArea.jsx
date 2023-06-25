/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import NoDashboardData from "metabase/containers/research/components/NoDashboardData";
import PublicDashboard from "metabase/public/containers/PublicDashboard";
import "./DashboardArea.css";

const DashboardArea = props => {
  const { item, location, hideParameters, all_load } = props;
  const uuid = item && item.publicUuid;

  return (
    <React.Fragment>
      {uuid && (
        <PublicDashboard
          key={uuid}
          className="dashboard-area__public-dashboard"
          innerClassName="dashboard-area__public-dashboard-inner"
          params={{ uuid }}
          location={location}
          isFullscreen={false}
          hideTitle={true}
          disableUpdateTitle={true}
          hideFooter
          hideParametersOuter={hideParameters}
          allLoadOuter={all_load}
          ignoreCache={true}
        />
      )}
      {!uuid && <NoDashboardData />}
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(DashboardArea);
