/* eslint-disable react/prop-types */
import React from "react";
import { getComparePlans } from "metabase/pricing_v2/config";
import { getOssUrl } from "metabase/lib/image";
import { Button } from "antd";

const PricingSelect = ({ user, onSign, onSubscribe, onCancelSubscription, groups }) => {
  const canBusinessSevenTrial = !!groups?.find(group => group.type === "business")?.products
    ?.find(product => product.category === "7-trial");
  const comparePlans = getComparePlans(user, canBusinessSevenTrial);

  return (
    <div className="Pricing__select">
      {comparePlans.columns.map(item => (
        <div key={item.value} className="Pricing__select-item">
          <h2>{item.label}</h2>
          <p>{item.desc}</p>
          <div className="Pricing__select-price">
            <div className="Pricing__select-price-main">
              <b>{item.price}</b>
              {!!item.unit && <small>/{item.unit}</small>}
            </div>
            {!!item.yearlyPrice && (
              <span className="Pricing__select-price-sub">
                {item.yearlyPrice} if pay yearly,{" "}
                <i>saving {item.yearlySaving}</i>
              </span>
            )}
          </div>
          <div className="Pricing__select-btn">
            <Button
              type="primary"
              block
              size="large"
              href={item.btnLink}
              target="_blank"
              disabled={item.btnDisabled}
              onClick={() => {
                switch (item.btnAction) {
                  case "sign":
                    onSign();
                    break;
                  case "subscribe":
                    onSubscribe(item);
                    break;
                  default:
                    break;
                }
              }}
            >
              {item.btnText}
            </Button>
            {!!item.yearlyPrice && !item.btnDisabled && (
              <span className="Pricing__select-btn-tip" onClick={() => onSubscribe(item)}>
                or skip and <i>pay yearly now</i>
              </span>
            )}
            {item.yearlyPrice &&
              item.btnDisabled &&
              user?.stripeSubscribeStatus === "enable" && (
                <span
                  className="Pricing__select-btn-tip"
                  onClick={onCancelSubscription}
                >
                  <i>Cancel Automatic Renewal</i>
                </span>
              )}
          </div>
          <ul className="Pricing__select-features">
            {item.features.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="Pricing__select-benefits">
            <h3>{item.benefits.title}</h3>
            <ul>
              {item.benefits.list.map(item => (
                <li key={item}>
                  <img
                    src={getOssUrl("20220722115105.png")}
                    width={16}
                    height={12}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {item.dataApi && (
            <div className="Pricing__select-data-api">
              <h3>{item.dataApi.title}</h3>
              <ul>
                {item.dataApi.list.map(item => (
                  <li key={item}>
                    <img
                      src={getOssUrl("20220722115105.png")}
                      width={16}
                      height={12}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PricingSelect;
