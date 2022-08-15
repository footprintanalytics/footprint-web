/* eslint-disable react/prop-types */
import React from "react";
import { trackStructEvent } from "metabase/lib/analytics";

const AboutExploreTab = props => {
  const { onNavChange, setNavList, navList, dark } = props;
  const className = dark ? "About__explore-tab-dark" : "About__explore-tab";
  const activeClassName = dark
    ? "About__explore-tab-dark--active"
    : "About__explore-tab--active";
  return (
    <ul className={className}>
      {navList.map(item => (
        <li
          className={`${item.active ? activeClassName : ""}`}
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
  );
};

export default AboutExploreTab;
