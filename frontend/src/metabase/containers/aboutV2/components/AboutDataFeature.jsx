/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";
import AboutButton from "metabase/containers/aboutV2/components/AboutButton";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";

const AboutDataFeature = () => {
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
    <div className="About__data-feature">
      <div className="About__title">
        Data Feature
      </div>
      <ul>
        {data.map(item =>
          (<li key={item.title}>
            <AboutImage
              src={getOssUrl(item.icon)}
              alt={item.title}
            />
            <span>{item.title}</span>
          </li>)
        )}
      </ul>
      <AboutButton buttonText="Know more about data" link="https://docs.footprint.network/docs/get-started"/>
    </div>
  );
};

export default AboutDataFeature;
