/* eslint-disable react/prop-types */

import React, { useEffect, useState } from "react";
import { Box, Flex } from "grid-styled";
import { connect } from "react-redux";
import Button from "metabase/components/Button";
import Icon from "metabase/components/Icon";
import Switch from "react-switch";
import { Divider, message } from "antd";
import { getProductInfo, payMethods, payProduct } from "metabase/new-service";
import { isBoolean, get } from "lodash";
import cx from "classnames";
import "./index.css";
import { loginModalShowAction } from "metabase/redux/control";
import { getOssUrl } from "metabase/lib/image";
import PaymentModal from "metabase/pricing/compoment/PaymentModal";
import PaymentCallbackModal from "metabase/pricing/compoment/PaymentCallbackModal";
import { trackStructEvent } from "metabase/lib/analytics";
import Link from "metabase/components/Link";

const Pricing = props => {
  const s_Tabs = {
    MONTHLY: "monthly",
    YEARLY: "yearly",
  };

  const { user, setLoginModalShow } = props;
  const [priceTab, setPriceTab] = useState(s_Tabs.YEARLY);
  const [data, setData] = useState();
  const [currentItem, setCurrentItem] = useState();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentCallbackModal, setShowPaymentCallbackModal] = useState(
    false,
  );
  const [paymentMethods, setPaymentMethods] = useState();
  const priceList = data ? data[priceTab] : [];
  const basicFunction = secondFunc(get(priceList, "0"), user);
  const advanceFunction = firstFunc(get(priceList, "0"), user);
  const userId = user && user.id;

  const paymentOptions = [
    { name: "With Fiat", value: "stripe", recommend: "No gas fee" },
    { name: "With Crypto", value: "coinbase" },
  ];

  useEffect(() => {
    const fetchPriceList = async () => {
      const res = await getProductInfo();
      setData(res);
    };
    fetchPriceList();
  }, [userId]);

  useEffect(() => {
    if (showPaymentModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [showPaymentModal]);

  const handlePay = async (item, paymentChannel, payCurrency) => {
    if (!item.canPay) {
      return;
    }
    const hide = message.loading("Loading...", 0);
    try {
      const { paymentLink } = await payProduct({
        productId: item.id,
        paymentChannel: paymentChannel,
        payCurrency: payCurrency,
      });
      window.open(paymentLink);
    } catch (e) {
    } finally {
      hide();
      setShowPaymentCallbackModal(true);
    }
  };

  const renderPaymentModel = () => {
    return (
      <PaymentModal
        options={paymentOptions}
        item={currentItem}
        paymentMethods={paymentMethods}
        pay={({ paymentChannel, payCurrency }) => {
          handlePay(currentItem, paymentChannel, payCurrency);
          setShowPaymentModal(false);
        }}
        onClose={() => setShowPaymentModal(false)}
      />
    );
  };

  const FunctionView = () => {
    return (
      <div className="function-view">
        {advanceFunction.map(item => (
          <span
            key={item.title}
            className="function-view__item footprint-primary-text"
          >
            {item.title}
          </span>
        ))}
        <Divider />
        <Box mt={30} />
        {basicFunction.map(item => (
          <span key={item.title} className="function-view__item">
            {item.title}
          </span>
        ))}
      </div>
    );
  };

  const payMethodsApi = async item => {
    const hide = message.loading("Loading...", 0);
    try {
      const { paymentMethods } = await payMethods({ productId: item.id });
      setPaymentMethods(paymentMethods);
    } finally {
      hide();
    }
  };

  const payOnClick = async item => {
    trackStructEvent("pricing click pay");
    if (!user) {
      setLoginModalShow({ show: true, from: `handle_pay` });
      return;
    }
    setCurrentItem(item);
    await payMethodsApi(item);
    setShowPaymentModal(true);
  };

  const showContactUs = item => {
    return item?.title === "Data API (Download Data)";
  };

  const renderContactUs = () => {
    return (
      <Link
        to="mailto:sales@footprint.network"
        target="_blank"
        style={{
          width: 80,
          textAlign: "center",
          margin: "4px auto",
          color: "#3434b2",
        }}
      >
        Contact Us
      </Link>
    );
  };

  const renderIcon = item => {
    return (
      <Icon
        name={item.value ? "check" : "close"}
        size={14}
        color={item.value ? "#3434b2" : "#AAAAAA"}
      />
    );
  };

  return (
    <div style={{ background: "#ffffff", padding: "20px 0" }}>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        className="page"
      >
        <h1 className="page__title footprint-title1">Pricing</h1>
        <span className="page__sub-title footprint-primary-text">
          Footprint is a one-stop analysis platform to visualize your discovery
          in blockchain data.
        </span>
        <Flex alignItems="center" className="page__tab footprint-title1">
          <span
            className={cx("page__tab-item", {
              "page__tab-item_light": priceTab === s_Tabs.MONTHLY,
            })}
          >
            Monthly
          </span>
          <Switch
            // offColor="#3434b2"
            onColor="#3434b2"
            uncheckedIcon={false}
            checkedIcon={false}
            checked={priceTab === s_Tabs.YEARLY}
            onChange={checked => {
              setPriceTab(checked ? s_Tabs.YEARLY : s_Tabs.MONTHLY);
            }}
          />
          <span
            className={cx("page__tab-item", {
              "page__tab-item_light": priceTab === s_Tabs.YEARLY,
            })}
          >
            Yearly
          </span>
          {data && data.yearlySaving && (
            <span className="page__tab-item_mark footprint-primary-text">
              {data.yearlySaving}
            </span>
          )}
        </Flex>
        {data && (
          <Flex>
            <FunctionView />
            {priceList.map(item => (
              <div
                key={item.id}
                className={cx("list-item", {
                  "list-item__light": item.isRecommend,
                })}
              >
                {item.isCurrent
                  ? item.vipValidEndDate && (
                      <div className="list-item__expired">
                        <span>{item.vipValidEndDate}</span>
                      </div>
                    )
                  : item.isRecommend && (
                      <img
                        src={getOssUrl("20210727193715.png")}
                        className="list-item__recommend"
                      />
                    )}
                <Flex flexDirection="column" justifyContent="center">
                  <p className="list-item__title footprint-title1">
                    {item.name}
                  </p>
                  {item.monthlyPrice >= 0 ? (
                    <div className="list-item__amount">
                      <b className="list-item__amount-price footprint-title1">
                        ${item.monthlyPrice}
                      </b>
                      <span className="list-item__amount-text footprint-secondary-text1">
                        /{item.unit}
                      </span>
                    </div>
                  ) : (
                    <span className="list-item__amount-soon">SOON</span>
                  )}
                  <span className="list-item__desc footprint-primary-text">
                    {item.desc}
                  </span>
                  <Button
                    disabled={!item.canPay}
                    primary={item.canPay}
                    className={cx({
                      "normal-button": !item.isRecommend,
                    })}
                    onClick={() => payOnClick(item)}
                  >
                    {item.buttonText}
                  </Button>
                  <Box mt={60} />
                  {firstFunc(item, user).map(n => (
                    <Flex
                      key={n.title}
                      justifyContent="center"
                      alignItems="center"
                      className="access-list-item footprint-primary-text"
                    >
                      {isBoolean(n.value) ? (
                        showContactUs(n) && !n.value ? (
                          renderContactUs()
                        ) : (
                          renderIcon(n)
                        )
                      ) : (
                        <span>{n.value}</span>
                      )}
                    </Flex>
                  ))}
                  <Divider />
                  <Box mt={30} />
                  {secondFunc(item, user).map(n => (
                    <Flex
                      key={n.title}
                      justifyContent="center"
                      alignItems="center"
                      className="access-list-item footprint-primary-text"
                    >
                      {isBoolean(n.value) ? (
                        <Icon
                          name={n.value ? "check" : "close"}
                          size={14}
                          color={n.value ? "#3434b2" : "#AAAAAA"}
                        />
                      ) : (
                        <span>{n.value}</span>
                      )}
                    </Flex>
                  ))}
                  {item.canPay && (
                    <Button
                      primary={item.canPay}
                      className={cx({
                        "normal-button": !item.isRecommend,
                      })}
                      onClick={() => payOnClick(item)}
                    >
                      {item.buttonText}
                    </Button>
                  )}
                </Flex>
              </div>
            ))}
          </Flex>
        )}
      </Flex>
      {showPaymentModal && renderPaymentModel()}
      {showPaymentCallbackModal && (
        <PaymentCallbackModal
          onClose={() => setShowPaymentCallbackModal(false)}
        />
      )}
    </div>
  );
};

const firstFunc = (obj, user) => {
  if (!obj) {
    return [];
  }

  if (user) {
    return obj.advanceFunction;
  }

  return obj.basicFunction;
};

const secondFunc = (obj, user) => {
  if (!obj) {
    return [];
  }

  if (user) {
    return obj.basicFunction;
  }

  return obj.advanceFunction;
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
