/* eslint-disable react/prop-types */
import React from "react";
import "./Hots.css";
import HotDashboard from "metabase/containers/news/components/HotDashboard";

const ArticleHot = ({ tags }) => {
  return (
    <div className="article-hot" style={{ width: 300, marginLeft: 60 }}>
      <HotDashboard tags={tags} />
    </div>
  );
};

export default ArticleHot;
