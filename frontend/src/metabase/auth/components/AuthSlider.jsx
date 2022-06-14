/* eslint-disable no-color-literals */
/* eslint-disable react/prop-types */
import React, { Component } from "react";

import { Carousel } from "antd";
import { Flex, Box } from "grid-styled";
import { getOssUrl } from "metabase/lib/image";
import { staticBucketUrl } from "metabase/env";

export const WhatInfos = [
  {
    key: 0,
    title: "No coding or technical requirements",
    desc:
      "Footprint solves the problem of exploring blockchain data and gives you an “easy as pie”, drag-and-drop experience. No need for SQL queries or coding to explore blockchain data—anyone can discover and present actionable DeFi insights with our superior interface. ",
    image: getOssUrl("img_website_what_image1.png"),
  },
  {
    key: 1,
    title: "Fork queries with one click",
    desc:
      "Our solution provides rich data analytics templates that support forks with any open analytics table on the platform with one click, helping you easily create and manage your personalized dashboards. You can also share your data tables and dashboards with your partners or social channels to provide your insights.",
    image: getOssUrl("img_website_what_image2.png"),
  },
  {
    key: 2,
    title: "Community-powered, DAO-inspired",
    desc:
      "Many active, diverse, and engaged members inspire and support one another through community forums; the platform includes a worldwide user group to share insights and drive development. ",
    image: getOssUrl("img_website_what_image3.png"),
  },
  {
    key: 3,
    title: "Supports cross-chain data",
    desc:
      "Subscribers get a platform that provides cross-chain and multi-project type data, supporting users to draw and analyze data charts by chain and project type.",
    image: getOssUrl("img_website_what_image4.png"),
  },
  {
    key: 4,
    title: "Advanced wallet labelling",
    desc:
      "Footprint tracks and labels every individual wallet address exchange, meaning you can see which address is accumulating or selling off specific tokens and how much profit it generates for a coin or portfolio. With token metrics for usage, engagement, and liquidity, you can make informed decisions before and after investing.",
    image: getOssUrl("img_website_what_image5.png"),
  },
];

class AuthSlider extends Component {
  render() {
    return (
      <Flex
        className="LoginSliderBg"
        style={{
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          width: "100%",
          textAlign: "center",
          backgroundImage: `
            url("${staticBucketUrl}/img_login_slider_bg_circle.png"),
            url("${staticBucketUrl}/img_login_slider_bg_square.png"),
            url("${staticBucketUrl}/img_login_slider_bg_square_bottom.png"),
            url("${staticBucketUrl}/img_login_slider_bg_bottom.png")
          `,
        }}
      >
        <Carousel autoplay draggable style={{ margin: 20 }}>
          {WhatInfos.map(item => {
            return (
              <Flex
                key={item.key}
                flexDirection="column"
                justifyContent="center"
                style={{ width: "100%" }}
              >
                <div className="LoginSliderWhatTitle">{item.title}</div>
                <Box mt={20} />
                <div className="LoginSliderWhatDesc">{item.desc}</div>
                <Box mt={40} />
                <img
                  src={item.image}
                  style={{ margin: "20px auto", width: "60%" }}
                />
                <Box mt={40} />
              </Flex>
            );
          })}
        </Carousel>
      </Flex>
    );
  }
}

export default AuthSlider;
