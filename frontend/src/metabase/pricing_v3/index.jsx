/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Pricing from "metabase/pricing_v2";
import DataApiPricing from "metabase/containers/dataApi/price/index";
import Button from "metabase/core/components/Button";
import { loginModalShowAction } from "metabase/redux/control";
import { cancelSubscription } from "metabase/new-service";
import "./index.css";
import Meta from "metabase/components/Meta";

const PricingContainer = ({ location, user, setLoginModalShow }) => {
  const dataApiList = ["data-api", "data-api-before-0801"];

  const [loading, setLoading] = useState(false);
  const sign = () =>
    setLoginModalShow({ show: true, from: "handle_pay_data_api" });

  const [status, setStatus] = useState(location?.query?.type || "data-api");
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

  const onCancelSubscription = async productId => {
    Modal.confirm({
      title: "Do you want to cancel automatic renewal?",
      icon: <ExclamationCircleOutlined />,
      confirmLoading: loading,
      onOk: async () => {
        setLoading(true);
        await cancelSubscription({ productId });
        setLoading(false);
        // slack([{ label: "Cancel Subscription", value: user?.email }]);
        window.location.reload();
      },
      onCancel: () => {},
    });
  };

  return (
    <>
      <Meta title={`Pricing - Footprint Analytics`} />
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
                status === "footprint"
                  ? "pricing-container__button-selected"
                  : ""
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
                dataApiList.includes(status)
                  ? "pricing-container__button-selected"
                  : ""
              }`}
              onClick={() => {
                setStatus("data-api");
                replaceQuery(`/pricing?type=data-api`);
              }}
            >
              Data API
            </Button>
          </div>
          {status === "footprint" && (
            <Pricing onCancelSubscription={onCancelSubscription} />
          )}
          {dataApiList.includes(status) && (
            <DataApiPricing
              sign={sign}
              onCancelSubscription={onCancelSubscription}
              status={status}
            />
          )}
        </div>
      </div>
    </>
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
