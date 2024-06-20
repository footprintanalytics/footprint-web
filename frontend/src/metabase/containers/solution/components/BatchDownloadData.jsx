/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import Link from "metabase/core/components/Link";
import { getOssUrl } from "metabase/lib/image";

const BatchDownloadData = () => {

  const practices = [
    {
      title: "Ronin",
      desc: "Educational GPT",
      img: "solution/img-data-ronin.jpg",
    },
    {
      title: "Phantom Arena",
      desc: "Airdrop Campaign",
      img: "solution/img-data-phantom-arena.jpg",
    },
    {
      title: "BEVM",
      desc: "Visionary Builder Quest",
      img: "solution/img-data-bevm.jpg",
    },
  ]

  return (
    <div className="solution__data">
      <h1>A Proven Track Record</h1>
      <div className="solution__best-practices">
        <div className="solution__best-header">
          <span className="solution__best-header-text">Case Studies :</span>
          {/*<span className="solution__best-header-text">{"View All >"}</span>*/}
        </div>
        <ul>
          {practices.map(item => {
            return (
              <div key={item.title}>
                <li>
                  <img src={getOssUrl(item.img)} alt={item.title} />
                  <div className={"solution__best-bottom"}>
                    <h3>{item.title}</h3>
                    <h3>{item.desc}</h3>
                  </div>
                </li>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default BatchDownloadData;
