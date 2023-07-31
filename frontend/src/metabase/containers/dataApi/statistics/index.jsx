/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { loginModalShowAction } from "metabase/redux/control";
import DashboardArea from "metabase/containers/research/components/DashboardArea";
import "./index.css";

const Statistics = ({ location, user, setLoginModalShow }) => {
  const tempItem = {
    "label": "Market Overview",
    "value": "market-overview",
    "publicUuid": "5483cc23-c993-4257-9e05-06ae5ed5c26e",
  }

  React.useEffect(() => {
    if (!user) {
      setLoginModalShow({ show: true, from: "Data API Statistics" });
    }
  }, [setLoginModalShow, user])

  if (!user) {
    return (
      <div className={"data-api__statistics"}>
        <h3 className="text-centered">Please login to view this page.</h3>
      </div>
    )
  }

  return (
    <>
      <div className={"data-api__statistics"}>
        <DashboardArea location={location} item={tempItem} hideParameters="user_id" all_load={true} isDataApiStatistics={true}/>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  user: state.currentUser,
});

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
  onChangeLocation: push,
};

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);
