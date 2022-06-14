import React from "react";
import { getOssUrl } from "../../lib/image";
import AboutSectionInfo from "./AboutSectionInfo";

const AboutTrade = () => {
  return (
    <div className="defi-about__wrap defi-my-120 defi-flex">
      <AboutSectionInfo
        title={
          <h3>
            Uncover
            <br />
            trading patterns
          </h3>
        }
        desc={
          <p>
            Categorize users into multiple tiers based on user trading volume
          </p>
        }
      />
      <img
        src={getOssUrl("20220225203223.png")}
        width={800}
        alt="Categorize users into multiple tiers based on user trading volume"
      />
    </div>
  );
};

export default AboutTrade;
