/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";
import AboutButton from "metabase/containers/aboutV2/components/AboutButton";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";
import Carroussel from "metabase/containers/aboutV2/components/spide/Carroussel";
import Card from "metabase/containers/aboutV2/components/spide/Card";
import Link from "metabase/core/components/Link";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import './styles.css';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import PublicQuestion from "metabase/public/containers/PublicQuestion";
const AboutDataFeature = () => {
  const [current, setCurrent] = React.useState(0);
  console.log("current", current)
  let cards = [
    {
      key: 1,
      title: "Games",
      desc: "Explore 3,000+ games with detailed data on gamers, revenue, in-game assets, and more.",
      content: (
        <Card imagen="https://static.footprint.network/home-v2/img_Insights_games.png" title={"Games"} chart={"https://www.footprint.network/public/chart/Blockchain-Games-Active-Users-fp-435743d2-58cf-4397-9bf0-689b8db107d2#theme=night"}/>
      ),
      link: "https://www.footprint.network/research/gamefi/game-rankings/top-games",
      uuid: "f466d2e3-ad64-4944-8fc8-6e6edf96bb77",
      // uuid: "435743d2-58cf-4397-9bf0-689b8db107d2",
    },
    {
      key: 2,
      title: "Chain",
      desc: "Embark on a journey across 30+ blockchains, unlocking real-time and comprehensive blockchain network data.",
      content: (
        <Card imagen="https://static.footprint.network/home-v2/img_Insights_chain.png" title={"Chain"} chart={"https://www.footprint.network/public/chart/Cross-Chains-Daily-Active-Addresses-fp-361d2d61-1f4a-4bfb-923d-feb240c5a085#theme=night"}/>
      ),
      link: "https://www.footprint.network/research/chain/chain-rankings/top-chains",
      // uuid: "361d2d61-1f4a-4bfb-923d-feb240c5a085",
      uuid: "f03f1dfc-2066-4a72-a9f5-e1552b78de6d",
    },
    {
      key: 3,
      title: "Wallet",
      desc: "Track and trace activities, historical balance, and profiles over 100+ million addresses.",
      content: (
        <Card imagen="https://static.footprint.network/home-v2/img_Insights_wallet.png" title={"Wallet"} chart={"https://www.footprint.network/public/chart/Historical-Token-Balances-for-Wallet-fp-764ccace-e9f7-4850-98db-908996ceb164?chain=Ethereum&wallet_address=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045#theme=night"}/>
      ),
      link: "https://www.footprint.network/research/wallet",
      // uuid: "764ccace-e9f7-4850-98db-908996ceb164",
      uuid: "8459b154-59d9-4955-9e30-0cee3bdf8abf",
    },
    {
      key: 4,
      title: "Token",
      desc: "Instantly assess information for 100,000+ tokens, covering money flow, holders, and intricate details.",
      content: (
        <Card imagen="https://static.footprint.network/home-v2/img_Insights_token.png" title={"Token"} chart={"https://www.footprint.network/public/chart/Daily-Token-Trading-Value-in-CEXs-fp-0f9ed0c3-5283-4d5f-85d2-5fcff588d2ef#theme=night"}/>
      ),
      link: "https://www.footprint.network/research/token/rankings/token-exchange-net-flow",
      // uuid: "0f9ed0c3-5283-4d5f-85d2-5fcff588d2ef",
      uuid: "9dcfb087-a247-41a4-90dd-9ecc99757c20",
    },
    {
      key: 5,
      title: "NFT",
      desc: "Fetch NFT data from ownerships to sales to metadata for more than 2 million NFTs.",
      content: (
        <Card imagen="https://static.footprint.network/home-v2/img_Insights_NFT.png" title={"NFT"} chart={"https://www.footprint.network/public/chart/Weekly-Volume-by-Marketplace-fp-ca99b5e9-2ffa-4dce-834d-b646514b2d7e#theme=night"}/>
      ),
      link: "https://www.footprint.network/research/nft/nft-rankings/top-marketplaces?date=past30days~",
      // uuid: "ca99b5e9-2ffa-4dce-834d-b646514b2d7e",
      uuid: "40da07e9-4406-460d-8428-ef7dc8d881db",
    },
    {
      key: 6,
      title: "Reports",
      desc: "Stay ahead of the trend in blockchain industry. ",
      content: (
        <Card
          imagen={"https://statichk.footprint.network/article/80933845-7ac9-4322-91f8-999617408153.png"}
          title={"Reports"}/>
      ),
      image: "https://statichk.footprint.network/article/80933845-7ac9-4322-91f8-999617408153.png",
      link: "https://www.footprint.network/news/blog",
    }
  ];
  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '"></span>';
    },
  };

  return (
    <div className="About__data-feature">
      <h2 className="About__title" >
        Expand Your Insights with Comprehensive <br/>Blockchain Data Analysis
      </h2>
      <div style={{ zIndex: 1 }}>
        <Link className={"cursor-pointer"} to={cards[current]?.link} target="_blank"><h3>{cards[current]?.title}</h3></Link>
      </div>
      <div style={{ zIndex: 1 }}>
        <div className="flex"><h4>{cards[current]?.desc}</h4><Link className="cursor-pointer text-underline text-underline-hover" to={cards[current]?.link} target="_blank"><span className="ml1">Learn More</span></Link></div>
      </div>

      <Swiper
        pagination={{
          clickable: true,
        }}
        spaceBetween={30}
        modules={[Autoplay, Pagination, Navigation]}
        lazy={true}
        navigation={true}
        autoplay={{
          delay: 10000,
          disableOnInteraction: true,
        }}
        onSlideChange={(swiper) => setCurrent(swiper?.activeIndex)}
        className="mySwiper"
      >
        {cards.map((card, index) => (
          <SwiperSlide key={card.key}>
            {card.uuid && current >= index - 1 && current <= index + 1  && <PublicQuestion
              className="feature__public-dashboard"
              params={{ uuid: card.uuid }}
              location={location}
              isFullscreen={false}
              hideTitle={true}
              disableUpdateTitle={true}
              hideAllParameters
              hideFooter
            />}
            {card.image && <img src={card.image} alt={card.title} className="w-full"/>}
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="About__depth-circle-bg"/>
    </div>
  );
};

export default AboutDataFeature;
