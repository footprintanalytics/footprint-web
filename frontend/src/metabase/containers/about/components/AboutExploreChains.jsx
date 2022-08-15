/* eslint-disable react/prop-types */
import React, { useState } from "react";
import AboutExploreTab from "metabase/containers/about/components/AboutTab";
import { trackStructEvent } from "metabase/lib/analytics";
import WrapLink from "metabase/containers/about/components/WrapLink";
import PublicDashboard from "metabase/guest/Dashboard";
import PublicQuestion from "metabase/guest/Question";

const AboutExploreChains = ({
  title,
  data,
  exploreButton,
  className = "",
  dark = false,
}) => {
  const navListData = [
    {
      title: "dashboard 1",
      active: true,
      query:
        "https://www.footprint.network/public/chart/TVL-All-Chains-fp-5f34f04d-7521-475f-bf40-23f0b12c8e51",
    },
    {
      title: "dashboard 2",
      query:
        "https://www.footprint.network/public/chart/GameFi-Go-fp-8f8f2c55-b993-482c-b3f0-591465f36a43",
    },
    {
      title: "dashboard 3",
    },
  ];
  const panelClassName = dark
    ? "About__explore-chains-panel-dark"
    : "About__explore-chains-panel";
  const [navList, setNavList] = useState(navListData);
  const [iframeSrc, setIframeSrc] = useState(navList.find(p => p.active).query);
  const onNavChange = query => {
    setIframeSrc(query);
  };
  return (
    <div className={`About__explore-chains ${className}`}>
      <div className={`About__title ${dark ? "About__title-white" : ""}`}>
        {title}
      </div>
      <div className={panelClassName}>
        {data?.map((item, index) => {
          return (
            <React.Fragment key={item.title}>
              {index > 0 && <div className="divider" />}
              <div className={"About__explore-chains-panel-item"}>
                <h3>{item.value}</h3>
                <span>{item.title}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
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
      <WrapLink key={exploreButton?.title} url={exploreButton?.url}>
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

export default AboutExploreChains;
