/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import { getOssUrl } from "metabase/lib/image";

const DomainDetail = () => {
  const data = [
    {
      title: "Comprehensive and granular data",
      desc: "Cover raw data, abstraction, and statistics metrics",
      img: getOssUrl("img_dap_power_2022102301.png"),
    },
    {
      title: "Full coverage of NFT metrics",
      desc: "100+ NFT metrics from on-chain and off-chain data",
      img: getOssUrl("img_dap_power_2022102302.png"),
    },
    {
      title: "One-stop platform for all verticals",
      desc: "Pull data across various domains including NFT, GameFi, and more",
      img: getOssUrl("img_dap_power_2022102303.png"),
    },
    {
      title: "Metadata auto refreshing",
      desc: "Stay on top of metadata with our refreshing engine",
      img: getOssUrl("img_dap_power_2022102304.png"),
    },
    {
      title: "Wash trade filter",
      desc: "Reduce misleading data and assess the NFT market accurately",
      img: getOssUrl("img_dap_power_2022102305.png"),
    },
    {
      title: "Highest quality data",
      desc: "The top protocols being manually verified",
      img: getOssUrl("img_dap_power_2022102306.png"),
    },
  ];

  return (
    <div className="powerful-data powerful-data__bg">
      <div className="powerful-data__container">
        <h3>Powerful NFT data at your fingertips</h3>

        <ul>
          {data?.map(item => {
            return (
              <li key={item.title}>
                <img width={60} height={60} src={item.img} alt={item.title} />
                <div className="powerful-data__right">
                  <h4>{item.title}</h4>
                  <div className="mb2" />
                  <span>{item.desc}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default DomainDetail;
