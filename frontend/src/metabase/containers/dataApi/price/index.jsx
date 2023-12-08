/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import "./index.css";
import { Button, Skeleton, Tooltip } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { push } from "react-router-redux";
import { connect } from "react-redux";
import { loginModalShowAction } from "metabase/redux/control";
import Link from "metabase/core/components/Link";
import { loadCurrentUserVipDataApi } from "metabase/redux/user";
import {
  useGetPaymentSubscriptionDetail,
  useGetProductInfo,
} from "metabase/pricing_v2/use";
import PricingModal from "metabase/pricing_v2/components/PricingModal";
import {
  getCurrentSubscriptionProductId,
  isStripeSubscribe,
} from "metabase/pricing_v2/helper";
import PaymentCallbackModal from "metabase/pricing/compoment/PaymentCallbackModal";
import Icon from "metabase/components/Icon";
import DataStaticTooltip from "metabase/containers/dataApi/components/DataStaticTooltip";

const Index = ({
  user,
  setLoginModalShow,
  onChangeLocation,
  location,
  router,
  sign,
  onCancelSubscription,
  status,
}) => {
  const isBefore0801 = status === "data-api-before-0801";

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
      <div className="Pricing" style={{ width: 1200 }}>
        <Skeleton active />
      </div>
    );
  }

  const frontData = isBefore0801
    ? [
        {
          name: "Free",
          desc: "Best for getting started \nwith Web3",
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
                redirect: "/account/developer",
                from: "Data api price free",
              });
              return;
            }
            onChangeLocation("/account/developer");
          },
          detail: {
            title: "Free access to:",
            content: [
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">3K</span>{" "}
                    calls per month
                  </span>
                ),
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">100</span>{" "}
                    calls per day
                  </span>
                ),
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">1</span>{" "}
                    calls per second
                  </span>
                ),
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">
                      30 days
                    </span>{" "}
                    historical data
                  </span>
                ),
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">1</span>{" "}
                    rows data return (static endpoint)
                    <DataStaticTooltip />
                  </span>
                ),
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">100</span>{" "}
                    rows data return (non-static endpoint)
                  </span>
                ),
              },
              {
                title: "Normal performance",
              },
              {
                title: "Community support",
              },
              {
                title: "REST API: Easy to access",
              },
            ],
          },
        },
        {
          name: "Growth",
          desc: "Best for growing teams or developers",
          price: {
            amount: "$79",
            unit: "/month",
          },
          boxBg: "data-api__price-item-second",
          buttonText:
            user?.vipInfoDataApi?.type === "growth" ? "Renewal" : "Get started",
          buttonAction: e => {
            if (!user) {
              e.preventDefault();
              setLoginModalShow({
                show: true,
                redirect: "/pricing?type=data-api",
                from: "Data api price growth",
              });
              return;
            }
            setVisible("growth");
            // window.open("https://forms.gle/ze3F44681h2wgCHT9");
          },
          currentSubscriptionProductId: getCurrentSubscriptionProductId({
            subscriptionDetailList,
            service: "dataApi",
            groupType: "growth",
          }),
          isSubscribe: isStripeSubscribe({
            subscriptionDetailList,
            service: "dataApi",
            groupType: "growth",
          }),
          buttonCanClick:
            !isStripeSubscribe({
              subscriptionDetailList,
              service: "dataApi",
              groupType: "growth",
            }) && !["scale"].includes(user?.vipInfoDataApi?.type),
          detail: {
            title: "Everything in Free plan, plus:",
            content: [
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">300K</span>{" "}
                    calls per month
                  </span>
                ),
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">
                      10000
                    </span>{" "}
                    calls per day
                  </span>
                ),
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">10</span>{" "}
                    calls per second
                  </span>
                ),
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">
                      6 months
                    </span>{" "}
                    historical data
                  </span>
                ),
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">10</span>{" "}
                    rows data return (static endpoint)
                    <DataStaticTooltip />
                  </span>
                ),
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">100</span>{" "}
                    rows data return (non-static endpoint)
                  </span>
                ),
              },
              {
                title: "Quick performance",
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">
                      24hrs
                    </span>{" "}
                    support response time
                  </span>
                ),
              },
            ],
          },
        },
        {
          name: "Scale",
          desc: "For professional teams working in blockchain",
          price: {
            amount: "$360",
            unit: "/month",
          },
          boxBg: "data-api__price-item-highlight",
          buttonText:
            user?.vipInfoDataApi?.type === "scale" ? "Renewal" : "Get started",
          buttonAction: e => {
            if (!user) {
              e.preventDefault();
              setLoginModalShow({
                show: true,
                redirect: "/pricing?type=data-api",
                from: "Data api price scale",
              });
              return;
            }
            setVisible("scale");
            // window.open("https://forms.gle/ze3F44681h2wgCHT9");
          },
          currentSubscriptionProductId: getCurrentSubscriptionProductId({
            subscriptionDetailList,
            service: "dataApi",
            groupType: "scale",
          }),
          isSubscribe: isStripeSubscribe({
            subscriptionDetailList,
            service: "dataApi",
            groupType: "scale",
          }),
          buttonCanClick: !isStripeSubscribe({
            subscriptionDetailList,
            service: "dataApi",
            groupType: "scale",
          }),
          popular: true,
          detail: {
            title: "Everything in Growth plan, plus:",
            content: [
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">10M</span>{" "}
                    calls per month
                  </span>
                ),
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">10M</span>{" "}
                    calls per day
                  </span>
                ),
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">50</span>{" "}
                    calls per second
                  </span>
                ),
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">Full</span>{" "}
                    historical data
                  </span>
                ),
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">10</span>{" "}
                    rows data return (static endpoint){" "}
                    <DataStaticTooltip type="scale" />
                  </span>
                ),
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">100</span>{" "}
                    rows data return (non-static endpoint)
                  </span>
                ),
              },
              {
                title: "Quicker performance",
              },
              {
                title: "Dedicated account manager",
              },
              {
                title: (
                  <span className="data-api__price-text-highlight">
                    SQL API
                  </span>
                ),
                powerful: true,
                url: "https://docs.footprint.network/reference/post_native-async",
                open: true,
              },
              {
                title: (
                  <span className="data-api__price-text-Bonus">
                    Bonus - Footprint Analytics Subscription (Business Plan) -
                    $299 Value for Free!
                  </span>
                ),
                url: "/pricing?type=footprint",
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
          buttonText: "Contact us",
          buttonAction: e => {
            window.open("https://forms.gle/ze3F44681h2wgCHT9");
          },
          buttonCanClick: true,
          boxBg: "data-api__price-item-last",
          detail: {
            title: "Everything in Scale plan, plus:",
            content: [
              {
                title: "Custom calls",
              },
              {
                title: "Custom throughput",
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">Full</span>{" "}
                    historical data
                  </span>
                ),
              },
              {
                title: "Quickest performance",
              },
              {
                title: "Premium onboarding and support",
              },
              {
                title: (
                  <span className="data-api__price-text-highlight">
                    Custom SLAs
                  </span>
                ),
                // url: "https://docs.footprint.network/reference/query",
              },
              {
                title: (
                  <span className="data-api__price-text-highlight">
                    Custom APIs
                  </span>
                ),
                // url: "https://docs.footprint.network/reference/query",
              },
            ],
          },
        },
      ]
    : [
        {
          name: "Free",
          desc: "Best for getting started \nwith Web3",
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
                redirect: "/account/developer",
                from: "Data api price free",
              });
              return;
            }
            onChangeLocation("/account/developer");
          },
          detail: {
            title: "Free access to:",
            content: [
              /*{
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">
                      Unlimited
                    </span>{" "}
                    calls
                  </span>
                ),
              },*/
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">10</span>{" "}
                    domains (Wallet Profile/GameFi/NFT...)
                  </span>
                ),
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">20+</span>{" "}
                    chains
                  </span>
                ),
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">30</span>{" "}
                    calls per second
                  </span>
                ),
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">100</span>{" "}
                    calls per day
                  </span>
                ),
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">3000</span>{" "}
                    calls per month
                  </span>
                ),
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">100</span>{" "}
                    rows data return
                  </span>
                ),
              },
              {
                title: (
                  <span className="data-api__price-text-highlight">
                    SQL API
                  </span>
                ),
                basic: true,
                url: "https://docs.footprint.network/reference/post_native-async",
                open: true,
              },
              {
                title: "Community support",
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
          buttonText: "Contact us",
          buttonAction: e => {
            window.open("https://forms.gle/ze3F44681h2wgCHT9");
          },
          buttonCanClick: true,
          boxBg: "data-api__price-item-last",
          detail: {
            title: "Everything in Free plan, plus:",
            content: [
              // {
              //   title: "Custom calls",
              // },
              // {
              //   title: "Custom throughput",
              // },
              // {
              //   title: (
              //     <span>
              //       <span className="data-api__price-text-highlight">Full</span>{" "}
              //       historical data
              //     </span>
              //   ),
              // },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">
                      Custom
                    </span>{" "}
                    calls per second
                  </span>
                ),
              },
              {
                title: (
                  <span>
                    <span className="data-api__price-text-highlight">
                      Custom
                    </span>{" "}
                    rows data return
                  </span>
                ),
              },
              {
                title: (
                  <span className="data-api__price-text-highlight">
                    SQL API
                  </span>
                ),
                powerful: true,
                url: "https://docs.footprint.network/reference/post_native-async",
                open: true,
              },
              {
                title: (
                  <span className="data-api__price-text-highlight">
                    Custom SLAs
                  </span>
                ),
              },
              {
                title: (
                  <span className="data-api__price-text-highlight">
                    Custom APIs
                  </span>
                ),
              },
              {
                title: "Dedicated account manager",
              },
            ],
          },
        },
      ];

  return (
    <>
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
                          {obj.basic && (
                            <div className="data-api__price-item-powerful">
                              Basic
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

        <div className="data-api__price-other">
          <span className="data-api__price-other-text">
            Not sure which plan is right for you?
            <br />
            Our team is here to help!
          </span>
          <Link to="https://forms.gle/ze3F44681h2wgCHT9" target="_blank">
            <Button className="data-api__price-other-button" primary>
              Talk to an Expert
            </Button>
          </Link>
        </div>
      </div>
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
