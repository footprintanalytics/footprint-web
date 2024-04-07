/* eslint-disable react/prop-types */
import React from "react";
import { Carousel } from "antd";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";
import { getOssUrl } from "metabase/lib/image";

const AboutDataTrusted = () => {
  const data = [
    {
      name: "Agave",
      desc: "Isaac Dubuque",
      post: "CEO & Co-founder",
      img: "home-v2/img_trusted_agave.png",
      detail: "Thanks to Footprint's SQL API, we have been able to efficiently access vast amounts of well-structured blockchain and market data across multiple chains. This has enabled us to power our analysis of Web3 gaming data and discover valuable insights.\n" +
        "Above is API focused, but I've really appreciated the Footprint teams' support. @JimmyTF, is always quick to help and resolve any issues we have. This is a great part of using Footprint services"
    },
    {
      name: "Trusta",
      desc: "Simon",
      post: "Founder & CTO",
      img: "home-v2/img_trusted_trusta.png",
      detail: "Without the on-chain data supported by footprint, we cannot deliver our TrustScan, an AI-powered Sybil resistance product in just two months. We apprieciate Footprint for their data coverage of over 20 chains, high-quality and structured data, and the instant tech support by Footprint engineers."
    }
  ]
  return (
    <div className="About__data-trusted">
      <h2 className="About__title">
        Trusted by Industry leaders
      </h2>
      <div className="About__data-trusted-inner">
        <Carousel dotPosition="bottom" autoplay>
          {data.map(item =>
            <div key={item.name} className="About__data-trusted-carousel">
              <div className="About__data-trusted-carousel-left">
                <AboutImage alt={item.name} src={getOssUrl(item.img)}/>
                <h3>{item.name}</h3>
                <h4>{item.desc}</h4>
                <span>{item.post}</span>
              </div>
              <div className="About__data-trusted-carousel-right">
                {item.detail}
              </div>
            </div>
          )}
        </Carousel>
      </div>
    </div>
  );
};

export default AboutDataTrusted;
