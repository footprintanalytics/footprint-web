/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import "./index.css";
import { Button, Skeleton, Tooltip } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { push } from "react-router-redux";
import { connect } from "react-redux";
import { loginModalShowAction } from "metabase/redux/control";
import { loadCurrentUserVipDataApi } from "metabase/redux/user";
import {
  useGetPaymentSubscriptionDetail,
  useGetProductInfo,
} from "metabase/pricing_v2/use";
import PricingModal from "metabase/pricing_v2/components/PricingModal";
import PaymentCallbackModal from "metabase/pricing/compoment/PaymentCallbackModal";
import FgaPricingCompare from "./FgaPricingCompare"
import Meta from "metabase/components/Meta"

const Index = ({
  user,
  setLoginModalShow,
  onChangeLocation,
  location,
  router,
  sign,
  onCancelSubscription,
}) => {
  const [visible, setVisible] = useState();
  const [callback, setCallback] = useState(false);
  const { isLoading, data } = useGetProductInfo("dataApi");
  const { subscriptionDetailData } = useGetPaymentSubscriptionDetail(
    user,
    "dataApi",
  );
  const products = data?.groups?.find(item => item.type === visible)?.products;
  const subscriptionDetailList = subscriptionDetailData?.list;
  useEffect(() => {
    if (location?.pathname === "/data-api/pricing") {
      router?.replace("/pricing?type=data-api");
    }
  }, [location, router]);

  if (isLoading) {
    return (
      <div className="pricing-container__top m4">
        <Skeleton active />
      </div>
    );
  }

  const frontData = [
    {
      name: "Free",
      desc: "For star-up and mini projects",
      price: {
        amount: "$0",
      },
      boxBg: "",
      buttonText: "Get started for free",
      buttonCanClick:
        user?.vipInfo?.type !== "business" &&
        !["growth", "scale"].includes(user?.vipInfoDataApi?.type),
      buttonAction: e => {
        if (!user) {
          e.preventDefault();
          setLoginModalShow({
            show: true,
            redirect: "/growth",
            from: "Growth price free",
          });
          return;
        }
        onChangeLocation("/growth");
      },
      detail: {
        title: "Free access to:",
        content: [
          {
            title: (
              <span>
                <span className="data-api__price-text-highlight">5</span>{" "}
                Segments
              </span>
            ),
          },
          {
            title: (
              <span>
                <span className="data-api__price-text-highlight">5</span>{" "}
                Indicatiors to Filter Wallets
              </span>
            ),
          },
          {
            title: "Social Connect",
          },
          {
            title: "Activation Campaigns",
          },
          {
            title: "Project Analytics",
          },
          {
            title: "User Profile",
          },
          {
            title: "Social Members Analytics",
          },
        ],
      },
    },
    {
      name: "Growth",
      desc: "For mid-size projects",
      price: {
        amount: "$99",
        unit: (
          <span>
            <span style={{ textDecoration: "line-through" }}>{" 199"}</span>
            {"/month"}
          </span>
        ),
      },
      boxBg: "data-api__price-item-highlight",
      buttonText: "Get started",
      // buttonText: user?.vipInfoDataApi?.type === "growth" ? "Renewal" : "Get started",
      buttonAction: e => {
        if (!user) {
          e.preventDefault();
          setLoginModalShow({
            show: true,
            redirect: "/growth/pricing",
            from: "Growth price growth",
          });
          return;
        }
        setVisible("growth");
        // window.open("https://forms.gle/ze3F44681h2wgCHT9");
      },
      // currentSubscriptionProductId: getCurrentSubscriptionProductId({ subscriptionDetailList, service: "dataApi", groupType: "growth" }),
      // isSubscribe: isStripeSubscribe({ subscriptionDetailList, service: "dataApi", groupType: "growth" }),
      // buttonCanClick:
      //   !isStripeSubscribe({ subscriptionDetailList, service: "dataApi", groupType: "growth" })
      //   && !["scale"].includes(user?.vipInfoDataApi?.type),
      buttonCanClick: false,
      popular: true,
      detail: {
        title: "Everything in Free, plus:",
        content: [
          {
            title: (
              <span>
                <span className="data-api__price-text-highlight">20</span>{" "}
                Segments
              </span>
            ),
          },
          {
            title: (
              <span>
                <span className="data-api__price-text-highlight">2</span> Team
                Seats
              </span>
            ),
          },
          {
            title: (
              <span>
                <span className="data-api__price-text-highlight">10</span>{" "}
                Indicatiors to Filter Wallets
              </span>
            ),
          },
          {
            title: "Export Wallet Tags & Features",
          },
          {
            title: "Bot Detection ",
          },
          {
            title: "Social Engagement Analytics",
          },
          {
            title: "User Segmentation",
          },
          {
            title: "Tokenomics ",
          },
          {
            title: "Reveune Analytics",
          },
        ],
      },
    },
    {
      name: "Scale",
      desc: "For lager projects",
      price: {
        amount: "$999",
        unit: "/month",
      },
      boxBg: "data-api__price-item-second",
      buttonText: "Get started",
      // buttonText: user?.vipInfoDataApi?.type === "scale" ? "Renewal" : "Get started",
      buttonAction: e => {
        if (!user) {
          e.preventDefault();
          setLoginModalShow({
            show: true,
            redirect: "/growth/pricing?type=data-api",
            from: "Data api price scale",
          });
          return;
        }
        setVisible("scale");
        // window.open("https://forms.gle/ze3F44681h2wgCHT9");
      },
      // currentSubscriptionProductId: getCurrentSubscriptionProductId({ subscriptionDetailList, service: "dataApi", groupType: "scale" }),
      // isSubscribe: isStripeSubscribe({ subscriptionDetailList, service: "dataApi", groupType: "scale" }),
      // buttonCanClick: !isStripeSubscribe({ subscriptionDetailList, service: "dataApi", groupType: "scale" }),
      buttonCanClick: false,
      detail: {
        title: "Everything in Growth plan, plus:",
        content: [
          {
            title: (
              <span>
                <span className="data-api__price-text-highlight">100</span>{" "}
                Segments
              </span>
            ),
          },
          {
            title: (
              <span>
                <span className="data-api__price-text-highlight">5</span> Team
                Seats
              </span>
            ),
          },
          {
            title: (
              <span>
                <span className="data-api__price-text-highlight">50</span>{" "}
                Indicatiors to Filter Wallets
              </span>
            ),
          },
          {
            title: (
              <span>
                Support Data integration
              </span>
            ),
          },
          {
            title: "Channel Analytics",
          },
          {
            title: "Comparison Analytics",
          },
          {
            title: "Web3 Campaign Analytics",
          },
          {
            title: "Drill Down Analytics",
          },
          {
            title: "Custom Analytics",
          },
        ],
      },
    },
    {
      name: "Enterprise",
      desc: "Contact us to find the right solution for your business",
      price: {
        amount: "Custom",
      },
      buttonText: "Talk to us",
      buttonAction: e => {
        window.open("https://forms.gle/ze3F44681h2wgCHT9");
      },
      buttonCanClick: true,
      boxBg: "data-api__price-item-last",
      detail: {
        title: "Everything in Scale plan, plus:",
        content: [
          {
            title: (
              <span>
                <span className="data-api__price-text-highlight">
                  Unlimited
                </span>{" "}
                Segments
              </span>
            ),
          },
          {
            title: (
              <span>
                <span className="data-api__price-text-highlight">
                  Unlimited
                </span>{" "}
                Integrations
              </span>
            ),
          },
          {
            title: (
              <span>
                <span className="data-api__price-text-highlight">
                  Unlimited
                </span>{" "}
                Indicatiors to Filter Wallets
              </span>
            ),
          },
          {
            title: "Customized Team Seats",
          },

          {
            title: "Customized Analytics",
          },
        ],
      },
    },
  ];
  return (
    <>
      <Meta title={`Pricing - Footprint Growth Analytics`} />
        <div className="pricing-container__top mt-10">
          <h1 style={{fontSize:54}}>{"Plans & Pricing"}</h1>
          <p style={{fontSize:18,color:'white'}}>
            Footprint Growth Analytics is an on-chain data platform which
            provides growth analytics tool.
          </p>
        </div>
      <div className="data-api__price data-api__price-bg">
        {/*<h1>Developer-first API Pricing Plan</h1>*/}
        {/*<h2>Simple , flexible pricing for companies and developers</h2>*/}
        <ul className="data-api__price-box">
          {frontData.map(item => {
            return (
              <li
                className={`data-api__price-item ${item.boxBg || ""}`}
                key={item.name}
              >
                {item.popular && (
                  <span className="data-api__price-item-Popular">
                    Most Popular
                  </span>
                )}
                <h3>{item.name}</h3>
                <span className="data-api__price-desc">{item.desc}</span>
                <div className="data-api__price-amount">
                  <span className="data-api__price-amount-text">
                    {item.price.amount}
                  </span>
                  <span className="data-api__price-amount-unit">
                    {item.price.unit}
                  </span>
                </div>
                <Button
                  className="data-api__price-button"
                  disabled={!item.buttonCanClick}
                  onClick={item.buttonAction}
                  type="primary"
                  block
                  size="large"
                  target="_blank"
                >
                  {item.buttonText}
                </Button>
                {item.isSubscribe && (
                  <span
                    className="Pricing__select-btn-tip"
                    onClick={() =>
                      onCancelSubscription(item.currentSubscriptionProductId)
                    }
                  >
                    <i>{`Cancel ${item.name} Automatic Renewal`}</i>
                  </span>
                )}
                <span className="data-api__price-detail-title">
                  {item.detail.title}
                </span>
                <ul className="data-api__price-detail-content">
                  {item.detail.content.map((obj, index) => {
                    return (
                      <li
                        className={`data-api__price-detail-content-item ${
                          obj.url
                            ? "data-api__price-detail-content-item-url"
                            : ""
                        }`}
                        key={index}
                        onClick={() => {
                          if (obj.open) {
                            window.open(obj.url);
                          } else {
                            onChangeLocation(obj.url);
                          }
                        }}
                      >
                        <span style={{ flex: 1, display: "flex" }}>
                          <span>{obj.title}</span>
                          {obj.comingSoon && (
                            <div className="data-api__price-item-powerful">
                              Coming Soon
                            </div>
                          )}
                          {obj.powerful && (
                            <div className="data-api__price-item-powerful">
                              Powerful
                            </div>
                          )}
                        </span>
                        {obj.url && (
                          <RightOutlined
                            className="ml1"
                            style={{ color: "#00aaff" }}
                          />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>

      </div>
      <div className="w-full px4"><FgaPricingCompare  user={user}></FgaPricingCompare></div>

      {products && products.length > 0 && (
        <PricingModal
          user={user}
          sign={sign}
          subscribeOptions={products}
          visible={!!products}
          setCallback={setCallback}
          onClose={() => setVisible(null)}
        />
      )}
      {callback && <PaymentCallbackModal onClose={() => setCallback(false)} />}
    </>
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
  loadCurrentUserVipDataApi,
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
