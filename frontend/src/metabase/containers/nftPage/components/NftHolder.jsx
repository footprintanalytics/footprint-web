/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";

const NftHolder = props => {
  const data = [
    {
      title: "20% off Footprint Analytics’ Business Plan.",
      img: getOssUrl("img_nft_bg_2022082121.png"),
    },
    {
      title: "Gated NFT channels in Footprint’s Discord.",
      img: getOssUrl("img_nft_bg_2022082123.png"),
    },
    {
      title: "Closer contact with the Footprint team.",
      img: getOssUrl("img_nft_bg_2022082124.png"),
    },
    {
      title: "Priority for whitelisting for future NFTs.",
      img: getOssUrl("img_nft_bg_2022082122.png"),
    },
    {
      title: "Early access to Footprint product launches & more.",
      img: getOssUrl("img_nft_bg_2022082125.png"),
    },
  ];

  return (
    <>
      <div className="nft-activity__holder nft-activity__holder-bg">
        <div className="nft-activity__holder-container">
          <h1>As a Moon Men NFT holder, you get:</h1>
        </div>
        <ul>
          {data.map(item => {
            return (
              <li key={item.title} style={{ background: `url('${item.img}')` }}>
                <span>{item.title}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default NftHolder;
