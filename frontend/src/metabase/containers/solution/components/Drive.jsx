/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import { getOssUrl } from "metabase/lib/image";

const Drive = () => {
  const title = "Drive Success with Precision";
  const data = [
    {
      topic: "Wallet",
      img: getOssUrl("solution/img-wallet.png"),
      content: [
        {
          type: "Acquire",
          title: "Pinpoint Addresses with Comprehensive Data Support",
          list: [
            "Encompassing wallets across 30+ chains",
            "100+ attributes for granular filtering",
            "Download data for millions of addresses in minutes",
            "Snapshot of holders",
          ],
        },
        {
          type: "Optimize",
          title: "Segment wallet addresses for targeted operations",
          list: [
            "Wallet cohort analysis based on an up-to-date perspective",
            "Assign customized scores and labels to wallet addresses",
            "Bots and Sybil detection",
          ],
        },
        {
          type: "Analysis",
          title: "Query Wallet Features for Bulk Addresses",
          list: [
            "Cross-chain activities and portfolio",
            "Wallet capture rate",
            "Wallet protocol interaction",
          ],
        },
      ],
      marginLeft: 0,
      circleBg: "solution__drive-circle-bg2",
    },
    {
      topic: "Token",
      img: getOssUrl("solution/img-token.png"),
      content: [
        {
          type: "Tokenomics",
          title: "Harmonize and Design On-Chain and In-Game Token Economics",
          list: [
            "Leverage historical data analysis on prices, trading volumes, and user behavior to strategically determine token supply, utilization, and incentive mechanisms",
            "Simulate diverse economic scenarios to predict and optimize \nmarket performance and user engagement",
          ],
        },
        {
          type: "Token Movement Map",
          title: "Unveiling Ecosystem-Wide Token Circulation and Balances",
          list: [
            "Unravel the dynamics of circulating and uncirculating tokens",
            "Cross-chain token distribution and bridge activity tracking",
            "Exploring the key pillars of circulating tokens, including token flows \nwithin CEX, DEX, EOA, Treasury, and beyond",
          ],
        },
      ],
      marginLeft: "-60px",
      circleBg: "solution__drive-circle-bg3",
    },
  ];
  return (
    <div className="solution__drive">
      <h2>{title}</h2>
      <ul className="solution__drive-inner">
        {data.map(item => {
          return (
            <li key={item.topic} className="solution__drive-inner-li">
              <h2>{item.topic}</h2>
              <div className={item.circleBg} />
              <div className={"solution__drive-inner-li-div"}>
                <div className={"solution__drive-inner-li-left"}>
                  {item.content.map(content => {
                    return (
                      <div key={content.title} className={"solution__drive-inner-li-left-box"}>
                        <h4><h3>{content.type}:</h3>{content.title}</h4>
                        <ul>
                          {content.list.map((li, index) => {
                            return (
                              <li key={index}>
                                <span>{li}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </div>
                <img src={item.img} alt={item.topic} style={{marginLeft: item.marginLeft}}/>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Drive;
