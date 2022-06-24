/* eslint-disable react/prop-types */

import { getOssUrl } from "metabase/lib/image";
import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import "./HomeFooter.css";
import Link from "metabase/components/Link";
// import { isDefi360 } from "metabase/lib/project_info";

const footers = [
  {
    title: "Learn",
    items: [
      {
        label: "Insights",
        url: "https://insights.footprint.network/",
      },
      {
        label: "Docs",
        url: "https://docs.footprint.network/",
      },
      {
        label: "Tutorials",
        url: "/tutorials/visualizations",
      },
      {
        label: "Data Dictionary",
        url:
          "https://www.footprint.network/@Footprint/Footprint-Datasets-Data-Dictionary",
      },
      {
        label: "Pricing",
        url: "/pricing",
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        label: "GameFi Protocols",
        url: "/protocols",
      },
      {
        label: "Projects Analytics",
        url: "/projects",
      },
      {
        label: "Chains Analytics",
        url: "/chains",
      },
      {
        label: "Footprint Enterprise",
        url: "/defi360",
      },
    ],
  },
  {
    title: "Company",
    items: [
      {
        label: "Why Footprint",
        url: "/about",
      },
      {
        label: "News",
        url: "/news/featured",
      },
      {
        label: "Write for Us",
        url: "/news/write-for-us",
      },
      {
        label: "Pricing",
        url: "/pricing",
      },
      {
        label: "Contact Us",
        url: "mailto:analytics@footprint.network",
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
        url: "https://twitter.com/Footprint_DeFi",
      },
      {
        label: "Medium",
        url: "https://medium.com/@footprintofficial",
      },
      {
        label: "Youtube",
        url: "https://www.youtube.com/channel/UCKwZbKyuhWveetGhZcNtSTg",
      },
    ],
  },
];

const HomeFooter = props => {
  // const { user, onChangeLocation } = props;
  // const emailRef = React.createRef();

  return (
    <footer className="home-footer-container footprint-primary-text">
      <div className="home-footer">
        <div className="home-footer-left">
          <img
            src={getOssUrl("img_nav_logo_white.png")}
            alt="Footprint analytics"
          />
          <span data-nosnippet>
            Footprint is a powerful yet easy-to-use analytics tool to uncover
            and visualize blockchain data. The product puts user experience
            first whether you’re an analyst, data scientist, developer, student,
            teacher, or executive. It provides an intuitive, drag-and-drop
            interface for interactive data queries.
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
                  <li key={item.label} itemProp="name">
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
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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
