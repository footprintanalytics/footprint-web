/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import { getOssUrl } from "metabase/lib/image";
import { Image, Skeleton } from "antd";

const DataApiIntroduce = () => {
  return (
    <div className="data-api__introduce data-api__introduce-bg">
      <h1>
        <span className="data-api__text-bland">Build fast, Build smart </span>
        and scale your users
      </h1>
      <h2>Power your Web3 projects and applications with unmatched data</h2>
      <div className="data-api__box">
        <Image
          placeholder={<Skeleton active />}
          preview={false}
          src={getOssUrl("img_da_bg_2022100851.webp?1=1")}
        />
      </div>
    </div>
  );
};

export default DataApiIntroduce;
