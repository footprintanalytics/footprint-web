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
        <Card imagen="https://static.footprint.network/home-v2/img_Insights_games.png" title={"Games"}/>
      ),
      link: "https://www.footprint.network/research/gamefi/game-rankings/top-games",
    },
    {
      key: 2,
      title: "Chain",
      desc: "Embark on a journey across 30+ blockchains, unlocking real-time and comprehensive blockchain network data.",
      content: (
        <Card imagen="https://static.footprint.network/home-v2/img_Insights_chain.png" title={"Chain"}/>
      ),
      link: "https://www.footprint.network/research/chain/chain-rankings/top-chains",
    },
    {
      key: 3,
      title: "Wallet",
      desc: "Track and trace activities, historical balance, and profiles over 100+ million addresses.",
      content: (
        <Card imagen="https://static.footprint.network/home-v2/img_Insights_wallet.png" title={"Wallet"}/>
      ),
      link: "https://www.footprint.network/research/wallet",
    },
    {
      key: 4,
      title: "Token",
      desc: "Instantly assess information for 100,000+ tokens, covering money flow, holders, and intricate details.",
      content: (
        <Card imagen="https://static.footprint.network/home-v2/img_Insights_token.png" title={"Token"}/>
      ),
      link: "https://www.footprint.network/research/token/rankings/token-exchange-net-flow",
    },
    {
      key: 5,
      title: "NFT",
      desc: "Fetch NFT data from ownerships to sales to metadata for more than 2 million NFTs.",
      content: (
        <Card imagen="https://static.footprint.network/home-v2/img_Insights_NFT.png" title={"NFT"}/>
      ),
      link: "https://www.footprint.network/research/nft/nft-rankings/top-marketplaces?date=past30days~",
    },
    {
      key: 6,
      title: "Reports",
      desc: "Stay ahead of the trend in blockchain industry. ",
      content: (
        <Card
          reports={[
            {
              title: "Pea.AI and Ladder Protocol Unite to Energize the Blockchain and NFT Community",
              desc: "Pea.AI and Ladder Protocol Unite to Energize the Blockchain and NFT Community",
              image: "https://statichk.footprint.network/article/b98a81de-f56b-4804-8e8d-7fdb4117bcc8.jpg",
            },
            {
              title: "April 2024 Public Chain Update: Bitcoin Halving, Market Declines, and Key Advancements",
              desc: "This report highlights key developments in the April public chain sector, including the impact of the Bitcoin Halving, market downturns, and advancements in TON and Base.",
              image: "https://statichk.footprint.network/article/616c97da-eeca-4043-b42b-54947476e3be.png",
            }
          ]}
          title={"Reports"}/>
      ),
      link: "https://www.footprint.network/news/blog",
    }
  ];
  return (
    <div className="About__data-feature">
      <h2 className="About__title">
        Expand Your Insights with Comprehensive <br/>Blockchain Data Analysis
      </h2>
      <Link to={cards[current]?.link} target="_blank"><h3>{cards[current]?.title}</h3></Link>
      <h4>{cards[current]?.desc}</h4>
      <Carroussel
        cards={cards}
        height="700px"
        width="30%"
        margin="0 auto"
        offset={2}
        showArrows={false}
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
