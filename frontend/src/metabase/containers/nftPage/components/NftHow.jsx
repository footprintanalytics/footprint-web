/* eslint-disable react/prop-types */
import React from "react";
import Button from "metabase/components/Button";
import * as Urls from "metabase/lib/urls";
import WrapLink from "metabase/containers/about/components/WrapLink";

const NftHow = props => {
  const heads = ["Category", "Items", "Points", ""];
  const contents = [
    {
      category: "Join Community",
      items: ["Follow Twitter", "Join Discord channel"],
      points: [],
      actions: [],
    },
    {
      category: "Footprint subscriber",
      items: [
        "Subscribed to Footprint's Business Package and create at least one dashboard",
      ],
      points: ["100 points"],
      actions: [
        {
          text: "Buy now",
          url: "/pricing",
        },
      ],
    },
    {
      category: "Share your blockchain insight",
      items: ["Create high quality dashboards"],
      points: ["10 points for every 500 dashboard views"],
      actions: [
        {
          text: "Create dashboard",
          url: Urls.newQuestion(),
        },
      ],
    },
    {
      category:
        "Provide guidance and help for more analysts who are interested in data analysis and want to learn more.",
      items: [
        "Creating an on-chain data analysis course for Footprint",
        "Participate in Footprint's community sharing as a speaker",
      ],
      points: ["50 points per course content", "50 points per sharing"],
      actions: [
        {
          text: "Create course",
          url: "https://discord.gg/3HYaR6USM7",
        },
        {
          text: "Talk to us",
          url: "https://discord.gg/3HYaR6USM7",
        },
      ],
    },
    {
      category:
        "Engage with the community and help new members join the Footprint ecosystem",
      items: ["Constantly engage with community members and be friendly."],
      points: [
        "After Footprint NFT goes online, it will use discord bot statistics, and each message will add 1 point. Maximum 5 points per user per day.",
      ],
      actions: [
        {
          text: "Join discord",
          url: "https://discord.gg/3HYaR6USM7",
        },
      ],
    },
    {
      category: "Participate in data co-construction",
      items: [
        "Produce silver or gold layer datasets or Metrics",
        "Participate in data validation",
        "Participate in data parsing: chain parsing, contract parsing, providing contract addresses, ABI, etc.",
      ],
      points: [
        "Coming soon. We will use Github to count",
        "Coming soon. We will use Github to count",
        "Coming soon. We will use Github to count",
      ],
      actions: [],
    },
    {
      category: "Create your data application",
      items: [
        "Build your own website or blockchain tools using Footprint data.",
      ],
      points: ["Coming soon. We will use Github to count"],
      actions: [],
    },
  ];
  return (
    <>
      <div
        className="nft-activity__how nft-activity__how-bg"
        id="nft-activity__how"
      >
        <h1>How should I get on the allow list?</h1>
        <div className="nft-activity__how-container">
          <tr>
            {heads.map(item => (
              <th key={item}>{item}</th>
            ))}
          </tr>
          {contents.map(content => {
            return (
              <tr key={content.category} className="nft-activity__how-inner">
                <td>{content.category}</td>
                <td>
                  {content.items.map(item => {
                    return <li key={item}>{item}</li>;
                  })}
                </td>
                <td>
                  {content.points.map(item => {
                    return <li key={item}>{item}</li>;
                  })}
                </td>
                <td>
                  {content.actions.map(action => {
                    return (
                      <WrapLink key={action.text} url={action.url}>
                        <Button className="nft-activity__how-button">
                          {action.text}
                        </Button>
                      </WrapLink>
                    );
                  })}
                </td>
              </tr>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default NftHow;
