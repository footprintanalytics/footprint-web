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

  const chainList = [
    {
      title: "Ethereum",
      img: getOssUrl("studio/img-chain-1.png"),
      link: "/research/chain/chain-stats/ethereum-overview",
    },
    {
      title: "Ronin",
      img: getOssUrl("studio/img-chain-12.png"),
      link: "/research/chain/chain-stats/ronin-overview",
    },
    {
      title: "Sui",
      img: getOssUrl("studio/img-chain-27.png"),
      link: "/research/chain/chain-stats/sui-overview",
    },
    {
      title: "BNB Chain",
      img: getOssUrl("studio/img-chain-2.png"),
      link: "/research/chain/chain-stats/bnb-chain-overview",
    },
    {
      title: "Polygon",
      img: getOssUrl("studio/img-chain-34.png"),
      link: "/research/chain/chain-stats/polygon-overview",
    },
    {
      title: "Starknet",
      img: getOssUrl("studio/img-chain-38.png"),
      link: "/research/chain/chain-stats/starknet-overview",
    },
    {
      title: "Arbitrum One",
      img: getOssUrl("studio/img-chain-32.png"),
      link: "/research/chain/chain-stats/arbitrum-overview",
    },
    {
      title: "Optimism",
      img: getOssUrl("studio/img-chain-33.png"),
      link: "/research/chain/chain-stats/optimism-overview",
    },
    {
      title: "Arbitrum Nova",
      img: getOssUrl("studio/img-chain-50.png?2=2"),
      link: "/research/chain/chain-stats/arbitrum-nova-overview",
    },
    {
      title: "zkSync Era",
      img: getOssUrl("studio/img-chain-31.png"),
      link: "/research/chain/chain-stats/zksync-era-overview",
    },
    {
      title: "GalaChain",
      img: getOssUrl("fp-chains/gala.webp"),
      link: "/research/chain/chain-stats/gala-chain-overview",
    },
    {
      title: "Oasys",
      img: getOssUrl("studio/img-chain-13.png"),
      link: "/research/chain/chain-stats/oasys-overview",
    },
    {
      title: "MCH Verse",
      img: getOssUrl("studio/img-chain-36.png"),
      link: "/research/chain/chain-stats/mch-verse-gamefi-overview",
    },
    {
      title: "HOME Verse",
      img: getOssUrl("studio/img-chain-35.png?image_process=resize,w_36/crop,h_36/format,png"),
      link: "/research/chain/chain-stats/home-verse-overview",
    },
    {
      title: "TCG Verse",
      img: getOssUrl("studio/img-chain-37.png"),
      link: "/research/chain/chain-rankings/top-chains",
    },
    {
      title: "Merlin",
      img: getOssUrl("fp-chains/merlin.webp?image_process=resize,w_36/crop,h_36/format,webp"),
      link: "/research/chain/chain-stats/merlin-overview",
    },
    {
      title: "Rootstock",
      img: getOssUrl("fp-chains/rootstock.png?image_process=resize,w_36/crop,h_36/format,webp"),
      link: "/research/chain/chain-stats/rootstock-overview",
    },
    {
      title: "Core",
      img: getOssUrl("fp-chains/core-chain.png"),
      link: "/research/chain/chain-stats/core-overview",
    },
    {
      title: "Cronos",
      img: getOssUrl("studio/img-chain-6.png?image_process=resize,w_36/crop,h_36/format,png"),
      link: "/research/chain/chain-stats/cronos-overview",
    },
    {
      title: "Fantom",
      img: getOssUrl("studio/img-chain-5.png"),
      link: "/research/chain/chain-stats/fantom-overview",
    },
    {
      title: "Avalanche",
      img: getOssUrl("studio/img-chain-3.png"),
      link: "/research/chain/chain-stats/avalanche-overview",
    },
    {
      title: "Boba",
      img: getOssUrl("studio/img-chain-24.png?1=1"),
      link: "/research/chain/chain-stats/boba-network-overview",
    },
    {
      title: "Combo",
      img: getOssUrl("fp-chains/combo.png?image_process=resize,w_36/crop,h_36/format,webp"),
      link: "/research/chain/chain-stats/combo-overview",
    },
    {
      title: "ThunderCore",
      img: getOssUrl("studio/img-chain-17.png?image_process=resize,w_36/crop,h_36/format,png"),
      link: "/research/chain/chain-stats/thundercore-overview",
    },
    {
      title: "Celo",
      img: getOssUrl("studio/img-chain-16.png"),
      link: "/research/chain/chain-stats/celo-overview",
    },
    {
      title: "DFK",
      img: getOssUrl("studio/img-chain-11.png"),
      link: "/research/chain/chain-stats/dfk-overview",
    },
    {
      title: "Nautilus",
      img: getOssUrl("fp-chains/nautilus.png?1=1&image_process=resize,w_36/crop,h_36/format,webp"),
      link: "/research/chain/chain-stats/nautilus-overview",
    },
    {
      title: "Harmony",
      img: getOssUrl("studio/img-chain-4.png"),
      link: "/research/chain/chain-stats/harmony-overview",
    },
    {
      title: "Moonbeam",
      img: getOssUrl("studio/img-chain-14.png?1=1"),
      link: "/research/chain/chain-stats/moonbeam-overview",
    },
    {
      title: "Moonriver",
      img: getOssUrl("studio/img-chain-15.png?1=1"),
      link: "/research/chain/chain-stats/moonriver-overview",
    },
  ]

  const renderChainLayout = () => {
    return (
      <div className={"About__chain-layout"}>
        {chainList.map((chain, index) => (
          <div key={index} className="About__chain-layout-item">
            <a href={chain.link} target="_blank" rel="noopener noreferrer">
              <img src={chain.img} alt={chain.title} />
            </a>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="About__data-coverage">
      <h2 className="About__title">
        The Infrastructure for Blockchain Data
      </h2>
      <div className="About__data-coverage-chain">
        {`${CHAIN_COUNT}`} Chains
      </div>
      {renderChainLayout()}
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
