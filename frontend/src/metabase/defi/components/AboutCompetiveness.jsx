import React from "react";
import { getOssUrl } from "../../lib/image";
import AboutSectionInfo from "./AboutSectionInfo";

const AboutCompetiveness = () => {
  return (
    <div className="defi-about__wrap defi-my-120 defi-flex">
      <AboutSectionInfo
        title={<h3>Assess competitiveness</h3>}
        desc={
          <p>
            Compare the performance of different protocols, projects and chains
          </p>
        }
      />
      <img
        src={getOssUrl("20220225210033.png")}
        width={800}
        alt="Compare the performance of different protocols, projects and chains"
      />
    </div>
  );
};

export default AboutCompetiveness;
