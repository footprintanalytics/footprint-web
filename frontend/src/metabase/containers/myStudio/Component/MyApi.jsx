/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import DeveloperApp from "metabase/account/developer/containers/DeveloperApp/DeveloperApp";
import "./MyApi.css";
import Statistics from "metabase/containers/dataApi/statistics";

const MyApi = props => {
  const { location, showUsage, showApiKey } = props;
  return (
    <>
      <div className={"my-api"}>
        {showApiKey && (
          <div className="my-api__developer">
            <h2>Data API Key</h2>
            <div className="my-api__developer-app">
              <DeveloperApp />
            </div>
          </div>
        )}
        {showUsage && (
          <Statistics location={location}/>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: state.currentUser,
  };
};

export default connect(mapStateToProps)(MyApi);
