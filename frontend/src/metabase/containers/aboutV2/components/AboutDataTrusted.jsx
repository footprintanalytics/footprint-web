/* eslint-disable react/prop-types */
import React, { useRef, useEffect, useState } from "react";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";
import { getOssUrl } from "metabase/lib/image";
const AboutDataTrusted = () => {
  let data = [
    {
      name: "Gabriela Castillo Areco",
      desc: "RootstockLabs",
      post: "Data Lead",
      img: "home-v2/img_trusted_rootstock.png?1=1",
      detail: "Footprint Analytics’ SQL service is incredibly intuitive, with well-crafted documentation and a top-notch tool for contract submission and decoding, excelling in both speed and completeness. The team is highly professional and technical, consistently providing thorough and effective answers to any questions."
    },
    {
      name: "Heetae Lyu",
      desc: "NHN Corporation",
      post: "CTO",
      img: "home-v2/img_trusted_nhn.png?1=1",
      detail: "NHN has maintained a successful social casino service in the Web2 area through data analysis for over 30 years.\n" +
        "In the process of preparing the Pebble project to expand into Web3, we are receiving a lot of help from Footprint's outstanding data processing and analysis know-how in the Web3 area. We are looking forward for a smooth project launch with their active real-time support.\n"
    },
    {
      name: "Simon",
      desc: "Trusta",
      post: "Founder & CTO",
      img: "home-v2/img_trusted_trusta.png",
      detail: "Without the on-chain data supported by Footprint, we cannot deliver our TrustScan, an AI-powered Sybil resistance product in just two months. We appreciate Footprint for their data coverage of over 20 chains, high-quality and structured data, and the instant tech support by Footprint engineers."
    },
    {
      name: "Jeffrey Espejo",
      desc: "Gala",
      post: "VP of Blockchain",
      img: "home-v2/img_trusted_gala.png?1=1",
      detail: "It's amazing what Footprint is doing for the blockchain space as a whole. Working with the team to integrate GalaChain to their platform has been an amazing experience!"
    },
    {
      name: "Ongun Özdemir",
      desc: "RootstockLabs",
      post: "Sr. Venture Associate",
      img: "home-v2/img_trusted_rootstock.png?1=1",
      detail: "Footprint analytics has been transformational for many facets of the Rootstock ecosystem. From developers to the largest dApps, we’ve managed to derive actionable insights to grow our community and execute our strategy."
    },
    {
      name: "Nilah",
      desc: "SPACE ID",
      post: "Senior Community Manager",
      img: "home-v2/img_trusted_space_id.png",
      detail: "Partnering with Footprint has been a fantastic experience for SPACE ID. By integrating our Web3 Name SDK, Footprint has made it easy for users to search .bnb and .arb domains and track wallets effortlessly. This integration showcases Footprint's advanced analytics and visualization tools have provided our community with valuable insights, supporting better decision-making.\n" +
        "We look forward to continuing our collaboration and exploring new opportunities together."
    },
    {
      name: "Isaac Dubuque",
      desc: "Agave",
      post: "CEO & Co-founder",
      img: "home-v2/img_trusted_agave.png",
      detail: "Thanks to Footprint's SQL API, we have been able to efficiently access vast amounts of well-structured blockchain and market data across multiple chains. This has enabled us to power our analysis of Web3 gaming data and discover valuable insights.\n" +
        "Above is API focused, but I've really appreciated the Footprint teams' support. The team is always quick to help and resolve any issues we have. This is a great part of using Footprint services."
    },
  ]
  const newData = Array(30).fill().map(() => JSON.parse(JSON.stringify(data))).flat()

  const [hasVisited, setHasVisited] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasVisited) {
          setHasVisited(true);
          observer.unobserve(ref.current);
        }
      });
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasVisited]);

  return (
    <div className="About__data-trusted" ref={ref}>
      <h2 className="About__title">
        What Our Partners Are Saying
      </h2>
      <div className="About__data-trusted-inner">
          <ul className={`${hasVisited? "About__data-trusted-inner-anim" : ""}`}>
            {newData.map((item, index) =>
              <div key={index} className="About__data-trusted-carousel">
                <div className={"About__data-trusted-detail"}>{item.detail}</div>
                <div className="About__data-trusted-carousel-left">
                  <AboutImage alt={item.name} src={getOssUrl(item.img)} style={{ height: 70, width: 70 }}/>
                  <div className="flex flex-col">
                    <h3>{item.name}</h3>
                    <div className={"flex justify-left align-center"}><span>{`${item.desc}  |  ${item.post}`}</span></div>
                  </div>
                </div>
              </div>
            )}
          </ul>
      </div>
    </div>
  );
};

export default AboutDataTrusted;
