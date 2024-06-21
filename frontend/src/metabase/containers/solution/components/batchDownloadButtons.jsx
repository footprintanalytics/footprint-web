/* eslint-disable react/prop-types */
import React from "react";
import Link from "metabase/core/components/Link";
import Button from "metabase/core/components/Button";
import { push } from "react-router-redux";
import { loginModalShowAction } from "metabase/redux/control";
import { connect } from "react-redux";

const BatchDownloadButtons = ({
  user,
  setLoginModalShow,
  onChangeLocation,
  blandButtonText = "Schedule an Intro Call",
}) => {
  return (
    <div className="solution__buttons">
      <div className="flex flex-column">
        <Link
          target="_blank"
          href="https://calendly.com/partners-79/footprint-analytics-45mins"
        >
          <div className="solution__button-bland">{blandButtonText}</div>
        </Link>
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
  setLoginModalShow: loginModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(BatchDownloadButtons);
