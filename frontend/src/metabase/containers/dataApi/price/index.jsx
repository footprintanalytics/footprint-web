/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import "./index.css";
import { Button, Skeleton } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { push } from "react-router-redux";
import { connect } from "react-redux";
import { loginModalShowAction } from "metabase/redux/control";
import Link from "metabase/core/components/Link";
import { loadCurrentUserVipDataApi } from "metabase/redux/user";
import { useGetProductInfo } from "metabase/pricing_v2/use";
import PricingModal from "metabase/pricing_v2/components/PricingModal";

const Index = ({
  user,
  setLoginModalShow,
  onChangeLocation,
  location,
  router,
  sign,
}) => {

  const [visible, setVisible] = useState();
  const { isLoading, data } = useGetProductInfo("dataApi");
  const products = data?.groups?.find(item => item.type === visible)?.products;

  useEffect(() => {
    if (location?.pathname === "/data-api/pricing") {
      router?.replace("/pricing?type=data-api");
    }
  }, [location, router]);


  if (isLoading) {
    return (
      <div className="Pricing">
        <Skeleton active />
      </div>
    );
  }

  const frontData = [
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
          return ;
        }
        onChangeLocation("/account/developer");
      },
      detail: {
        title: "Free access to:",
        content: [
          {
            title: (
              <span>
                <span className="data-api__price-text-highlight">3K</span> calls
                per month
              </span>
            ),
          },
          {
            title: (
              <span>
                <span className="data-api__price-text-highlight">1</span> calls
                per second
              </span>
            ),
          },
          {
            title: (
              <span>
                <span className="data-api__price-text-highlight">30 days</span>{" "}
                historical data
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
      buttonText: user?.vipInfoDataApi?.type === "growth" ? "Renewal" : "Get started",
      buttonAction: e => {
        if (!user) {
          e.preventDefault();
          setLoginModalShow({
            show: true,
            redirect: "/pricing?type=data-api",
            from: "Data api price growth",
          });
          return ;
        }
        setVisible("growth");
        // window.open("https://forms.gle/ze3F44681h2wgCHT9");
      },
      buttonCanClick:
        !["scale"].includes(user?.vipInfoDataApi?.type),
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
                <span className="data-api__price-text-highlight">10</span> calls
                per second
              </span>
            ),
          },
          {
            title: (
              <span>
                <span className="data-api__price-text-highlight">6 months</span>{" "}
                historical data
              </span>
            ),
          },
          {
            title: "Quick performance",
          },
          {
            title: (
              <span>
                <span className="data-api__price-text-highlight">24hrs</span>{" "}
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
      buttonText: user?.vipInfoDataApi?.type === "scale" ? "Renewal" : "Get started",
      buttonAction: e => {
        if (!user) {
          e.preventDefault();
          setLoginModalShow({
            show: true,
            redirect: "/pricing?type=data-api",
            from: "Data api price scale",
          });
          return ;
        }
        setVisible("scale");
        // window.open("https://forms.gle/ze3F44681h2wgCHT9");
      },
      buttonCanClick: true,
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
                <span className="data-api__price-text-highlight">50</span> calls
                per second
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
            title: "Quicker performance",
          },
          {
            title: "Dedicated account manager",
          },
          {
            title: (
              <span className="data-api__price-text-highlight">SQL API</span>
            ),
            powerful: true,
            url: "https://docs.footprint.network/reference/post_v1-native",
            open: true,
          },
          {
            title: (
              <span className="data-api__price-text-Bonus">
                Bonus - Footprint Analytics Subscription (Business Plan) - $299
                Value for Free!
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
                <span className="data-api__price-detail-title">
                  {item.detail.title}
                </span>
                <ul className="data-api__price-detail-content">
                  {item.detail.content.map((obj, index) => {
                    return (
                      <li
                        className={`data-api__price-detail-content-item ${
                          obj.url ? "data-api__price-detail-content-item-url" : ""
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
          onClose={() => setVisible(null)}
        />
      )}
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
