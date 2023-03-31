/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";
import AboutButton from "metabase/containers/aboutV2/components/AboutButton";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";

const AboutDataCoverage = ({ indicator }) => {
  const data = [
    {
      label: "Wallet Addresses",
      value: 7541322,
    },
    {
      label: "Tags",
      value: 9265652,
    },
    {
      label: "NFT collections",
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
        25 Chains
      </div>
      <AboutImage
        className="About__data-image"
        src={getOssUrl("home-v2/img_data_coverage.png?1=1")}
        alt={"data coverage"}
      />
      <ul>
        {data.map(item =>
          <li key={item.label}>
            <h3>{item.value.toLocaleString()}</h3>
            <span>{item.label}</span>
          </li>
        )}
      </ul>
      <AboutButton buttonText="Explore Footprint Data" link="https://www.footprint.network/@Footprint/Footprint-Data-Overview"/>
    </div>
  );
};

export default AboutDataCoverage;
