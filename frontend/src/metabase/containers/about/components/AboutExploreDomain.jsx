/* eslint-disable react/prop-types */
import React, { useState } from "react";
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
      <iframe
        src={iframeSrc}
        frameBorder="0"
        width="1200"
        height="600"
        allowTransparency
      />
      {/*<PublicQuestion*/}
      {/*  location={location}*/}
      {/*  uuid={"8f8f2c55-b993-482c-b3f0-591465f36a43"}*/}
      {/*  showEditButton={false}*/}
      {/*  featuresMode={true}*/}
      {/*/>*/}
      <WrapLink
        key={exploreButton?.title}
        url={navList?.find(item => item.active)?.url}
      >
        <div
          className={`About__btn About__btn--lg ${exploreButton?.className}`}
          onClick={() => trackStructEvent("About", exploreButton?.title)}
        >
          {exploreButton?.title}
        </div>
      </WrapLink>
    </div>
  );
};

export default AboutExploreDomain;
