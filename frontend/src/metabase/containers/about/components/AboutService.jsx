/* eslint-disable curly */
import { RightOutlined } from "@ant-design/icons";
import { message } from "antd";
import { trackStructEvent } from "metabase/lib/analytics";
import { getOssUrl } from "metabase/lib/image";
import React from "react";
import WrapLink from "./WrapLink";

const AboutService = () => {
  const list = [
    {
      title: "Footprint Analytics Widget",
      desc: (
        <>
          Show blockchain data on your site
          <br />
          Supports multiple templates
          <br />
          Supports custom configurations
        </>
      ),
      url: "/widget",
      icon: getOssUrl("20220602192449.png"),
      width: "48px",
      height: "36px",
    },
    {
      title: "Research Service and Tool",
      desc: (
        <>
          Weekly & monthly reports
          <br />
          Indicator alerts
          <br />
          Custom and on-demand research
        </>
      ),
      url: "/news/featured",
      icon: getOssUrl("20220602192529.png"),
      width: "37px",
      height: "48px",
    },
    {
      title: "Social Media Sharing Tool",
      desc: (
        <>
          Build and share your profile
          <br />
          Whitelabel your charts and dashboards
        </>
      ),
      url: "/search?model=creator",
      icon: getOssUrl("20220602192551.png"),
      width: "41px",
      height: "46px",
    },
    {
      title: "Marketing Tool",
      desc: (
        <>
          Competitive analysis and tracking
          <br />
          Find and incentivize target users and track...
          <br />
          Discover user portrait
        </>
      ),
      url: "https://www.footprint.network/defi360",
      icon: getOssUrl("20220602192747.png"),
      width: "48px",
      height: "48px",
    },
    {
      title: "Data API",
      desc: (
        <>
          A unified API allows you to pull detailed, historical and granular
          blockchain data
        </>
      ),
      url: "https://docs.footprint.network/api/download-data",
      icon: getOssUrl("20220602192809.png"),
      width: "48px",
      height: "43px",
    },
  ];

  return (
    <div
      className="About__service"
      style={{ backgroundImage: `url(${getOssUrl("20220607202702.png")})` }}
    >
      <div className="About__container">
        <h3 className="About__title">Our services and expertise</h3>
        <ul>
          {list.map(item => (
            <li key={item.title}>
              <div className="About__service-icon">
                <img
                  src={item.icon}
                  alt={item.title}
                  style={{ width: item.width, height: item.height }}
                />
              </div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
              <WrapLink
                url={item.url}
                onClick={() => {
                  trackStructEvent("About", `More ${item.title}`);
                  if (item.url) return;
                  message.info({
                    content: (
                      <>
                        Coming soon, contact us on{" "}
                        <a
                          href="https://discord.gg/3HYaR6USM7"
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            textDecoration: "underline",
                            color: "#3434b2",
                          }}
                        >
                          Discord
                        </a>
                        .
                      </>
                    ),
                  });
                }}
              >
                More <RightOutlined />
              </WrapLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AboutService;
