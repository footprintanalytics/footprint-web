import React from "react";
import { getOssUrl } from "../../lib/image";
import AboutSectionInfo from "./AboutSectionInfo";

const AboutChain = () => {
  return (
    <div className="defi-about__wrap defi-my-120 defi-flex">
      <AboutSectionInfo
        title={<h3>Which chain performs best?</h3>}
        desc={<p>Cluster DeFi data from multiple chains</p>}
      />
      <img
        src={getOssUrl("20220225185345.png")}
        width={800}
        alt="Cluster DeFi data from multiple chains"
      />
    </div>
  );
};

export default AboutChain;
