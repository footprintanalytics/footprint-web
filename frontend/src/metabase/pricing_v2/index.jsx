/* eslint-disable curly */
/* eslint-disable react/prop-types */
import "./index.css";
import React, { useState } from "react";
import { connect } from "react-redux";
import { loginModalShowAction } from "metabase/redux/control";
import { getSubscribeOptions, getComparePlans } from "./config";
import { getOssUrl } from "metabase/lib/image";
import { Button, Checkbox, Modal } from "antd";
import { cancelSubscription, payProduct } from "metabase/new-service";
import PaymentCallbackModal from "metabase/pricing/compoment/PaymentCallbackModal";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const Pricing = ({ user, setLoginModalShow }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const sign = () => setLoginModalShow({ show: true, from: "handle_pay" });

  const onCancelSubscription = async () => {
    Modal.confirm({
      title: "Do you want to cancel automatic renewal?",
      icon: <ExclamationCircleOutlined />,
      confirmLoading: loading,
      onOk: async () => {
        setLoading(true);
        const productId = user.vipInfo.subscriptionProductId;
        await cancelSubscription({ productId });
        setLoading(false);
        location.reload();
      },
      onCancel: () => {},
    });
  };

  return (
    <div className="Pricing">
      <div className="Pricing__title">
        <h1>Plans & Pricing</h1>
        <p>
          Footprint is a one-stop analysis platform to visualize your discovery
          in blockchain data.
        </p>
      </div>
      <PricingModal
        user={user}
        sign={sign}
        visible={visible}
        onClose={() => setVisible(false)}
      />
      <PricingSelect
        user={user}
        onSign={sign}
        onSubscribe={() => setVisible(true)}
        onCancelSubscription={onCancelSubscription}
      />
      <PricingCompare />
    </div>
  );
};

const PricingModal = ({ user, sign, visible, onClose }) => {
  const subscribeOptions = getSubscribeOptions();
  const [options, setOptions] = useState(subscribeOptions);
  const [loading, setLoading] = useState(false);
  const [callback, setCallback] = useState(false);
  const [auto, setAuto] = useState(true);

  const onPay = async () => {
    if (!user?.id) {
      onClose();
      sign();
      return;
    }
    setLoading(true);
    try {
      const { productId } = options.find(item => item.selected);
      const paymentChannel = "stripe";
      const mode = auto ? "subscription" : "payment";
      const { paymentLink } = await payProduct({
        productId,
        paymentChannel,
        mode,
      });
      window.open(paymentLink);
    } catch (e) {
    } finally {
      setLoading(false);
      onClose();
      setCallback(true);
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        closable={false}
        footer={null}
        onCancel={onClose}
      >
        <div className="Pricing_modal">
          <h3>Plans & Pricing</h3>
          <ul>
            {options.map(item => (
              <li
                key={item.title}
                onClick={() => {
                  setOptions(
                    options.map(o => ({
                      ...o,
                      selected: item.title === o.title,
                    })),
                  );
                }}
              >
                <img
                  width={16}
                  height={16}
                  src={getOssUrl(
                    item.selected ? "20220722141632.png" : "20220722141653.png",
                  )}
                />
                <div className="Pricing_modal-option">
                  <h4>{item.title}</h4>
                  {!!item.yearlyPrice && (
                    <span>
                      {item.yearlyPrice} per month,{" "}
                      <i>saving {item.yearlySaving}</i>
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <Button type="primary" size="large" onClick={onPay} loading={loading}>
            Subscribe Now
          </Button>
          <Checkbox checked={auto} onChange={e => setAuto(e.target.checked)}>
            Automatic Renewal
          </Checkbox>
        </div>
      </Modal>
      {callback && <PaymentCallbackModal onClose={() => setCallback(false)} />}
    </>
  );
};

const PricingSelect = ({ user, onSign, onSubscribe, onCancelSubscription }) => {
  const comparePlans = getComparePlans(user);

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
                    onSubscribe();
                    break;
                  default:
                    break;
                }
              }}
            >
              {item.btnText}
            </Button>
            {!!item.yearlyPrice && !item.btnDisabled && (
              <span className="Pricing__select-btn-tip" onClick={onSubscribe}>
                or skip and <i>pay yearly now</i>
              </span>
            )}
            {item.yearlyPrice &&
              item.btnDisabled &&
              user?.vipInfo?.subscriptionProductId && (
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
        </div>
      ))}
    </div>
  );
};

const PricingCompare = () => {
  const comparePlans = getComparePlans();

  return (
    <div className="Pricing__compare">
      <div className="Pricing__compare-head">
        <h3>{comparePlans.title}</h3>
        {comparePlans.columns.map(item => (
          <h4 key={item.value}>{item.label}</h4>
        ))}
      </div>
      <div className="Pricing__compare-body">
        {comparePlans.list.map(item => (
          <div key={item.type} className="Pricing__compare-body-list">
            <h5>{item.type}</h5>
            <ul className="Pricing__compare-body-item">
              {item.list.map(l => (
                <li key={l.name}>
                  <h6>{l.name}</h6>
                  {comparePlans.columns.map(c => (
                    <section key={l.name + c.label}>
                      {l[c.value] === true && (
                        <img
                          src={getOssUrl("20220722115105.png")}
                          width={22}
                          height={16}
                        />
                      )}
                      {l[c.value] === false && (
                        <img
                          src={getOssUrl("20220722115336.png")}
                          width={20}
                          height={20}
                        />
                      )}
                      {typeof l[c.value] === "string" && (
                        <span>{l[c.value]}</span>
                      )}
                    </section>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        ))}
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

export default connect(mapStateToProps, mapDispatchToProps)(Pricing);
