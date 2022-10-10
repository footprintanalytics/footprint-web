/* eslint-disable react/prop-types */
import React from "react";
import Link from "metabase/components/Link";
import Button from "metabase/components/Button";
import { push } from "react-router-redux";
import { loginModalShowAction } from "metabase/redux/control";
import { connect } from "react-redux";

const DataApiButtons = ({
  user,
  setLoginModalShow,
  onChangeLocation,
  blandButtonText = "Try for free",
  showGetApiKeyHelp = false,
}) => {
  return (
    <div className="data-api__buttons">
      <div className="flex flex-column">
        <Button
          className="data-api__button-bland"
          onClick={() => {
            if (user) {
              onChangeLocation("/account/developer");
            } else {
              setLoginModalShow({ show: true, from: "Data api website" });
            }
          }}
        >
          {blandButtonText}
        </Button>
        {showGetApiKeyHelp && (
          <Link
            to="https://docs.footprint.network/guides/api/api"
            target="_blank"
            className="text-underline text-underline-hover mt1"
          >
            How to get API key?
          </Link>
        )}
      </div>
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
