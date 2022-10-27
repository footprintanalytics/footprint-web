/* eslint-disable curly */
/* eslint-disable react/prop-types */
import "./index.css";
import React, { useEffect, useState } from "react";
import Pricing from "metabase/pricing_v2";
import DataApiPricing from "metabase/containers/dataApi/price/index";
import Button from "metabase/components/Button";
import { browserHistory } from "react-router";

const PricingContainer = ({ location }) => {
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
        {status === "data-api" && <DataApiPricing />}
      </div>
    </div>
  );
};

export default PricingContainer;
