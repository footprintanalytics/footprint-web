import React from "react";
import { getOssUrl } from "../../lib/image";
import AboutSectionInfo from "./AboutSectionInfo";

const AboutTarget = () => {
  return (
    <div className="defi-about__wrap defi-my-120 defi-flex">
      <img
        src={getOssUrl("20220225204820.png")}
        width={800}
        alt="Discover the characteristics and behavior of target users"
      />
      <AboutSectionInfo
        title={<h3>Create ideal user profiles to target</h3>}
        desc={<p>Discover the characteristics and behavior of target users</p>}
      />
    </div>
  );
};

export default AboutTarget;
