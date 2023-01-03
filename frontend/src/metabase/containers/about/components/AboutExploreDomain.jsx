/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { RightOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";
import LazyLoad from "react-lazyload";
import AboutExploreTab from "metabase/containers/about/components/AboutTab";
import { trackStructEvent } from "metabase/lib/analytics";
import WrapLink from "metabase/containers/about/components/WrapLink";

const AboutExploreDomain = ({
  title,
  navListData,
  exploreButton,
  className = "",
  dark = false,
}) => {
  /*  const panelClassName = dark
    ? "About__explore-domain-panel-dark"
    : "About__explore-domain-panel";*/
  const [navList, setNavList] = useState(navListData);
  const [iframeSrc, setIframeSrc] = useState(navList.find(p => p.active).query);
  const onNavChange = query => {
    setIframeSrc(query);
  };
  return (
    <div className={`About__explore-domain ${className}`}>
      <div className={`About__title ${dark ? "About__title-white" : ""}`}>
        {title}
      </div>
      {/*<div className={panelClassName}>
        {data?.map((item, index) => {
          return (
            <React.Fragment key={item.title}>
              {index > 0 && <div className="divider" />}
              <div className={"About__explore-domain-panel-item"}>
                <b>{item.total ? item.total.toLocaleString() : <Spin />}</b>
                <h3>{item.title}</h3>
              </div>
            </React.Fragment>
          );
        })}
      </div>*/}
      <AboutExploreTab
        navList={navList}
        setNavList={setNavList}
        onNavChange={onNavChange}
        dark={dark}
      />
      <LazyLoad
        className="full-height"
        scrollContainer="#app-content"
        placeholder={
          <div style={{ padding: 20 }}>
            <Skeleton active />
          </div>
        }
      >
        <iframe
          src={iframeSrc}
          frameBorder="0"
          width="1200"
          height="600"
          allowTransparency
        />
      </LazyLoad>
      <WrapLink
        key={exploreButton?.title}
        url={navList?.find(item => item.active)?.url}
      >
        <div
          className={`About__btn About__btn--lg ${exploreButton?.className}`}
          onClick={() => trackStructEvent("About", exploreButton?.title)}
        >
          {exploreButton?.title} <RightOutlined className="ml1" />
        </div>
      </WrapLink>
    </div>
  );
};

export default AboutExploreDomain;
