/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";

const DataApiLowering = () => {
  const array = [
    {
      title: "Save money",
      desc: "Save development resources to do more valuable work",
      img: "https://statichk.footprint.network/img_da_bg_2022100831.png",
    },
    {
      title: "Save time",
      desc: "Supercharge your development cycle in days",
      img: "https://statichk.footprint.network/img_da_bg_2022100832.png",
    },
    {
      title: "Full data",
      desc: "One call to retrieve all data across any supported blockchain",
      img: "https://statichk.footprint.network/img_da_bg_2022100833.png",
    },
    {
      title: "Customized",
      desc: "Multiple open and flexible data access methods",
      img: "https://statichk.footprint.network/img_da_bg_2022100834.png",
    },
  ];
  return (
    <div className="data-api__lowering data-api__lowering-bg">
      <h1>Lowering the Barrier to Web3 for Developers</h1>
      <ul>
        {array.map(item => {
          return (
            <li key={item.title}>
              <img src={item.img} alt={item.title} />
              <h3>{item.title}</h3>
              <span>{item.desc}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DataApiLowering;
