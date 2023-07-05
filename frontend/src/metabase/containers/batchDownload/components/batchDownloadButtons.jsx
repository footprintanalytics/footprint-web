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
  blandButtonText = "Contact sales",
  secondButtonText = "Data dictionary",
  secondButtonLink = "https://docs.footprint.network/@Footprint/Footprint-Datasets-Data-Dictionary",
  showGetApiKeyHelp = false,
}) => {
  return (
    <div className="batch-download__buttons">
      <div className="flex flex-column">
        <Link
          target="_blank"
          href="mailto:sales@footprint.network"
        >
          <Button className="batch-download__button-bland">{blandButtonText}</Button>
        </Link>
        {showGetApiKeyHelp && (
          <Link
            to="https://docs.footprint.network/guides/api/api"
            target="_blank"
            className="text-underline text-underline-hover mt1"
            style={{ width: "fit-content" }}
          >
            How to get API key?
          </Link>
        )}
      </div>
      <Link to={secondButtonLink} target="_blank" style={{ width: "fit-content" }}>
        <Button className="batch-download__button-black">{secondButtonText}</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(BatchDownloadButtons);
