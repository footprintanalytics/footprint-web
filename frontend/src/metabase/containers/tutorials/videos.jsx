/* eslint-disable react/jsx-no-target-blank */
import { getOssUrl } from "metabase/lib/image";
import React, { useState } from "react";
import LoadingSpinner from "metabase/components/LoadingSpinner";

const Videos = () => {
  const [loaded, setLoaded] = useState({});

  const list = [
    {
      title: `Footprint Data Introduction 9`,
      desc: `How to create a Blockchain data dashboard`,
      videoId: `OR4lVdVcIE0`,
      sort: 16,
    },
    {
      title: `Footprint Data Introduction 8`,
      desc: `How to create basic chart`,
      videoId: `hP6oHHWtNsU`,
      sort: 15,
    },
    {
      title: `Footprint Data Introduction 7`,
      desc: `How to combine charts`,
      videoId: `kwA6CZVd2F0`,
      sort: 14,
    },
    {
      title: `Footprint Data Introduction 6`,
      desc: `Basic introduction of different charts`,
      videoId: `KATYi39rnRg`,
      sort: 13,
    },
    {
      title: `Footprint Data Introduction 5`,
      desc: `Understand the details of Token Data in Footprint Analytics`,
      videoId: `P0OhjDgt9pM`,
      sort: 12,
    },
    {
      title: `Footprint Data Introduction 4`,
      desc: `Understand the details of Lending Data in Footprint Analytics`,
      videoId: `jLWLA3-4lDE`,
      sort: 11,
    },
    {
      title: `Footprint Data Introduction 3`,
      desc: `Understand the details of DEX Data in Footprint Analytics`,
      videoId: `vPdn3mmHPb0`,
      sort: 10,
    },
    {
      title: `Footprint Data Introduction 2`,
      desc: `Understand the details of DeFi Data in Footprint Analytics`,
      videoId: `TrRL2P_g4ps`,
      sort: 9,
    },
    {
      title: `Footprint Data Introduction 1`,
      desc: `Understand the details of Ethereum Data in Footprint Analytics`,
      videoId: `h5Y822OzQf4`,
      sort: 8,
    },
    {
      title: `How to find a Chain with potential using Footprint`,
      desc: `Public chains are exploding, what are the characteristics of the outstanding public chains and how to predict the next exploding public chains?`,
      videoId: `sZqPM0qR9vk`,
      sort: 17,
    },
    {
      title: `An Overview of Footprint Data: How to Search and Pick Indicators in Footprint`,
      desc: `DeFi data in Footprint Analytics - Tutorials about how to find the field name you want`,
      videoId: `Sdr_yH56vaY`,
      sort: 7,
    },
    {
      title: `Gettting Start with Footprint Analytics: One Step Closer to Blockchain Insights`,
      desc: `What can we do with Footprint<br />What can we see in Footprint<br />How to use Footprint?`,
      videoId: `JXrIDgCWmrE`,
      sort: 6,
    },
    {
      title: `What is EIP-1559？`,
      desc: `Who exactly is the beneficiary of the upgrade`,
      videoId: `wybhWrVK_Ho`,
      sort: 18,
    },
    {
      title: `Overview of use cases with footprint`,
      desc: `How Footprint's currently being used by industry & users?`,
      videoId: `g1JUPHvnXm4`,
      sort: 19,
    },
    {
      title: `The Ultimate Beginner's Guide to DeFi 1.0 - All You Need to Know to Invest in DeFi`,
      desc: `How to get information about a DeFi project? With so many DeFi projects out there, how can we get to know them better and faster? We can start from the following two aspects.`,
      videoId: `FfxpN_8u1_o`,
      sort: 5,
    },
    {
      title: `What Is Avalanche? What Drives Avalanche's Growth?`,
      desc: `In August, Avalanche skyrocketed. Its TVL grew from 0.3 billion to a high of 14.3 billion in just the last 4 months, a growth rate of 4700%. We've summarized 3 things driving Avalanche's 47 times growth：<br />1. Sustained ecosystem support.<br />2. A strong multi-chain framework.<br />3. A developer-friendly dApp ecosystem.`,
      videoId: `43y4bGLYN7c`,
      sort: 4,
    },
    {
      title: `What is Curve？How Curve Investors Earn More APYs?`,
      desc: `In this video, we’ll talk about Curve Finance，the largest decentralized exchange. We focus on 4 perspectives to get a deeper understanding of Curve and we summarize 4 features to help us find the most popular pools.`,
      videoId: `UsQDAXkFd5g`,
      sort: 3,
    },
    {
      title: `How to Find Valuable DeFi Projects Using Data`,
      desc: `5 Charts to uncover your next long-term DeFi investment.`,
      videoId: `XATewwZZZnw`,
      sort: 2,
    },
    {
      title: `Footprint Analytics - One Step Closer to Blockchain Insights`,
      desc: `Footprint shows you the blockchain as you’ve never seen it before.<br />Live, interactive, and easy to understand.<br />With a panoramic view of on-chain data that covers all major protocols down to a granular view of contract addresses, wallets, pools, tokens, and more.`,
      videoId: `sYTKKrOjUcc`,
      sort: 1,
    },
  ].sort((a, b) => a.sort - b.sort);

  return (
    <ul className="tutorials__videos">
      {list.map(item => (
        <li key={item.videoId}>
          <div className="tutorials__videos-play">
            {!loaded[item.videoId] ? <LoadingSpinner /> : null}
            <iframe
              onLoad={() =>
                setLoaded(val => ({ ...val, [item.videoId]: true }))
              }
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${item.videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="tutorials__videos-info">
            <h3 className=" footprint-title1">{item.title}</h3>
            <p
              className=" footprint-secondary-text1"
              dangerouslySetInnerHTML={{ __html: item.desc }}
            />
            <a
              href={`https://www.youtube.com/watch?v=${item.videoId}`}
              target="_blank"
              rel="nofollow"
            >
              <img src={getOssUrl("icon_play.png")} alt="Footprint analytics" />
              <span>Watch video</span>
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Videos;
