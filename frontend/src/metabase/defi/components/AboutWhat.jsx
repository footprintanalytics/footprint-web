import React from "react";
import { getOssUrl } from "../../lib/image";
import AboutSectionInfo from "./AboutSectionInfo";

const AboutWhat = () => {
  return (
    <div className="defi-about__wrap defi-my-120 defi-flex">
      <AboutSectionInfo
        hideLink={true}
        title={<h3>About Footprint Enterprise</h3>}
        desc={
          <>
            <p>
              Footprint Enterprise is a SaaS provider product for blockchain
              protocols that is based
              <br />
              on Footprint Analytics Data(footprint.network).
            </p>
            <p>
              It provides an easy access towards user retention monitoring, user
              activity
              <br />
              in multpile region and time zones, multichain along with cross
              chain
              <br />
              analysis.
            </p>
            <p>
              Various projects can get a 360 angle perspective to acquire data
              insight,
              <br />
              increase agility, lower costs and accelerate innovation. It serves
              for better
              <br />
              decision making and execution of project owners.
            </p>
          </>
        }
      />
      <img
        src={getOssUrl("202205121522139.png")}
        width={530}
        alt="About Footprint Enterprise"
      />
    </div>
  );
};

export default AboutWhat;
