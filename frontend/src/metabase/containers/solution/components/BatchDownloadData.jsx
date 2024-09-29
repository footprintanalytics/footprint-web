/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import Link from "metabase/core/components/Link";
import { getOssUrl } from "metabase/lib/image";

const BatchDownloadData = props => {
  const {
    practices = [
      {
        title: "Ronin",
        desc: "Educational GPT",
        img: getOssUrl("solution/img-data-ronin.jpg"),
      },
      {
        title: "Phantom Arena",
        desc: "Airdrop Campaign",
        img: getOssUrl("solution/img-data-phantom-arena.jpg"),
      },
      {
        title: "BEVM",
        desc: "Visionary Builder Quest",
        img: getOssUrl("solution/img-data-bevm.jpg"),
      },
    ]
  } = props;

  return (
    <div className="solution__data">
      <h1>A Proven Track Record</h1>
      <div className="solution__best-practices">
        <div className="solution__best-header">
          <span className="solution__best-header-text">Case Studies :</span>
          <Link to="/news/blog?category=product&subMenu=Use%20Case">
            <span className="solution__best-header-text">{"View More >"}</span>
          </Link>
        </div>
        <ul>
          {practices.map(item => {
            return (
              <div key={item.title}>
                <Link to={item.link} target="_blank">
                  <li style={{height: item.height || 322}}>
                    <img src={item.img} alt={item.title} />
                    <div className={"solution__best-bottom"}>
                      <h3>{item.title}</h3>
                      <h3>{item.desc}</h3>
                    </div>
                  </li>
                </Link>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default BatchDownloadData;
