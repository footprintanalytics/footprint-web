/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import { getOssUrl } from "metabase/lib/image";

const DataApiIntroduce = () => {
  return (
    <div className="data-api__introduce data-api__introduce-bg">
      <h1>
        <span className="data-api__text-bland">Build fast, Build smart </span>
        and scale with your users
      </h1>
      <h2>A full suite of APIs for most popular chains and domains</h2>
      <div className="data-api__box">
        <img src={getOssUrl("img_da_bg_2022100851.png")} alt="footprint" />
      </div>
    </div>
  );
};

export default DataApiIntroduce;
