/* eslint-disable react/prop-types */
import React from "react";
import { Image, Skeleton, Spin } from "antd";
import CountUp from "react-countup";
import { getOssUrl } from "metabase/lib/image";
import data from "../data";
import AboutButton from "metabase/containers/aboutV2/components/AboutButton";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";

const AboutDataModel = ({ indicator }) => {
  const data = [
    {
      icon: "home-v2/img_feature1.png",
      title: "Cross-chain",
    },
    {
      icon: "home-v2/img_feature2.png",
      title: "Cross Web2 & Web3",
    },
    {
      icon: "home-v2/img_feature3.png",
      title: "Real-time",
    },
    {
      icon: "home-v2/img_feature4.png",
      title: "Full history dataset",
    },
    {
      icon: "home-v2/img_feature5.png",
      title: "Ease of use abstraction",
    },
  ];
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
