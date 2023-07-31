/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import DeveloperApp from "metabase/account/developer/containers/DeveloperApp/DeveloperApp";
import "./MyApi.css";
import Statistics from "metabase/containers/dataApi/statistics";
import StudioTitle from "metabase/containers/myStudio/Component/StudioTitle";

const MyApi = props => {
  const { location, showUsage, showApiKey } = props;
  return (
    <>
      <div className={"my-api"}>
        {showApiKey && (
          <div className="my-api__developer">
            <StudioTitle title="Data API Key" />
            <div className="my-api__developer-app">
              <DeveloperApp />
            </div>
          </div>
        )}
        {showUsage && (
          <>
            <StudioTitle title="Data API Usage" />
            <Statistics location={location}/>
          </>
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
