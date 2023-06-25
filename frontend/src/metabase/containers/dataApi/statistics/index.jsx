/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { loginModalShowAction } from "metabase/redux/control";
import { push } from "react-router-redux";
import DashboardArea from "metabase/containers/research/components/DashboardArea";
import "./index.css";

const Statistics = ({location}) => {
  const tempItem = {
    "label": "Market Overview",
    "value": "market-overview",
    "publicUuid": "5483cc23-c993-4257-9e05-06ae5ed5c26e",
  }
  return (
    <>
      <div className={"data-api__statistics"}>
        <h1>
          Data API Usage
        </h1>
        <DashboardArea location={location} item={tempItem} hideParameters="user_id" all_load={true}/>
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
