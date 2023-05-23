/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import Link from "metabase/core/components/Link";
import { getOssUrl } from "metabase/lib/image";

const BatchDownloadData = () => {

  const practices = [
    {
      title: "Using On-chain Data Modeling to Identify Sybil Attacks: Trusta Case Study",
      img: "batch-download/img_best_1.png",
      buttonText: "Explore user cases >",
      link: "https://www.footprint.network/article/using-on-chain-data-modeling-to-identify-sybil-attacks-trusta-case-study-hlSkh84j",
    },
    {
      title: "How Batch Downloads Can Solve the NFT Wash Trading Problem",
      img: "batch-download/img_best_2.png",
      buttonText: "Explore user cases >",
      link: "article/how-batch-downloads-can-solve-the-nft-wash-trading-problem-zSC4XMBb",
    },
    {
      title: "Tracking Monetary Flow Through on-Chain Transaction Analysis",
      img: "batch-download/img_best_3.png",
      buttonText: "Explore user cases >",
      link: "article/use-case-tracking-monetary-flow-through-on-chain-transaction-analysis-iqfk13Ck",
    },
  ]

  return (
    <div className="batch-download__data">
      <div className="batch-download__data-circle-1"/>
      <div className="batch-download__data-circle-2"/>
      <div className="batch-download__data-circle-3"/>
      <h1>Seamless historical data delivery</h1>
      <span>Transfer vast historical data across various file formats while leveraging cloud storage.</span>
      <div className="batch-download__data-pic">
        <img src={getOssUrl("batch-download/img_data.png")} alt="data-pic"/>
      </div>
      <h1>Best practices for batch downloading</h1>
      <div className="batch-download__best-practices">
        <ul>
          {practices.map(item => {
            return (
              <Link key={item.title} to={item.link} target="_blank">
                <li>
                  <img src={getOssUrl(item.img)} alt={item.title} />
                  <h3>{item.title}</h3>
                  <Link to={item.link}>{item.buttonText}</Link>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default BatchDownloadData;
