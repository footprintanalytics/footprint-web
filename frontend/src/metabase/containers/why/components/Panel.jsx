/* eslint-disable react/prop-types */

import React, { useState } from "react";
import { getOssUrl } from "metabase/lib/image";
import { Carousel } from "antd";
import cx from "classnames";
import TitleDesc from "metabase/containers/why/components/TitleDesc";

const data = [
  {
    nav: "No coding or technical \nrequirements",
    title: "No coding or technical requirements",
    desc:
      "Footprint solves the problem of exploring blockchain data and gives you an “easy as pie”, drag-and-drop experience. No need for SQL queries or coding to explore blockchain data—anyone can discover and present actionable DeFi insights with our superior interface.",
    img: "img-why-carousel-1.png",
  },
  {
    nav: "Fork charts with one click",
    title: "Fork charts with one click",
    desc:
      "Our solution provides rich data analytics templates that support forks with any open analytics table on the platform with one click, helping you easily create and manage your personalized dashboards. You can also share your data tables and dashboards with your partners or social channels to provide your insights.",
    img: "img-why-carousel-2.png",
  },
  {
    nav: "Supports cross-chain data",
    title: "Supports cross-chain data",
    desc:
      "Subscribers get access to cross-chain and multi-project data, enabling them to create and analyze charts on all aspects of the blockchain. ",
    img: "img-why-carousel-3.png",
  },
  {
    nav: "Advanced wallet labelling",
    title: "Advanced wallet labelling",
    desc:
      "Footprint tracks and labels every individual wallet address exchange, meaning you can see which address is accumulating or selling off specific tokens and how much profit it generates for a coin or portfolio. With token metrics for usage, engagement, and liquidity, you can make informed decisions before and after investing. ",
    img: "img-why-carousel-4.png",
  },
  {
    nav: "Portfolio and analysis",
    title: "Portfolio and pool analysis",
    desc:
      "Users can see both real time and historical data from addresses and pools. ",
    img: "img-why-carousel-5.png",
  },
  {
    nav: "Community-powered, \nDAO-inspired",
    title: "Community-powered, DAO-inspired",
    desc:
      "Footprint is home to a global user group that shares insights and drives the platform’s development. Many active, diverse and engaged members support each other through the community forum. ",
    img: "img-why-carousel-6.png",
  },
];

const Display = ({ item }) => {
  return (
    <React.Fragment>
      <div className="panel__display-item-title footprint-title1">
        {item.title}
      </div>
      <div className="panel__display-item-desc footprint-secondary-text1">
        {item.desc}
      </div>
      <div className="panel__display-item-pic">
        <img
          className="ml-auto mr-auto"
          style={{ width: "100%", height: "auto" }}
          src={getOssUrl(item.img)}
          alt={item.title}
        />
      </div>
    </React.Fragment>
  );
};

const Panel = () => {
  const carouselRef = React.createRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemOnClick = index => {
    carouselRef.current.goTo(index, true);
  };

  return (
    <div className="panel why-component">
      <TitleDesc
        title={"Footprint makes blockchain analytics possible for anyone"}
        desc={
          "Footprint aggregates and cleans data from all major chains, platforms and pools, then presents in a way \n that’s easy to understand and work with."
        }
      />
      <div className="panel__display">
        <div className="panel__nav">
          {data.map((item, index) => {
            return (
              <div
                key={item.nav}
                className={cx("panel__nav-item")}
                onMouseOver={() => itemOnClick(index)}
              >
                <div
                  className={
                    currentIndex === index
                      ? "panel__nav-item-select"
                      : "panel__nav-item-normal"
                  }
                >
                  {currentIndex === index && (
                    <div className="panel__nav-item-circle">
                      <div className="panel__nav-item-inner-circle" />
                    </div>
                  )}
                  {item.nav}
                </div>
              </div>
            );
          })}
        </div>
        <div className="panel__right">
          <Carousel
            className="panel__carousel"
            ref={carouselRef}
            dotPosition={"left"}
            dots={false}
            autoplay
            beforeChange={(from, to) => {
              setCurrentIndex(to);
            }}
          >
            {data.map(item => {
              return (
                <div key={item.nav} className="panel__box">
                  <Display item={item} />
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Panel;
