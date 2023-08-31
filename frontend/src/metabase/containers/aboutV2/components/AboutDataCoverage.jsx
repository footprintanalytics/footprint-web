/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";
import AboutButton from "metabase/containers/aboutV2/components/AboutButton";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";
import { CHAIN_COUNT } from "metabase/lib/constants";

const AboutDataCoverage = () => {
  const data = [
    {
      label: "Wallet Addresses",
      value: "400 Million",
    },
    {
      label: "Tags",
      value: "450 Million",
    },
    {
      label: "NFT Collections",
      value: 1094667,
    },
    {
      label: "Games",
      value: 2000
    },
    {
      label: "Marketplaces",
      value: 18,
    },
  ];
  return (
    <div className="About__data-coverage">
      <div className="About__title">
        Data Coverage
      </div>
      <div className="About__data-coverage-chain">
        {`${CHAIN_COUNT}`} Chains
      </div>
      {/*<AboutImage
        className="About__data-image"
        src={getOssUrl("home-v2/img_data_coverage_v2.png?2=2")}
        alt={"data coverage"}
      />*/}
      <ul>
        {data.map(item =>
          <li key={item.label}>
            <h3>{item.value.toLocaleString()}</h3>
            <span>{item.label}</span>
          </li>
        )}
      </ul>
      <AboutButton buttonText="Explore Footprint Data" link="https://www.footprint.network/@Footprint/Footprint-Datasets-Data-Dictionary"/>
    </div>
  );
};

export default AboutDataCoverage;
