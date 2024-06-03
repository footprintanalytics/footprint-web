/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";
import { Image } from "antd";

const AboutDepth = () => {

  const array = [
    {
      title: "Games",
      desc: "Unify and unlock the power of your game data.",
      img: getOssUrl("home-v2/img-solutions-games.png"),
      icon: getOssUrl("home-v2/icon_home_solution1.png"),
    },
    {
      title: "Blockchains",
      desc: "Expand ecosystem reach and presence.",
      img: getOssUrl("home-v2/img-solutions-blockchain.png"),
      icon: getOssUrl("home-v2/icon_home_solution2.png"),
    },
    {
      title: "Marketing & Consulting",
      desc: "Conduct comprehensive wallet analysis for data-driven customer acquisition.",
      img: getOssUrl("home-v2/img-solutions-marketing.png"),
      icon: getOssUrl("home-v2/icon_home_solution3.png"),
    },
    {
      title: "Community",
      desc: "Boost community growth with intelligent tools and contribution tracking.",
      img: getOssUrl("home-v2/img-solutions-community.png"),
      icon: getOssUrl("home-v2/icon_home_solution4.png"),
    },
  ]

  return (
    <div className="About__solutions">
      <div className="About__depth-circle-bg" style={{ left: "8%" }}/>
      <h2 className="About__title">Tailored Blockchain Data Solutions</h2>
      <h3 className="mt4 About__sub-title">Pioneering Data and Analytics Solutions Purpose-Built for Multiple Verticals</h3>
      <div className="About__solutions-line" />
      <div className="About__solutions-inner">
        {
          array.map(item => {
            return (
              <div className="About__solutions-inner-li" key={item.title}>
                {/*<Image src={item.icon}/>*/}
                <img src={item.img} />
                <div className="flex flex-col" style={{ padding: "30px 40px" }}>
                  <div className="flex mb1">
                    <img src={item.icon} className="mr2"/><h3>{item.title}</h3>
                  </div>
                  <span style={{ height: 70 }}>{item.desc}</span>
                  <div className="learn-more">
                    <div>Learn More {"->"}</div>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  );
};

export default AboutDepth;
