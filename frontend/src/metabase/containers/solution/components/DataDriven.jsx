/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import BatchDownloadButtons from "metabase/containers/solution/components/batchDownloadButtons";
import { getOssUrl } from "metabase/lib/image";

const DataDriven = () => {
  const data = [
    {
      "title": "Blockchain Datasets",
      "desc": "Provide the community with blockchain analytics that \nallow them to explore data and gain unique insights.",
      "content": "Access raw, decoded, and abstracted blockchain data \nseamlessly through visualization tools and APIs, \neliminating the need to build and maintain data \npipelines.",
      "image": getOssUrl("solution/img-blockchain-datasets.png"),
      "imageWidth": "593px",
      "imageHeight": "333px",
      "align": "left",
      "paddingTop": 30,
      "gap": 100,
    },
    {
      "title": "Business Metrics Tracking",
      "desc": "Help understand protocol and user patterns with \nenhanced insights.",
      "content": "Ecosystem core teams and on-chain projects can \nunderstand ecosystem trends, analyze user \ndistribution, compare with competitors, and make \nimportant decisions for the entire ecosystem and \nproject.",
      "image": getOssUrl("solution/img-business-metrics-tracking.png"),
      "imageWidth": "579px",
      "imageHeight": "511px",
      "align": "left",
      "paddingTop": 30,
      "gap": 160,
    },
    {
      "title": "Research Portal",
      "desc": "Get the metrics that matter ecosystem and \nprojects all in one place. ",
      "content": "Pre-built dashboards covering 30+ chains, games, \nwallets, and NFTs make it the go-to research tool for \nthe community.",
      "image": getOssUrl("solution/img-research.png?1=1"),
      "imageWidth": "722px",
      "imageHeight": "577px",
      "align": "left",
      "gap": 1,
      "paddingTop": 60,
    },
    {
      "title": "Educational Articles and Reports",
      "desc": "Unlock blockchain data insights through \neducational resources and insightful reports.",
      "content": "Gain a deeper understanding of blockchain data \nthrough our expert-led articles, and learning materials. \nEmpower ecosystem users to generate valuable \ninsights and amplify their reach with research reports \nand analyses.",
      "image": getOssUrl("solution/img-educational.png"),
      "imageWidth": "635px",
      "imageHeight": "349px",
      "align": "left",
    },
  ]
  return (
    <div className="solution__data-driven solution__data-driven-bg">
      <div className="solution__title-head">
        <div className="flex align-center"><h2 className="solution__title-main">Data-Driven Blockchain Solutions</h2><h3 className="solution__title-highlight"> or Ecosystem Excellence</h3></div>
        <span className="solution__title-desc">Comprehensive solutions for seamless data exploration, ecosystem understanding, and community education.</span>
      </div>
      <ul >
      {data.map((item, index) => {
        return (
          <li key={index} className={item["li-class"]} style={{ flexDirection: item.align === "left" ? "row" : "row-reverse", gap: item.gap || 80 }}>
            {item.title? (
              <>
                <div className={`flex flex-column ${item["text-layout-class"] || ""}`} style={{paddingTop: item.paddingTop || 0}}>
                  <h3>{item.title}</h3>
                  <h4>{item.desc}</h4>
                  <span>{item.content}</span>
                </div>
                <img src={item.image} alt="" style={{width: item.imageWidth, height: item.imageHeight}}/>
              </>
            ) : (<>
              <img src={item.image} alt="" style={{width: item.imageWidth, height: item.imageHeight}}/>
            </>)}
          </li>
        )
      })}
      </ul>
    </div>
  );
};

export default DataDriven;
