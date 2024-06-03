/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";
import AboutButton from "metabase/containers/aboutV2/components/AboutButton";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";
import { CHAIN_COUNT } from "metabase/lib/constants";

const AboutDataCoverage = () => {
  const data = [
    {
      label: "Protocols",
      value: "30,000+",
    },
    {
      label: "Tokens",
      value: "100M+",
    },
    {
      label: "NFTs",
      value: "2M+",
    },
  ];
  return (
    <div className="About__data-coverage">
      <h2 className="About__title">
        The Infrastructure for Blockchain Data
      </h2>
      <div className="About__data-coverage-chain">
        {`${CHAIN_COUNT}`} Chains
      </div>
      <AboutImage
        className="About__data-image"
        src={getOssUrl("home-v2/img_chain_banner.png")}
        alt={"data coverage"}
      />
      <ul>
        {data.map(item =>
          <li key={item.label}>
            <h4>{item.value.toLocaleString()}</h4>
            <span>{item.label}</span>
          </li>
        )}
      </ul>
      {/*<AboutButton buttonText="Explore Footprint Data" link="https://www.footprint.network/@Footprint/Footprint-Datasets-Data-Dictionary"/>*/}
    </div>
  );
};

export default AboutDataCoverage;
