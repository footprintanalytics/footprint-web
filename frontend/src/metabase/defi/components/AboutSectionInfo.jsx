/* eslint-disable react/prop-types */
import { trackStructEvent } from "metabase/lib/analytics";
import React from "react";
import { Link } from "react-router";
import { getOssUrl } from "../../lib/image";

const AboutSectionInfo = ({ title, desc, hideLink }) => {
  return (
    <div
      className={`defi-about__section-info ${
        hideLink ? "defi-about__section-info--nolink" : ""
      }`}
    >
      <div className="defi-about__section-info-title">{title}</div>
      <div className="defi-about__section-info-desc">{desc}</div>
      {!hideLink && (
        <Link
          className="defi-about__section-info-link"
          to="/defi360/demo"
          onClick={() =>
            trackStructEvent("Footprint Enterprise", "Watch a quick demo")
          }
        >
          Watch a quick demo
          <img
            src={getOssUrl("20220225191417.png")}
            width={16}
            height={10}
            alt="Watch a quick demo"
          />
        </Link>
      )}
    </div>
  );
};

export default AboutSectionInfo;
