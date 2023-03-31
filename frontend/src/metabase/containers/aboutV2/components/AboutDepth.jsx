/* eslint-disable react/prop-types */
import React, { useState } from "react";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";
import { getOssUrl } from "metabase/lib/image";
import AboutButton from "metabase/containers/aboutV2/components/AboutButton";
import cx from "classnames";

const AboutDepth = () => {
  const [currentInx, setCurrentInx] = useState(1);
  const data = [
    {
      icon: "home-v2/img_depth_marketing.png",
      label: "Growth Marketing",
      title: "Explore campaign strategies for different user cohorts to optimize your marketing spend",
      desc: "Select quality users such as whales and long-term holders from massive  address databases for airdrops, and monitor campaign performance",
      buttons: [
        {
          buttonText: "Explore the NFT airdrop marketing loop",
          link: "https://www.footprint.network/@Shelly/Mocaverse-Real-Time-NFT-Airdrop-Monitoring",
        },
      ],
      img: "home-v2/img_depth_1.png?2=2",
    },
    {
      icon: "home-v2/img_depth_analytics.png",
      label: "Analytics",
      title: "In-depth project analysis with a full view of \nyour key business metrics",
      desc: "Dive deep into data insights with all bronze data (such as transactions, logs, and events) \nand abstract data",
      buttons: [
        {
          buttonText: "Take PlanetIX Dashboard as an Example",
          link: "https://www.footprint.network/@Higi/PlanetIX",
        },
      ],
      img: "home-v2/img_depth_2.png?2=2",
    },
    {
      icon: "home-v2/img_depth_research.png",
      label: "Research",
      title: "Get Web3 insights at ease with real-time, cross-chain, high-coverage data",
      desc: "Explore community-built analysis and create charts with no code required",
      buttons: [
        {
          buttonText: "Check Research Report Dashboards",
          link: "https://www.footprint.network/dashboards?category=Report&sortBy=&sortDirection=&current=1&model=",
        },
        {
          buttonText: "GameFi Drill Down Analysis",
          link: "https://www.footprint.network/@Footprint/GameFi",
        },
      ],
      img: "home-v2/img_depth_3.png?2=2",
    },
    {
      icon: "home-v2/img_depth_profiles.png",
      label: "Wallet Profiles",
      title: "Analyze and track transactions to match on-chain assets with the right users, and do Sybil prevention",
      desc: "Batch access to all on-chain data to know your users better and bring more valuable users to your project",
      img: "home-v2/img_depth_4.png?2=2",
    },
    {
      icon: "home-v2/img_depth_dapps.png",
      label: "Build DApps",
      title: "Build your application with a flexible API to get full historical data",
      desc: "Supports NFT, GameFi, and raw data in one unified API",
      buttons: [
        {
          buttonText: "Build an NFT Analytics Platform",
          link: "https://nft.footprint.network/",
        },
        {
          buttonText: "Build an Alert Notification Tool",
          link: "https://footrace.io/trace",
        },
      ],
      img: "home-v2/img_depth_5.png?2=2",
    },
  ];
  const current = data[currentInx];
  return (
    <div className="About__depth">
      <div className="About__depth-tabs">
        <ul>
          {data.map((item, inx) =>
            <li
              key={item.label}
              className={inx === currentInx ? "About__depth-tabs-li-selected" : ""}
              onMouseEnter={() => {
                setCurrentInx(inx)
              }}
            >
              <AboutImage src={getOssUrl(item.icon)} alt={item.label} />
              <span>{item.label}</span>
            </li>
          )}
        </ul>
      </div>
      <div className="About__depth-panel">
        <div className="About__depth-panel-inner">
          <div className="About__depth-panel-left">
            <h3>{current.title}</h3>
            <h4>{current.desc}</h4>
            <div className="About__depth-panel-buttons">
              {current.buttons?.map((item, inx) => <AboutButton key={item.buttonText} className={cx("mt2 mb2", {"ml3": inx !== 0})} buttonText={item.buttonText} link={item.link}/>)}
            </div>
          </div>
          <AboutImage className="About__depth-panel-image" key={current.label} src={getOssUrl(current.img)} alt={current.label} />
        </div>
        <div className="About__depth-circle-bg"/>
      </div>
    </div>
  );
};

export default AboutDepth;
