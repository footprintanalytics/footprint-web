/* eslint-disable react/prop-types */
import { Image, Skeleton } from "antd";
import { trackStructEvent } from "metabase/lib/analytics";
import React, { useState } from "react";
import WrapLink from "metabase/containers/about/components/WrapLink";

const AboutSection = ({
  reverse,
  borderless,
  title,
  subTitle,
  desc,
  list,
  height,
  exploreButton,
}) => {
  const [sectionList, setSectionList] = useState(
    list.map((item, i) => ({ ...item, active: i === 0 })),
  );
  const active = sectionList.find(item => item.active);

  return (
    <div
      className={`About__container About__section ${
        borderless ? "About__section--borderless" : ""
      }`}
    >
      {title && <h3 className="About__title">{title}</h3>}
      <div
        className={`About__section-wrap ${
          reverse ? "About__section-wrap--reverse" : ""
        }`}
        style={height ? { height } : {}}
      >
        <div className="About__section-side">
          <ul>
            {sectionList.map(item => (
              <li
                className={item.active ? "About__section-side--active" : ""}
                key={item.title}
                onMouseOver={() => {
                  setSectionList(prev =>
                    prev.map(p => ({ ...p, active: p.title === item.title })),
                  );
                  trackStructEvent("About", `Hover ${item.title}`);
                }}
              >
                {item.title}
              </li>
            ))}
          </ul>
          {exploreButton && (
            <WrapLink url={exploreButton?.url}>
              <div
                className={`About__btn About__btn--lg ${exploreButton?.className}`}
                onClick={() => trackStructEvent("About", exploreButton?.title)}
              >
                {exploreButton?.title}
              </div>
            </WrapLink>
          )}
        </div>
        <div className="About__section-preview">
          <h4>{subTitle}</h4>
          <p>{desc}</p>
          <Image
            key={active.title}
            placeholder={
              <div className="About__section-img-placeholder">
                <Skeleton active />
              </div>
            }
            preview={false}
            className="About__section-img"
            src={active.img}
            alt={active.title}
          />
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
