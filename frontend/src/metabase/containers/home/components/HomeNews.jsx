/* eslint-disable react/prop-types */
import { getOssUrl } from "metabase/lib/image";
import React from "react";
import SectionHead from "./SectionHead";
import Link from "metabase/components/Link";

const HomeNews = props => {
  const { news } = props;
  if (!news.length) {
    return null;
  }
  return (
    <div className="home-dashboard-container">
      <SectionHead
        img={getOssUrl("20210819104529.png")}
        title="Insights"
        link="https://insights.footprint.network/"
      />
      <ul role="link" className="home-new-list">
        {news.map(item => (
          <li key={item.title} className="home-new-list-item">
            <Link to={item.url} target="_blank">
              <img
                className="home-new-list-item__thumb"
                src={`${item.thumb}?x-oss-process=image/format,webp`}
                alt={item.title}
                width={506}
                height={265}
              />
              {/* <div className="home-new-list-item__foot">
              <span className="home-new-list-item__title">{item.title}</span>
              <span className="home-new-list-item__desc">{item.desc}</span>
            </div>*/}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomeNews;
