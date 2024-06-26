/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";

const AboutDataModel = () => {
  return (
    <div className="About__data-model">
      <h2 className="About__title">
        Data Model - Versatile and Robust
      </h2>
      <h4>Standardize Any Web2 & Web3 Data Into Abstractions</h4>
      <AboutImage
        className="About__data-model-image"
        src={getOssUrl("home-v2/img_data_model.png")}
        alt={"data model"}
      />
    </div>
  );
};

export default AboutDataModel;
