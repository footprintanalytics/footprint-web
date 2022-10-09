/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";

const DataApiAlphaTest = () => {
  const array = [
    {
      img: "https://statichk.footprint.network/img_da_bg_2022100811.png",
    },
    {
      img: "https://statichk.footprint.network/img_da_bg_2022100812.png",
    },
    {
      img: "https://statichk.footprint.network/img_da_bg_2022100813.png",
    },
    {
      img: "https://statichk.footprint.network/img_da_bg_2022100814.png",
    },
    {
      img: "https://statichk.footprint.network/img_da_bg_2022100815.png",
    },
    {
      img: "https://statichk.footprint.network/img_da_bg_2022100816.png",
    },
    {
      img: "https://statichk.footprint.network/img_da_bg_2022100817.png",
    },
    {
      img: "https://statichk.footprint.network/img_da_bg_2022100818.png",
    },
  ];
  const feedbacks = [
    {
      name: "Erina",
      content:
        "I also noticed CMC's report and DeGame's reports are super similar. Turns out they both use Footprints. One of Binance Macro Reports used Footprints too! \nFor GameFi data = I think its great actually. Intuitive UI/UX, love the login between email vs. mm connect.",
      img: "https://static.footprint.network/img_da_bg_2022100885.png",
      project: "The Block Research Team",
      profession: "(Senior Analyst)",
    },
    {
      name: "Miguel",
      content:
        "I made a few calls on BSC and it's returning the expected transactions for a wider date range, so I think we can make it work.\nWe rather use you guys for everything.",
      img: "https://static.footprint.network/img_da_bg_2022100885.png",
      project: "APY.Vision",
      profession: "(Dev Lead)",
    },
    {
      name: "Anonymous",
      content:
        "Footprint Analytics は SQL クエリを使用せずに簡単にデータの抽出ができるものの。\nFootprint はクエリを使用すぜにクイックな分析が可能なため、初手として直感的にデータを理解するには最適です。",
      img: "https://static.footprint.network/img_da_bg_2022100885.png",
      project: "Fungible Analyst",
      profession: " ",
    },
  ];
  return (
    <div className="data-api__alpha-test data-api__alpha-test-bg">
      <h1>Alpha-Tested by</h1>
      <div className="data-api__partners">
        <ul>
          {array.map((item, index) => {
            return (
              <li key={index}>
                <img src={item.img} alt={"footprint"} />
              </li>
            );
          })}
        </ul>
      </div>
      <div className="data-api__feedbacks">
        <ul>
          {feedbacks.map((item, index) => {
            return (
              <li
                key={index}
                className="data-api__feedbacks-li data-api__feedbacks-li-bg"
              >
                <div className="flex flex-row mb2">
                  {/*<img src={item.img} alt="footprint" />*/}
                  <div className="flex flex-column">
                    <div className="flex flex-row align-baseline">
                      <h3>{item.name}</h3>
                      <h4>{item.profession}</h4>
                    </div>
                    <span className="data-api__feedbacks-li-project">
                      {item.project}
                    </span>
                  </div>
                </div>
                <span className="data-api__feedbacks-li-content">
                  {item.content}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default DataApiAlphaTest;
