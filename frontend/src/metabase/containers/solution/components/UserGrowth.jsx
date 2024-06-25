/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import BatchDownloadButtons from "metabase/containers/solution/components/batchDownloadButtons";
import { getOssUrl } from "metabase/lib/image";

const UserGrowth = props => {
  const { type, gap } = props
  const communityData = [
    {
      "title": "Ready-To-Use",
      "desc": "Out-of-the-box functionality",
      "image": getOssUrl("solution/icon-growth1.png"),
    },
    {
      "title": "Lego-Style Structure Combinations",
      "desc": "Highly flexible and customizable",
      "image": getOssUrl("solution/icon-growth2.png"),
    },
    {
      "title": "Community-Focused",
      "desc": "Comprehensive tools for seamless \ncommunity operations",
      "image": getOssUrl("solution/icon-growth3.png"),
    },
  ]
  const marketingData = [
    {
      "title": "Full Historical",
      "desc": "Complete data of Wallets",
      "image": getOssUrl("solution/icon-growth1.png"),
    },
    {
      "title": "Real-Time",
      "desc": "Instantaneous data updates",
      "image": getOssUrl("solution/icon-growth2.png"),
    },
    {
      "title": "Cross-chain Compatibility",
      "desc": "Support for 30+ chains",
      "image": getOssUrl("solution/icon-growth3.png"),
    },
  ]
  const blockchainData = [
    {
      "title": "Expanded Adoption",
      "desc": "Low-barrier analysis tools and content \nsupport help users understand the \necosystem and onboard effortlessly.",
      "image": getOssUrl("solution/icon-grow20.png"),
    },
    {
      "title": "Accelerate Dapp Development",
      "desc": "Empower developers to build DApps more \nefficiently.",
      "image": getOssUrl("solution/icon-grow21.png"),
    },
    {
      "title": "Monitor Ecosystem Health",
      "desc": "Enable understanding and \nmonitoring of ecosystem trends.",
      "image": getOssUrl("solution/icon-grow22.png"),
    },
  ]
  const gamesData = [
    {
      "title": "Comprehensive",
      "desc": "Supports 30+ chains, simplifying \ncross-chain analysis.",
      "image": getOssUrl("solution/Icon-comprehensivet-1x.png"),
    },
    {
      "title": "Advanced Action Tools",
      "desc": "Integrated Quest bot for efficient marketing \nmanagement and channel tracking.",
      "image": getOssUrl("solution/Icon-tools-1x.png"),
    },
    {
      "title": "Versatile Client Support",
      "desc": "From early startups to \nmature ecosystems.",
      "image": getOssUrl("solution/Icon-client-1x.png"),
    },
  ]
  const gamesData2 = [
    {
      "title": "Demand-Driven Customization",
      "desc": "Flexible solutions to meet specific needs \nand requirements.",
      "image": getOssUrl("solution/Icon-customization-1x.png"),
    },
    {
      "title": "80% of Self-Build Cost",
      "desc": "Highly economical, offering \nexceptional value and cost savings.",
      "image": getOssUrl("solution/Icon-cost-1x.png"),
    },
  ]
  const communityData2 = [
    {
      "title": "Comprehensive Approach",
      "desc": "From individual users to projects and \nentire ecosystems",
      "image": getOssUrl("solution/icon-growth4.png"),
    },
    {
      "title": "White Label Supported",
      "desc": "Cost-efficient and ready for integration",
      "image": getOssUrl("solution/icon-growth5.png"),
    },
  ]
  const marketingData2 = [
    {
      "title": "Snapshots at Any Block",
      "desc": "Capture blockchain states at any block.",
      "image": getOssUrl("solution/icon-growth4.png"),
    },
    {
      "title": "White Label Supported",
      "desc": "Cost-efficient and ready for integration",
      "image": getOssUrl("solution/icon-growth5.png"),
    },
  ]
  const mappingData = {
    "community": {
      data: communityData,
      data2: communityData2,
      title: "User Growth & Loyalty Solution ",
      desc: "Powered by AI",
    },
    "marketing": {
      data: marketingData,
      data2: marketingData2,
      title: "Web3 Growth Hacking With ",
      desc: "Advanced Data Support",
    },
    "blockchain": {
      data: blockchainData,
      title: "Build Blockchain Magic and ",
      desc: "Accelerate Ecosystem Growth",
    },
    "games": {
      data: gamesData,
      data2: gamesData2,
      title: "Bridging Analysis and Action for ",
      desc: "Real Results",
    },
  }
  const title = mappingData[type].title
  const desc = mappingData[type].desc
  const data = mappingData[type].data
  const data2 = mappingData[type].data2

  return (
    <div className="solution__user-growth">
      <h2>{title} <span className="solution__user-growth-title-primary">{desc}</span></h2>
      <ul className="solution__user-growth-first-ul" style={{gap: gap}}>
        {data?.map((item, index) => {
          return (
            <li key={index} >
              <div className="flex align-center">
                <img src={item.image} alt={item.title} style={{width: 32, height: 32}}/>
                <h3>{item.title}</h3>
              </div>
              <span>{item.desc}</span>
            </li>
          )
        })}
      </ul>
      <ul className="solution__user-growth-second-ul">
        {data2?.map((item, index) => {
          return (
            <li key={index} >
              <div className="flex align-center">
                <img src={item.image} alt={item.title} style={{width: 32, height: 32}}/>
                <h3>{item.title}</h3>
              </div>
              <span>{item.desc}</span>
            </li>
          )
        })}
      </ul>
    </div>
  );
};

export default UserGrowth;
