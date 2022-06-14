/* eslint-disable curly */
/* eslint-disable react/prop-types */
import { Skeleton } from "antd";
import { trackStructEvent } from "metabase/lib/analytics";
import { getOssUrl } from "metabase/lib/image";
import React, { useState } from "react";
import WrapLink from "./WrapLink";

const AboutBuild = ({
  type,
  title,
  more = "",
  nav,
  list,
  onNavChange,
  isLoading,
}) => {
  const [navList, setNavList] = useState(
    nav?.map((item, i) => ({ ...item, active: i === 0 })),
  );

  return (
    <div className={`About__explore About__explore--${type}`}>
      <div className="About__container">
        <div className="About__explore-title">
          <h3 className="About__title">{title}</h3>
          <WrapLink
            url={more}
            onClick={() => trackStructEvent("About", `More ${title}`)}
          >
            More
          </WrapLink>
        </div>
        {nav && (
          <ul className="About__explore-nav">
            {navList.map(item => (
              <li
                className={item.active ? "About__explore-nav--active" : ""}
                key={item.title}
                onClick={() => {
                  setNavList(prev =>
                    prev.map(p => ({ ...p, active: p.title === item.title })),
                  );
                  onNavChange && onNavChange(item.query);
                  trackStructEvent("About", `Nav ${item.title}`);
                }}
              >
                {item.title}
              </li>
            ))}
          </ul>
        )}
        {isLoading || !list || !list?.length ? (
          <Skeleton className="About__explore-skeleton" active />
        ) : (
          <div className="About__explore-list">
            <WrapLink
              className="About__explore-list-left"
              url={list[0].url}
              onClick={() => trackStructEvent("About", `List ${list[0].title}`)}
            >
              <img src={list[0].img} alt={list[0].title} />
              <h3>{list[0].title}</h3>
            </WrapLink>
            <ul className="About__explore-list-right">
              {list.slice(1).map(item =>
                type === "card" ? (
                  <li key={item.url}>
                    <WrapLink
                      url={item.url}
                      className="About__explore-list-news-card"
                      onClick={() =>
                        trackStructEvent("About", `List ${item.title}`)
                      }
                    >
                      <div>
                        <h3>{item.title}</h3>
                        <span>{item.date}</span>
                      </div>
                      <img src={item.img} alt={item.title} />
                    </WrapLink>
                  </li>
                ) : (
                  <li key={item.url}>
                    <WrapLink
                      url={item.url}
                      className="About__explore-list-news-cell"
                      onClick={() =>
                        trackStructEvent("About", `List ${item.title}`)
                      }
                    >
                      <h3>{item.title}</h3>
                      <img
                        className="About__explore-list-arrow"
                        src={getOssUrl("20220602204325.png")}
                        alt={item.title}
                      />
                    </WrapLink>
                  </li>
                ),
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutBuild;
