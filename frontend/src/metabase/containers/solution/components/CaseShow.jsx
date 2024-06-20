/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import BatchDownloadButtons from "metabase/containers/solution/components/batchDownloadButtons";
import { getOssUrl } from "metabase/lib/image";

const CaseShow = () => {
  const data = [
    {
      "title": "Community AI Assistant with",
      "desc": "Private Knowledge Bases",
      "content": "Provides multi-access, multi-scenario, 24/7 community \nassistance and educational interaction. ",
      "image": getOssUrl("solution/img-case1.png"),
      "imageWidth": "609px",
      "imageHeight": "329px",
      "align": "left",
    },
    {
      "title": "Community Quest Tools for",
      "desc": "User Acquisition and Activation",
      "content": "Utilize bots for social viral growth and user activation \ndirectly within the community without external redirects.",
      "image": getOssUrl("solution/img-case2.png"),
      "imageWidth": "413px",
      "imageHeight": "416px",
      "align": "right",
      "paddingTop": 40,
    },
    {
      "title": "Community Analytics for Sentiment",
      "desc": "and Member Activities Analysis",
      "content": "Monitor community dynamics and user intent anytime,\nanywhere, providing data support for precise marketing \nand operational strategies.",
      "image": getOssUrl("solution/img-case3.png"),
      "imageWidth": "581px",
      "imageHeight": "342px",
      "align": "left",
    },
    {
      "title": <div className={"flex align-center"} style={{gap: 10}}><h3>User Score with</h3><h4>On-Chain</h4></div>,
      "desc": "and Off-Chain Contributions",
      "content": "Support customized scoring systems and data API transmission based on user behavior, aiding user system development.",
      "image": getOssUrl("solution/img-case4.png"),
      "imageWidth": "1177px",
      "imageHeight": "662px",
      "li-class": "solution__case-li-all-image",
      "text-layout-class": "solution__case-text-layout-right",
    },
    {
      "title": "Loyalty Incentive System for",
      "desc": "Organic and Sustainable Growth",
      "content": "Use user contribution score to build rewards program to \nattract genuine, loyal users.",
      "image": getOssUrl("solution/img-case5.png"),
      "imageWidth": "661px",
      "imageHeight": "422px",
      "align": "left",
      "paddingTop": 60,
    },
    {
      "title": "User Profiling for",
      "desc": "Segmented Operations",
      "content": "Understand your users from multiple dimensions such \nas product activity, community engagement, and \non-chain activity, covering the entire user lifecycle.",
      "image": getOssUrl("solution/img-case6.png"),
      "imageWidth": "597px",
      "imageHeight": "393px",
      "align": "right",
      "paddingTop": 60,
    },
  ]
  return (
    <div className="solution__case-show">
      <ul>
      {data.map((item, index) => {
        return (
          <li key={index} className={item["li-class"]} style={{ flexDirection: item.align === "left" ? "row" : "row-reverse" }}>
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

export default CaseShow;
