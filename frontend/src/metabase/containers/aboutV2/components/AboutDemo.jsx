/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";
import AboutButton from "metabase/containers/aboutV2/components/AboutButton";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";

const AboutDemo = () => {
  const data = [
    {
      title: "Research Portal",
      desc: "Built by the researcher team for researchers",
      content: <span>A one-stop data research tool covering GameFi, NFT, and Chain, unlocking your <br />capabilities from industry, to chain ecosystem to individual projects and more.</span>,
      buttons: [
        {
          buttonText: "Explore Research Portal",
          link: "https://www.footprint.network/research/gamefi",
        }
      ],
      image: "home-v2/img-demo-1-1.png",
      bg: "home-v2/img-demo-1-2.png",
    },
    {
      title: "Growth Analytics",
      desc: "One platform for your team and user growth",
      content: <span>Dive into data insights and get an edge in your marketing strategy with <br/>Footprint GA by bringing all of your Web2 and Wed3 data sources together.</span>,
      buttons: [
        {
          buttonText: "Explore Analytics GA",
          link: "https://www.footprint.network/growth",
        }
      ],
      image: "home-v2/img-demo-2-1.png",
      bg: "home-v2/img-demo-2-2.png",
      align: "center"
    },
    {
      title: "Analytics APP",
      desc: "Zero coding analytics as Tableau for crypto",
      content: <span>Use Footprint real-time on-chain data and uploaded data to build charts and <br/>dashboards that showcase cutting-edge blockchain market insights without code <br/>using a drag-and-drop interface as well as with SQL.</span>,
      buttons: [
        {
          buttonText: "Explore Analytics APP",
          link: "https://www.footprint.network/dashboards",
        }
      ],
      image: "home-v2/img-demo-3-1.png",
      bg: "home-v2/img-demo-3-2.png",
    },
    {
      title: "Data API",
      desc: "Build your application with the Data API",
      content: <span>A unified data API for NFTs, GameFi, and DeFi across all major chain ecosystems. <br/>Support not only raw data but also statistics metrics with one line of code.</span>,
      buttons: [
        {
          buttonText: "Explore Data API",
          link: "https://www.footprint.network/data-api",
        },
        {
          buttonText: "Batch Download",
          link: "https://www.footprint.network/batch-download",
        }
      ],
      image: "home-v2/img-demo-4-1.png",
      bg: "home-v2/img-demo-4-2.png",
    },
  ];

  return (
    <div className="About__demo">
      <div className="About__demo-bottom">
        {data.map(item => {
          return (
            <div key={item.title} className="About__demo-analytics-app" style={{ backgroundImage: `url("${getOssUrl(item.bg)}")`}}>
              <div style={{ paddingLeft: 60 }}>
                <h3>{item.title}</h3>
                <h4>{item.desc}</h4>
                {item.content}
                <div className="About__demo-data-api-buttons">
                  {item.buttons.map(button => {
                    return (
                      <AboutButton
                        key={button.buttonText}
                        className="mt4 mb4"
                        buttonText={button.buttonText}
                        link={button.link}
                      />
                    )
                  })}
                </div>
              </div>
              <AboutImage className="About__demo-long-app-container x" src={getOssUrl(item.image)} alt="Research Portal" style={{ justifyContent: item.align || "flex-end" }}/>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default AboutDemo;
