/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import BatchDownloadButtons from "metabase/containers/solution/components/batchDownloadButtons";
import { getOssUrl } from "metabase/lib/image";
import cx from "classnames";
const DataDrivenGame = () => {
  const data = [
    {
      "title": <div className="flex flex-column"><h3>Access Blockchain Data </h3><h4>Effortlessly and Fast</h4></div>,
      "content": "Use our API to query blockchain data \nwith a single line of code and batch \ndownload full historical data in minutes.",
      "image": getOssUrl("solution/img-games-drive-data1.png"),
      "imageWidth": "754px",
      "imageHeight": "293px",
      "align": "left",
    },
    {
      "title": <div className="flex flex-column"><h4>Unified Analytics </h4><span className="flex align-center" style={{gap: 6}}><h4>Platform for</h4><h3>Centralizing</h3></span><h3>All Gaming Data</h3></div>,
      "content": "Seamlessly integrate off-chain and \non-chain data using our 30+ \nready-made connectors and SDK \nto build data pipelines without an \nin-house data team.",
      "image": getOssUrl("solution/img-games-drive-data2.png?2=3"),
      "imageWidth": "794px",
      "imageHeight": "389px",
      "align": "right",
      "paddingTop": 80,
      "liMarginTop": 120,
    },
    {
      "title": <div className="flex flex-column"><h4>BI Platform with 360°</h4><span className="flex align-center gap-6"><h4>Insights for</h4><h3> Informed Decisions</h3></span></div>,
      "content": "Comprehensive coverage of gaming data, \nencompassing in-game assets, on-chain \nand off-chain user lifecycles (acquisition \nto retention), granular revenue analysis, \ncommunity metrics, and more. ",
      "image": getOssUrl("solution/img-games-drive-data3.png"),
      "imageWidth": "828px",
      "imageHeight": "603px",
      "align": "left",
      "paddingTop": 100,
      "imageMarginLeft": -120,
      "textColor": "#ffffff90",
      "liPaddingTop": 30,
      "liPaddingBottom": 40,
      "bgClass": "solution__data-game-bg",
    },

  ]
  return (
    <div className="solution__data-game">
      <div className="solution__title-head">
        <div className="flex align-center"><h2 className="solution__title-main">Drive Data-Backed Gaming Strategies With</h2><h3 className="solution__title-highlight">Our Intelligent Data Suite</h3></div>
      </div>
      <ul>
      {data.map((item, index) => {
        return (
          <li key={index} className={cx(item["li-class"], item.bgClass)} style={{ flexDirection: item.align === "left" ? "row" : "row-reverse", marginTop: item.liMarginTop || 0, paddingTop: item.liPaddingTop || 0, paddingBottom: item.liPaddingBottom || 0 }}>
            {item.title? (
              <>
                <div className={`flex flex-column ${item["text-layout-class"] || ""}`} style={{paddingTop: item.paddingTop || 0}}>
                  {item.title}
                  <span style={{marginTop:10, color: item.textColor || "#F8F8FF"}}>{item.content}</span>
                </div>
                <img src={item.image} alt="" style={{width: item.imageWidth, height: item.imageHeight, marginLeft: item.imageMarginLeft || 0}}/>
              </>
            ) : (<>
              <img src={item.image} alt="" style={{width: item.imageWidth, height: item.imageHeight, marginLeft: item.imageMarginLeft || 0}}/>
            </>)}
          </li>
        )
      })}
      </ul>
    </div>
  );
};

export default DataDrivenGame;
