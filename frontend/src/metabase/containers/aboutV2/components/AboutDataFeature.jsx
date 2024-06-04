/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";
import AboutButton from "metabase/containers/aboutV2/components/AboutButton";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";
import Carroussel from "metabase/containers/aboutV2/components/spide/Carroussel";
import Card from "metabase/containers/aboutV2/components/spide/Card";
import Link from "metabase/core/components/Link";

const AboutDataFeature = () => {
  const [current, setCurrent] = React.useState(0);
  console.log("current", current)
  let cards = [
    {
      key: 1,
      title: "Games",
      desc: "Explore 3,000+ games with detailed data on gamers, revenue, in-game assets, and more.",
      content: (
        <Card imagen="https://static.footprint.network/home-v2/img_insight_1.jpg" title={"Games"}
              link={current === 0 ? "https://www.footprint.network/research/gamefi/game-rankings/top-games": ""}/>
      ),
      link: "https://www.footprint.network/research/gamefi/game-rankings/top-games",
    },
    {
      key: 2,
      title: "Chain",
      desc: "Embark on a journey across 30+ blockchains, unlocking real-time and comprehensive blockchain network data.",
      content: (
        <Card imagen="https://static.footprint.network/home-v2/img_insight_2.jpg" title={"Chain"}
              link={current === 1 ? "https://www.footprint.network/research/chain/chain-rankings/top-chains": ""}/>
      ),
      link: "https://www.footprint.network/research/chain/chain-rankings/top-chains",
    },
    {
      key: 3,
      title: "Wallet",
      desc: "Track and trace activities, historical balance, and profiles over 100+ million addresses.",
      content: (
        <Card imagen="https://static.footprint.network/home-v2/img_insight_3.jpg" title={"Wallet"}
              link={current === 2 ? "https://www.footprint.network/research/wallet": ""}/>
      ),
      link: "https://www.footprint.network/research/wallet",
    },
    {
      key: 4,
      title: "Token",
      desc: "Instantly assess information for 100,000+ tokens, covering money flow, holders, and intricate details.",
      content: (
        <Card imagen="https://static.footprint.network/home-v2/img_insight_4.jpg" title={"Token"}
              link={current === 3 ? "https://www.footprint.network/research/token/rankings/token-exchange-net-flow": ""}/>
      ),
      link: "https://www.footprint.network/research/token/rankings/token-exchange-net-flow",
    },
    {
      key: 5,
      title: "NFT",
      desc: "Fetch NFT data from ownerships to sales to metadata for more than 2 million NFTs.",
      content: (
        <Card imagen="https://static.footprint.network/home-v2/img_insight_5.jpg" title={"NFT"}
              link={current === 4 ? "https://www.footprint.network/research/nft/nft-rankings/top-marketplaces?date=past30days~": ""}/>
      ),
      link: "https://www.footprint.network/research/nft/nft-rankings/top-marketplaces?date=past30days~",
    },
    {
      key: 6,
      title: "Reports",
      desc: "Stay ahead of the trend in blockchain industry. ",
      content: (
        <Card imagen={"https://statichk.footprint.network/article/80933845-7ac9-4322-91f8-999617408153.png"} title={"Reports"}
              link={current === 5 ? "https://www.footprint.network/news/blog": ""}/>
      ),
      link: "https://www.footprint.network/news/blog",
    }
  ];

  return (
    <div className="About__data-feature">
      <div className="About__depth-circle-bg" style={{ zIndex: 0 }}/>
      <h2 className="About__title">
        Expand Your Insights with Comprehensive <br/>Blockchain Data Analysis
      </h2>
      <div style={{ zIndex: 1 }}>
        <Link className={"cursor-pointer"} to={cards[current]?.link} target="_blank"><h3>{cards[current]?.title}</h3></Link>
      </div>
      <div style={{ zIndex: 1 }}>
        <div className="flex"><h4>{cards[current]?.desc}</h4><Link className="cursor-pointer text-underline text-underline-hover" to={cards[current]?.link} target="_blank"><span className="ml1">Learn More</span></Link></div>
      </div>
      <Carroussel
        cards={cards}
        height="520px"
        width="30%"
        margin="0 auto"
        offset={2}
        showArrows={false}
        current={current}
        onChangeSlide={(slide) => {
          if (slide !== null) {
            setCurrent(slide)
          }
        }}
      />
    </div>
  );
};

export default AboutDataFeature;
