import { getOssUrl } from "metabase/lib/image";
import React from "react";
import WrapLink from "./WrapLink";
import { trackStructEvent } from "metabase/lib/analytics";

const AboutStart = () => {
  return (
    <div className="About__start">
      <img
        className="About__start-logo"
        src={getOssUrl("20220602164236.png")}
        alt="Footprint Analytics"
      />
      <h3 className="About__start-title">
        Turn on-chain data into charts without coding
        <br />
        Explore data with Python or SQL
        <br />
        Build custom analytics apps for your project or organization
        <br />
        Access the most comprehensive GameFi database
      </h3>
      <WrapLink url="/dashboards">
        <div
          className="About__btn About__btn--blue About__btn--lg"
          onClick={() => trackStructEvent("About", "Start a free trial")}
        >
          Start a free trial
        </div>
      </WrapLink>
      {/* <div className="About__see">
        <img className="About__see-pic" src="" alt="" />
        <div className="About__btn About__btn--md About__btn--black">
          <img src={getOssUrl("20220602165930.png")} alt="See it in action" />
          See it in action
        </div>
      </div> */}
    </div>
  );
};

export default AboutStart;
