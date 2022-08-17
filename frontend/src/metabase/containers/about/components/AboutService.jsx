/* eslint-disable curly */
import { getOssUrl } from "metabase/lib/image";
import React from "react";

const AboutService = () => {
  const list = [
    {
      title: "All-in-one API",
      desc: <>One unified API for the widest chain and domain access.</>,
      icon: getOssUrl("img_about_service_2022081301.png?1"),
      width: "117px",
      height: "99px",
    },
    {
      title: "Richest data tiers",
      desc: <>Database with raw and also semantic data.</>,
      icon: getOssUrl("img_about_service_2022081302.png?1"),
      width: "114px",
      height: "100px",
    },
    {
      title: "Flexible infrastructure",
      desc: (
        <>Secure and scalable infrastructure supports Rest API and GraphQL.</>
      ),
      icon: getOssUrl("img_about_service_2022081303.png?1"),
      width: "114px",
      height: "101px",
    },
    {
      title: "Customizable",
      desc: <>An API engineered to fit all your data needs.</>,
      icon: getOssUrl("img_about_service_2022081304.png?1"),
      width: "105px",
      height: "116px",
    },
    {
      title: "Timely support",
      desc: <>One-on-one support and assistance whenever you need it.</>,
      icon: getOssUrl("img_about_service_2022081305.png?1"),
      width: "99px",
      height: "109px",
    },
  ];

  return (
    <div className="About__service">
      <div className="About__container">
        <h3 className="About__title">
          Use <span className="About__title-bland">Data API</span> to Built Your
          Application
        </h3>
        <ul>
          {list.map(item => (
            <li key={item.title}>
              {item.icon && (
                <div className="About__service-icon">
                  <img src={item.icon} alt={item.title} />
                </div>
              )}
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
              {/*<WrapLink
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
                {item.button ? (
                  item.button
                ) : (
                  <>
                    More <RightOutlined />
                  </>
                )}
              </WrapLink>*/}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AboutService;
