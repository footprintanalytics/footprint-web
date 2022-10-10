/* eslint-disable react/prop-types */
import React from "react";
import Link from "metabase/components/Link";
import Button from "metabase/components/Button";
import { push } from "react-router-redux";
import { loginModalShowAction } from "metabase/redux/control";
import { connect } from "react-redux";

const DataApiButtons = ({ user, setLoginModalShow, onChangeLocation, blandButtonText = "Try for free" }) => {
  return (
    <div className="data-api__buttons">
      <Link
        to="mailto:sales@footprint.network"
        target="_blank"
        // onClick={() => {
        //   if (user) {
        //     onChangeLocation("/account/developer")
        //   } else {
        //     setLoginModalShow({ show: true, from: "Data api website" });
        //   }
        // }}
      >
        <Button className="data-api__button-bland">{blandButtonText}</Button>
      </Link>
      <Link to="https://fp-api.readme.io/reference/welcome" target="_blank">
        <Button className="data-api__button-white">View Documentation</Button>
      </Link>
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
  setLoginModalShow: loginModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(DataApiButtons);
