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
      img: "https://statichk.footprint.network/img_da_bg_2022100813.png",
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
      name: "Gordon Lewis",
      content:
        "With Footprint, I can create complex visualizations by simply dragging and dropping fields to deliver our insights in a much easier way.",
      img: "https://static.footprint.network/img_da_bg_2022100885.png",
      project: "NFT",
      profession: "Engineering Manager",
    },
    {
      name: "Gordon Lewis",
      content:
        "With Footprint, I can create complex visualizations by simply dragging and dropping fields to deliver our insights in a much easier way.",
      img: "https://static.footprint.network/img_da_bg_2022100885.png",
      project: "NFT",
      profession: "Engineering Manager",
    },
    {
      name: "Gordon Lewis",
      content:
        "With Footprint, I can create complex visualizations by simply dragging and dropping fields to deliver our insights in a much easier way.",
      img: "https://static.footprint.network/img_da_bg_2022100885.png",
      project: "NFT",
      profession: "Engineering Manager",
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
                  <img src={item.img} alt="footprint" />
                  <div>
                    <div>
                      <span>{item.name}</span>
                      <span className="ml3 footprint-secondary-text2">
                        {item.project}
                      </span>
                    </div>
                    <span>{item.profession}</span>
                  </div>
                </div>
                <span>{item.content}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default DataApiAlphaTest;
