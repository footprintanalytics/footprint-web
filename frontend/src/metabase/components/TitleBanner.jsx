/* eslint-disable react/prop-types */
import React from "react";
import "./TitleBanner.css";

const TitleBanner = props => {
  return (
    <div
      className="TitleBanner"
      style={{ backgroundImage: `url(${props.bg})` }}
    >
      <div className="TitleBanner-wrap">
        <h3 className="footprint-title1">{props.title}</h3>
        <p className="footprint-primary-text">{props.desc}</p>
      </div>
    </div>
  );
};

export default TitleBanner;
