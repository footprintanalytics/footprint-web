/* eslint-disable react/prop-types */
import React, { useState } from "react";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";
import { getOssUrl } from "metabase/lib/image";
import AboutButton from "metabase/containers/aboutV2/components/AboutButton";
import * as Urls from "metabase/lib/urls";
import { CHAIN_COUNT } from "metabase/lib/constants";
import Link from "metabase/core/components/Link";
import Icon from "metabase/components/Icon";

const AboutDepth = () => {
  const [currentInx, setCurrentInx] = useState(1);
  const data = [
    {
      icon: "home-v2/img_depth_tab_1.png",
      label: "GameFi",
      title: "Explore 2,000+ games with detailed data on \ngamers, popularity, in-game assets, and more.",
      buttons: [
        {
          buttonText: "Top Games",
          link: "https://www.footprint.network/@0xAlina/Game-Ranking",
        },
        {
          buttonText: "In-Game NFT",
          link: "https://www.footprint.network/@DamonSalvatore/Top-In-Game-NFT-on-Ethereum",
        },
        {
          buttonText: "Market Overview",
          link: "https://www.footprint.network/@DamonSalvatore/GameFi-Overview",
        },
      ],
      img: "home-v2/img_depth_right_1.png",
    },
    {
      icon: "home-v2/img_depth_tab_2.png",
      label: "NFT",
      title: "Fetch NFT data from ownerships to sales to \nmetadata for more than 2 million NFT collections.",
      buttons: [
        {
          buttonText: "Top Collections",
          link: "https://www.footprint.network/@Higi/Trending-Collections",
        },
        {
          buttonText: "Hot Mints",
          link: "https://www.footprint.network/@Higi/Hot-Mints?series_time=past6hours",
        },
        {
          buttonText: "Market Overview",
          link: "https://www.footprint.network/@NFT/NFT-Market-overview",
        },
      ],
      img: "home-v2/img_depth_right_2.png",
    },
    {
      icon: "home-v2/img_depth_tab_3.png",
      label: "Chain",
      title: `Embark on a journey across ${CHAIN_COUNT}+ blockchain \nchains, unlocking real-time and comprehensive \nblockchain network data.`,
      buttons: [
        {
          buttonText: "Top Chains",
          link: "https://www.footprint.network/chart/Top-Chain-Tokens-fp-41015",
        },
        {
          buttonText: "Chain Overview",
          link: "https://www.footprint.network/@Higi/All-Chain-Overview",
        },
      ],
      img: "home-v2/img_depth_right_31.png",
    },
    {
      icon: "home-v2/img_depth_tab_4.png",
      label: "Wallet",
      title: "Track and trace activities, holdings, and profiles over \n100+ million addresses.",
      desc: "Coming soon",
      img: "home-v2/img_depth_right_4.png",
    },
    {
      icon: "home-v2/img_depth_tab_5.png",
      label: "Token",
      title: "Instantly assess information for 100,000+ tokens, \ncovering transfers, balances, and intricate details.",
      desc: "Coming soon",
      img: "home-v2/img_depth_right_5.png",
    },
  ];
  const current = data[currentInx];
  return (
    <div className="About__depth">
      <div className="About__depth-circle-bg"/>
      <h3>Footprint Datasets</h3>
      <h4>200+ datasets, and counting</h4>
      <h5>We index and structure a wide range of datasets, making it easy for you to explore data and build next-generation applications whenever required.</h5>
      <AboutButton className="About__depth-button" buttonText="Explore Datasets" link={Urls.newQuestion()}/>
      <div className="About__depth-panel">
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
        <div className="About__depth-panel-inner">
          <div className="About__depth-panel-left">
            <h3>{current.title}</h3>
            <h4>{current.desc}</h4>
            <div className="About__depth-panel-buttons">
              {current.buttons?.map(
                (item, inx) =>
                  <div className="my1" key={item.buttonText}>
                    <Link to={item.link} style={{ "color": "#6C70FF", "textDecoration": "underline" }}>
                      {item.buttonText}
                      <Icon className="ml1" name="home_link_arrow_right" color="#6C70FF" size={11}/>
                    </Link>
                  </div>
              )}
            </div>
          </div>
          <div className="About__depth-panel-right">
            <AboutImage className="About__depth-panel-image" key={current.label} src={getOssUrl(current.img)} alt={current.label} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutDepth;
