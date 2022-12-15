/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";

export default function NoData({ title }) {
  return (
    <div className="article-list__no-data">
      <img src={getOssUrl("img_no_article.png")} alt={"Footprint analytics"} />
      <div className="article-list__no-data-title">{title}</div>
    </div>
  );
}
