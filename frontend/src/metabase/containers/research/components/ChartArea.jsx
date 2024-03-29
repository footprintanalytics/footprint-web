/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import NoDashboardData from "metabase/containers/research/components/NoDashboardData";
import PublicQuestion from "metabase/public/containers/PublicQuestion";
import "./DashboardArea.css";

const DashboardArea = props => {
  const { item, location } = props;
  const uuid = item && item.publicUuid;
  return (
    <React.Fragment>
      {uuid && (
        <PublicQuestion
          key={uuid}
          className="dashboard-area__public-dashboard"
          params={{ uuid }}
          location={location}
          isFullscreen={false}
          hideTitle={true}
          disableUpdateTitle={true}
          hideFooter
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
