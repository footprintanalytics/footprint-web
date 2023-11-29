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
import BatchDownloadPrice from "metabase/pricing_v3/component/BatchDownloadPrice";

const PricingContainer = ({ location, user, setLoginModalShow }) => {
  const dataApiList = ["data-api", "data-api-before-0801"];

  const [loading, setLoading] = useState(false);
  const sign = () =>
    setLoginModalShow({ show: true, from: "handle_pay_data_api" });

  const [status, setStatus] = useState(location?.query?.type || "batch-download");

  const tabData = [
    {
      title: "Batch Download",
      value: "batch-download",
    },
    {
      title: "Footprint Analytics",
      value: "footprint",
    },
    {
      title: "Data API",
      value: "data-api",
    }
  ]


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
          <div className="flex flex-col" style={{ marginBottom: 40 }}>
            <div className="pricing-container__tabs">
              {tabData?.map(item => {
                return (
                  <Button
                    key={item.title}
                    className={`pricing-container__button-normal ${
                      status === item.value
                        ? "pricing-container__button-selected"
                        : ""
                    }`}
                    onClick={() => {
                      setStatus(item.value);
                      replaceQuery(`/pricing?type=${item.value}`);
                    }}
                  >
                    {item.title}
                  </Button>
                )
              })}
            </div>
          </div>
          {status === "batch-download" && (
            <BatchDownloadPrice />
          )}
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
