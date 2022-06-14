/* eslint-disable react/prop-types */

import React from "react";

const TitleDesc = ({ title, desc }) => {
  return (
    <div className="title-desc">
      {title && (
        <div className="title-desc__title footprint-title1">{title}</div>
      )}
      {desc && (
        <div className="title-desc__desc footprint-primary-text">{desc}</div>
      )}
    </div>
  );
};

export default TitleDesc;
