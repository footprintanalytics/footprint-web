/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import BatchDownloadButtons from "metabase/containers/solution/components/batchDownloadButtons";
import { getOssUrl } from "metabase/lib/image";

const UserGrowth = () => {
  const data = [
    {
      "title": "Ready-To-Use",
      "desc": "Out-of-the-box functionality",
      "image": getOssUrl("solution/icon-growth1.png"),
    },
    {
      "title": "Lego-Style Structure Combinations",
      "desc": "Highly flexible and customizable",
      "image": getOssUrl("solution/icon-growth2.png"),
    },
    {
      "title": "Community-Focused",
      "desc": "Comprehensive tools for seamless \ncommunity operations",
      "image": getOssUrl("solution/icon-growth3.png"),
    },
  ]
  const data2 = [
    {
      "title": "Comprehensive Approach",
      "desc": "From individual users to projects and \nentire ecosystems",
      "image": getOssUrl("solution/icon-growth4.png"),
    },
    {
      "title": "White Label Supported",
      "desc": "Cost-efficient and ready for integration",
      "image": getOssUrl("solution/icon-growth5.png"),
    },
  ]
  return (
    <div className="solution__user-growth">
      <h2>User Growth & Loyalty Solution <span className="solution__user-growth-title-primary">Powered by AI</span></h2>
      <ul className="solution__user-growth-first-ul">
        {data.map((item, index) => {
          return (
            <li key={index} >
              <div className="flex align-center">
                <img src={item.image} alt={item.title} style={{width: 32, height: 32}}/>
                <h3>{item.title}</h3>
              </div>
              <span>{item.desc}</span>
            </li>
          )
        })}
      </ul>
      <ul className="solution__user-growth-second-ul">
        {data2.map((item, index) => {
          return (
            <li key={index} >
              <div className="flex align-center">
                <img src={item.image} alt={item.title} style={{width: 32, height: 32}}/>
                <h3>{item.title}</h3>
              </div>
              <span>{item.desc}</span>
            </li>
          )
        })}
      </ul>
    </div>
  );
};

export default UserGrowth;
