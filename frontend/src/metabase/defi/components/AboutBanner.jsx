/* eslint-disable react/prop-types */
import { trackStructEvent } from "metabase/lib/analytics";
import React from "react";
import { Link } from "react-router";
import { getOssUrl } from "../../lib/image";

const AboutBanner = ({ user }) => {
  const isLogin = user && user.groups && user.groups.includes("Defi360");

  return (
    <div className="defi-about__banner">
      <div
        className="defi-about__banner-bg"
        style={{ backgroundImage: `url(${getOssUrl("20220225172555.png")})` }}
      />
      <h2>
        On-Chain Data Analytics
        <br />
        for DeFi Protocols
      </h2>
      <div className="defi-about__banner-btns">
        <Link
          className="defi-btn defi-btn--white"
          to="/defi360/demo"
          onClick={() =>
            trackStructEvent("Footprint Enterprise", "Watch a quick demo")
          }
        >
          Watch a quick demo
        </Link>
        {isLogin ? (
          <Link
            className="defi-btn defi-btn--plain"
            to="/defi360/protocol-dashboard"
            onClick={() =>
              trackStructEvent("Footprint Enterprise", "Go to dashboard")
            }
          >
            Go to dashboard
          </Link>
        ) : (
          <Link
            className="defi-btn defi-btn--plain"
            to="/defi360/loginModal?loginState=signUp&from=defi360_about&redirect=/defi360/protocol-dashboard&project=defi360&disableCheckLogin=true"
            onClick={() => trackStructEvent("Footprint Enterprise", "Sign up")}
          >
            Sign up
          </Link>
        )}
      </div>
      <img
        className="defi-about__banner-demo"
        src={getOssUrl("202205121520510.png")}
        width={740}
        alt="Discover growth opportunity for DeFi protocols."
      />
      <div>
        <p className="defi-quote">
          Discover growth opportunity for DeFi protocols. Footprint Enterprise
          empowers protocol
          <br />
          developers with accessible data and actionable insights all in one
          place.
        </p>
      </div>
    </div>
  );
};

export default AboutBanner;
