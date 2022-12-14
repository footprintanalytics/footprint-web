/* eslint-disable curly */
/* eslint-disable react/prop-types */
import "./index.css";
import React, { useEffect, useState } from "react";
import Pricing from "metabase/pricing_v2";
import DataApiPricing from "metabase/containers/dataApi/price/index";
import Button from "metabase/components/Button";
import { browserHistory } from "react-router";
import PricingModal from "metabase/pricing_v2/components/PricingModal";
import { loginModalShowAction } from "metabase/redux/control";
import { connect } from "react-redux";
import { getDataApiSubscribeOptions } from "metabase/pricing_v3/config";

const PricingContainer = ({ location, user, setLoginModalShow }) => {
  const [subscribeOptions, setSubscribeOptions] = useState(null);

  const sign = () =>
    setLoginModalShow({ show: true, from: "handle_pay_data_api" });

  const [status, setStatus] = useState(location?.query?.type || "footprint");
  useEffect(() => {
    if (location?.query?.type) {
      setStatus(location?.query?.type);
    }
  }, [location?.query]);

  const replaceQuery = pathname => {
    browserHistory &&
      browserHistory.getCurrentLocation() &&
      history.replaceState(null, document.title, pathname);
  };

  return (
    <div className="pricing-container">
      {subscribeOptions && (
        <PricingModal
          user={user}
          sign={sign}
          subscribeOptions={subscribeOptions}
          visible={!!subscribeOptions}
          onClose={() => setSubscribeOptions(null)}
        />
      )}
      <div className="pricing-container__bg" />
      <div className="pricing-container__top">
        <h1>{"Plans & Pricing"}</h1>
        <p>
          Footprint Analytics is an on-chain data platform which provides
          analytics tool and unified API.
        </p>
        <div className="pricing-container__tabs">
          <Button
            className={`pricing-container__button-normal ${
              status === "footprint" ? "pricing-container__button-selected" : ""
            }`}
            onClick={() => {
              setStatus("footprint");
              replaceQuery(`/pricing?type=footprint`);
            }}
          >
            Footprint Analytics
          </Button>
          <Button
            className={`pricing-container__button-normal ${
              status === "data-api" ? "pricing-container__button-selected" : ""
            }`}
            onClick={() => {
              setStatus("data-api");
              replaceQuery(`/pricing?type=data-api`);
            }}
          >
            Data API
          </Button>
        </div>
        {status === "footprint" && <Pricing />}
        {status === "data-api" && (
          <DataApiPricing
            onSubscribe={mode => {
              setSubscribeOptions(getDataApiSubscribeOptions(user, mode));
            }}
          />
        )}
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
  setLoginModalShow: loginModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(PricingContainer);
