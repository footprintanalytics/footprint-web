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
      img: getOssUrl("home-v2/icon_home_solution_games.png"),
      icon: getOssUrl("home-v2/icon_home_solution1.png"),
      link: "/solution/games",
    },
    {
      title: "Blockchains",
      desc: "Expand ecosystem reach and presence.",
      img: getOssUrl("home-v2/icon_home_solution_blockchain.png"),
      icon: getOssUrl("home-v2/icon_home_solution2.png"),
      link: "/solution/blockchain",
    },
    {
      title: "Marketing & Consulting",
      desc: "Conduct comprehensive wallet analysis for data-driven customer acquisition.",
      img: getOssUrl("home-v2/icon_home_solution_marketing.png"),
      icon: getOssUrl("home-v2/icon_home_solution3.png"),
      link: "/solution/marketing",
    },
    {
      title: "Community",
      desc: "Boost community growth with intelligent tools and contribution tracking.",
      img: getOssUrl("home-v2/icon_home_solution_community.png"),
      icon: getOssUrl("home-v2/icon_home_solution4.png"),
      link: "/solution/community",
    },
  ]
  const MoreIcon =
    <svg width="141px" height="32px" viewBox="0 0 141 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g id="编组-8" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <rect id="矩形" fill="#F8F8FF" x="0" y="0" width="141" height="32" rx="16"></rect>
        <g id="Group-767" transform="translate(16.000000, 8.000000)" fill="#182034">
          <text id="Learn-More" fontFamily="Inter-SemiBold, Inter" fontSize="16" fontWeight="500" lineSpacing="16">
            <tspan x="0" y="15">Learn More</tspan>
          </text>
          <path id="Arrow-19" d="M101.783312,3.7449172 L109.748461,8.30632071 L110.519819,8.7480549 L109.741756,9.17787046 L101.707379,13.6162007 L101.223836,12.7408798 L107.586,9.225 L101.503742,9.17871525 L95.996154,9.13634919 L96.003846,8.13637878 L101.511434,8.17874483 L107.594,8.225 L101.286361,4.61269582 L101.783312,3.7449172 Z" fill-rule="nonzero"></path>
        </g>
      </g>
    </svg>

  return (
    <div className="About__solutions">
      <div className="About__depth-circle-bg" style={{ left: "8%" }}/>
      <h2 className="About__title">Tailored Blockchain Data Solutions</h2>
      <h3 className="mt1 About__sub-title" style={{color: "#A0AEC0"}}>Pioneering Data and Analytics Solutions Purpose-Built for Multiple Verticals</h3>
      <div className="About__solutions-inner">
        {
          array.map(item => {
            return (
              <div className="About__solutions-inner-li" key={item.title}>
                {/*<Image src={item.icon}/>*/}
                <img className="absolute" src={item.img} />
                <div className="flex flex-col justify-center absolute" style={{ padding: "30px 28px", height: "100%" }}>
                  <div className="flex mb1 ">
                    <img src={item.icon} className="mr1"/><h3>{item.title}</h3>
                  </div>
                  <span style={{ width: 280 }}>{item.desc}</span>
                  <div className="learn-more">
                    <Link className="text-underline text-underline-hover" to={item.link} target={item.link?.startsWith("http") ? "_blank": ""}>
                      {MoreIcon}
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
