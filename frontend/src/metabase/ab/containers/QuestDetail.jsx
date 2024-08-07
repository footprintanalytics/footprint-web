/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import PeaPage from "metabase/ab/containers/PeaPage";

const QuestDetail = props => {
  const {router, location, project} = props
  const host = "https://test.pea.ai/campaign/detail"
  const search = location.search || "campaign_id=66a9e9689e4ba70012c66c37&app_name=fga"
  const url = `${host}?${search}`
  return (
    <div style={{width: "100%"}}>
      <PeaPage
        router={router}
        location={location}
        url={url}
      />
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(QuestDetail);
