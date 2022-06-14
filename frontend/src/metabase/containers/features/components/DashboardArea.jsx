/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import PublicDashboard from "metabase/guest/Dashboard";
import NoDashboardData from "metabase/containers/features/components/NoDashboardData";

const DashboardArea = props => {
  const { item, user, location } = props;
  const uuid = item && item.publicUuid;
  const showEditButton =
    item && user && (user.id === item.creatorId || user.is_superuser);

  return (
    <React.Fragment>
      {uuid && (
        <PublicDashboard
          location={location}
          dashboardId={uuid}
          showEditButton={showEditButton}
          featuresMode={true}
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
