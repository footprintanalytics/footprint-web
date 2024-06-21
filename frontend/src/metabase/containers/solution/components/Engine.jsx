/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import { getOssUrl } from "metabase/lib/image";

const Engine = () => {
  const title = "Feed Your";
  const desc = "Growth Engine";
  return (
    <div className="solution__engine">
      <h2>{title} <span className="solution__user-growth-title-primary">{desc}</span></h2>
      <h4>Get a comprehensive understanding of users, projects, and competitive landscapes to feed growth.</h4>
      <img src={getOssUrl("solution/img-engine.png")} alt={"engine"} />
      <div className={"solution__drive-circle-bg1"}/>
    </div>
  );
};

export default Engine;
