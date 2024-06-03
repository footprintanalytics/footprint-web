/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";
import { Image } from "antd";
import { Link } from "react-router";

const AboutDepth = () => {

  const array = [
    {
      title: "Games",
      desc: "Unify and unlock the power of your game data.",
      img: getOssUrl("home-v2/img-solutions-games.png"),
      icon: getOssUrl("home-v2/icon_home_solution1.png"),
      link: "https://docs.google.com/presentation/d/1Xmye6BfGWhlde42LnwNkVylRWOaSSXdbY7zfgZHAZOM/edit#slide=id.g2b36d9fc51e_1_0",
    },
    {
      title: "Blockchains",
      desc: "Expand ecosystem reach and presence.",
      img: getOssUrl("home-v2/img-solutions-blockchain.png"),
      icon: getOssUrl("home-v2/icon_home_solution2.png"),
      link: "https://docs.google.com/presentation/d/1vKXAHaKqp7oUBnQP1qxmr84WpFX1pmXChGIl6R9Fle4/edit#slide=id.g128e0ee6714_0_0",
    },
    {
      title: "Marketing & Consulting",
      desc: "Conduct comprehensive wallet analysis for data-driven customer acquisition.",
      img: getOssUrl("home-v2/img-solutions-marketing.png"),
      icon: getOssUrl("home-v2/icon_home_solution3.png"),
      link: "https://docs.google.com/presentation/d/1UXiE1dvMIKhsUHwwVpzixc4v7lVHJNzG3WIYgpfw0AU/edit#slide=id.g25c23df782d_0_0",
    },
    {
      title: "Community",
      desc: "Boost community growth with intelligent tools and contribution tracking.",
      img: getOssUrl("home-v2/img-solutions-community.png"),
      icon: getOssUrl("home-v2/icon_home_solution4.png"),
      link: "https://pea.ai/",
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
                    <Link className="text-underline text-underline-hover" to={item.link}>
                      <div>Learn More {"->"}</div>
                    </Link>
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
