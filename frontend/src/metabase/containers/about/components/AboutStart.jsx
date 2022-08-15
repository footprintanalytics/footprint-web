import React from "react";
import WrapLink from "./WrapLink";
import { trackStructEvent } from "metabase/lib/analytics";
import AboutSocial from "metabase/containers/about/components/AboutSocial";
import AboutBasic from "metabase/containers/about/components/AboutBasic";
import data from "../data";
const AboutStart = () => {
  return (
    <div className="About__start">
      <div className="About__start-title">
        <h3>
          The One-Stop Blockchain
          <br />
          Analytics Platform.
        </h3>
        <span>No-coding required.</span>
      </div>
      <AboutSocial />
      <div className="About__start-buttons">
        {data.startButtonData.map(item => {
          return (
            <WrapLink key={item.title} url={item.url}>
              <div
                className={`About__btn About__btn--width-250 ${item.className}`}
                onClick={() => trackStructEvent("About", item.title)}
              >
                {item.title}
              </div>
            </WrapLink>
          );
        })}
      </div>
      <AboutBasic />
    </div>
  );
};

export default AboutStart;
