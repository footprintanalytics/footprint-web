/* eslint-disable react/prop-types */

import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { getOssUrl } from "metabase/lib/image";
import "./HomeFooter.css";
import Link from "metabase/core/components/Link";
import ExternalLink from "metabase/core/components/ExternalLink";
import cx from "classnames";
import { FooterData } from "metabase/containers/home/data";
// import { isDefi360 } from "metabase/lib/project_info";


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
            Footprint Analytics is a blockchain data solutions provider. We leverage cutting-edge AI technology to help analysts, builders, and investors turn blockchain data and combine Web2 data into insights with accessible visualization tools and a powerful multi-chain API across 30+ chains for NFTs, games, wallet profiles, and money flow data.
          </span>
          <span data-nosnippet>
            Disclaimer: All data and articles on Footprint Analytics are for informational purposes only, and do not constitute any investment advice.
          </span>
          <div className="flex align-baseline" style={{ gap: 24 }}>
            <span>© 2024 Footprint Analytics</span>
            <div className="flex" style={{ gap: 16 }}>
              <Link to={"https://static.footprint.network/site/privacy-policy.html"} target="_blank">
                <span>Privacy Policy</span>
              </Link>
              <Link to={"https://static.footprint.network/site/terms-of-service.html"} target="_blank">
                <span>Terms of Service</span>
              </Link>
              <Link to={"mailto:sales@footprint.network"} target="_blank">
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
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
          {FooterData.map(n => (
            <div key={n.title} className="home-footer-right-section">
              <h3 className=" footprint-title2">{n.title}</h3>
              <ul
                role="list"
                itemScope
                itemType="http://www.schema.org/SiteNavigationElement"
              >
                {n.items.map(item => (
                  <li key={item.label} itemProp="name" className={cx({ "mt2": item.startNewPanel, "no-link": !item.url, "text-bold": item.bold })}>
                    {item.url.startsWith("mailto") ? (
                      <ExternalLink className="_" href={item.url}>
                        {item.label}
                      </ExternalLink>
                    ) : (
                      !item.url ? (
                          <span className="no-link">
                            {item.label}
                          </span>
                        ): (
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
                      ))}
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
