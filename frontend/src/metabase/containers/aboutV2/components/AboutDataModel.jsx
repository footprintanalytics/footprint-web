/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";

const AboutDataModel = () => {
  return (
    <div className="About__data-model">
      <div className="About__title">
        Data model - Versatile and Robust
      </div>
      <h4>Standardize Any Web2 & Web3 Data into Abstractions</h4>
      <AboutImage
        className="About__data-model-image"
        src={getOssUrl("home-v2/img_data_model.png")}
        alt={"data model"}
      />
    </div>
  );
};

export default AboutDataModel;
