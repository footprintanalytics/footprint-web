/* eslint-disable react/prop-types */

import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { getOssUrl } from "metabase/lib/image";
import "./HomeFooter.css";
import Link from "metabase/core/components/Link";
import ExternalLink from "metabase/core/components/ExternalLink";
import cx from "classnames";
// import { isDefi360 } from "metabase/lib/project_info";

const footers = [
  {
    title: "Products",
    items: [
      {
        label: "Analytics App",
        url: "/dashboards",
      },
      {
        label: "Data API",
        url: "/data-api",
      },
      {
        label: "Batch Download",
        url: "/batch-download",
      },
      {
        label: "Growth Analytics",
        url: "/growth",
      },
      {
        label: "GameFi Research",
        url: "/research/gamefi",
        startNewPanel: true,
      },
      {
        label: "NFT Research",
        url: "/research/nft",
      },
      {
        label: "Chain Research",
        url: "/research/chain",
      },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        label: "Data Overview",
        url: "/@Footprint/Footprint-Data-Overview",
      },
      {
        label: "Data Dictionary",
        url: "/@Footprint/Footprint-Datasets-Data-Dictionary",
      },
      {
        label: "Docs",
        url: "https://docs.footprint.network/docs/get-started",
      },
      {
        label: "Blog",
        url: "/news/all",
        startNewPanel: true,
      },
      {
        label: "Reports",
        url: "/news/reports",
      },
      {
        label: "Academy",
        url: "/news/academy",
      },
      {
        label: "Case Studies",
        url: "https://docs.footprint.network/docs/clients-studies",
      },
    ],
  },
  {
    title: "Company",
    items: [
      {
        label: "Press Kit",
        url: "https://docs.footprint.network/docs/press-kit",
      },
      {
        label: "Pricing",
        url: "/pricing",
      },
      {
        label: "Contact Us",
        url: "mailto:analytics@footprint.network",
      },
      {
        label: "Privacy Policy",
        url: "https://static.footprint.network/site/privacy-policy.html",
        startNewPanel: true,
      },
      {
        label: "Terms of Service",
        url: "https://static.footprint.network/site/terms-of-service.html",
      },
    ],
  },
  {
    title: "Contribute",
    items: [
      {
        label: "Submit Contract",
        url: "/submit/contract",
      },
      {
        label: "Write for Us",
        url: "/news/write-for-us",
      },
      {
        label: "Github",
        url: "https://github.com/footprintanalytics",
      },
    ],
  },
  {
    title: "Community",
    items: [
      {
        label: "Discord",
        url: "https://discord.com/invite/3HYaR6USM7",
      },
      {
        label: "Telegram",
        url: "https://t.me/joinchat/4-ocuURAr2thODFh",
      },
      {
        label: "Twitter",
        url: "https://twitter.com/Footprint_Data",
      },
      {
        label: "Medium",
        url: "https://medium.com/@footprintofficial",
      },
      {
        label: "Youtube",
        url: "https://www.youtube.com/channel/UCKwZbKyuhWveetGhZcNtSTg",
      },
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/company/footprintanalytics",
      },
    ],
  },
];

const HomeFooter = props => {
  const { style } = props;
  // const emailRef = React.createRef();

  return (
    <footer className="home-footer-container footprint-primary-text" style={style}>
      <div className="home-footer">
        <div className="home-footer-left">
          <img
            src={getOssUrl("img_nav_logo_white.png")}
            alt="Footprint analytics"
          />
          <span data-nosnippet>
            Footprint Analytics is a data platform blending web2 and web3 data with abstractions. We help analysts, builders, and investors turn blockchain data into insights with accessible visualization tools and a powerful multi-chain API across 20+ chains for NFTs, GameFi, and DeFi. We also provide Footprint Growth Analytics to help with effective growth in GameFi and any web3 projects.
          </span>
          <span data-nosnippet>
            Disclaimer: All data and articles on Footprint Analytics are for
            informational purposes only, and do not constitute any investment
            advice.
          </span>
          {/* {!user && (
            <div className="home-footer-left-email">
              <input
                ref={emailRef}
                type="text"
                name="email"
                placeholder="Sign up for our newsletter"
              />
              <div
                onClick={() => {
                  const email = emailRef.current.value;
                  let path;
                  if (isDefi360()) {
                    path = `/defi360/loginModal?loginState=signUp&from=home_footer_signup&email=${email}&redirect=/defi360/protocol-dashboard&project=defi360&disableCheckLogin=true`;
                  } else {
                    path = `/loginModal?loginState=signUp&from=home_footer_signup&email=${email}`;
                  }
                  onChangeLocation(path);
                }}
              >
                Sign up
              </div>
            </div>
          )} */}
        </div>
        <div className="home-footer-right">
          {footers.map(n => (
            <div key={n.title} className="home-footer-right-section">
              <span className=" footprint-title2">{n.title}</span>
              <ul
                role="list"
                itemScope
                itemType="http://www.schema.org/SiteNavigationElement"
              >
                {n.items.map(item => (
                  <li key={item.label} itemProp="name" className={cx("duke",{ "mt2": item.startNewPanel })}>
                    {item.url.startsWith("mailto") ? (
                      <ExternalLink className="_" href={item.url}>
                        {item.label}
                      </ExternalLink>
                    ) : (
                      <Link
                        itemProp="url"
                        to={item.url}
                        target={
                          item.url.startsWith("http") ||
                          item.url.includes("defi360")
                            ? "_blank"
                            : ""
                        }
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "none" }}>
        keywords：
        <a
          href="https://www.footprint.network/sitemap.html"
          title="footprint"
          rel="noreferrer"
          target="_blank"
        >
          <strong>footprint</strong>
        </a>
        <a
          href="https://www.footprint.network/sitemap.xml"
          title="footprint"
          rel="noreferrer"
          target="_blank"
        >
          <strong>footprint</strong>
        </a>
      </div>
    </footer>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

const mapDispatchToProps = {
  onChangeLocation: push,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
