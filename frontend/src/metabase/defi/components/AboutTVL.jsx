import React from "react";
import { getOssUrl } from "../../lib/image";
import AboutSectionInfo from "./AboutSectionInfo";

const AboutTVL = () => {
  return (
    <div className="defi-about__wrap defi-my-120 defi-flex">
      <img
        src={getOssUrl("20220225193041.png")}
        width={775}
        alt="Explore pool-level data to find out causes behind movements in TVL and trading volume"
      />
      <AboutSectionInfo
        title={
          <h3>
            Understand
            <br />
            on-chain behavior
          </h3>
        }
        desc={
          <p>
            Explore pool-level data to find out causes behind movements in TVL
            and trading volume
          </p>
        }
      />
    </div>
  );
};

export default AboutTVL;
