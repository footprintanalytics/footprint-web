/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";
import { Image, Skeleton } from "antd";

const NftRoles = props => {
  const array = [
    {
      top: 180,
      img: getOssUrl("img_nft_bg_2022082111.png"),
    },
    {
      top: 120,
      img: getOssUrl("img_nft_bg_2022082112.png"),
    },
    {
      top: 60,
      img: getOssUrl("img_nft_bg_2022082113.png"),
    },
    {
      top: 0,
      img: getOssUrl("img_nft_bg_2022082114.png"),
    },
  ];
  return (
    <>
      <div className="nft-activity__roles">
        <div className="nft-activity__roles-container">
          <h1>Roles</h1>
          <span>
            There are 4 Moon Men in the collection with differing rarity <br />
            and traits. Each Moon Man represents an integral function or <br />
            skill within our community.{" "}
          </span>
        </div>
        <ul>
          {array.map(item => {
            return (
              <div key={item.img} style={{ marginTop: item.top }}>
                <Image
                  placeholder={<Skeleton active />}
                  preview={false}
                  src={item.img}
                />
              </div>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default NftRoles;
