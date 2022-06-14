import React from "react";
import { getOssUrl } from "../../lib/image";

const AboutWhy = () => {
  return (
    <div
      className="defi-my-120 defi-about-why"
      style={{ backgroundImage: `url(${getOssUrl("202202261501793.png")})` }}
    >
      <div className="defi-about__wrap">
        <h3>Why Footprint Enterprise</h3>
        <ul>
          <li>
            <img
              src={getOssUrl("202202261500683.png")}
              height={50}
              alt="Build a data pipeline at lower cost"
            />
            <p>Build a data pipeline at lower cost</p>
          </li>
          <li>
            <img
              src={getOssUrl("202202261500369.png")}
              height={50}
              alt="Make the right decision every time"
            />
            <p>Make the right decision every time</p>
          </li>
          <li>
            <img
              src={getOssUrl("202202261500545.png")}
              height={50}
              alt="Know exactly what to do next"
            />
            <p>Know exactly what to do next</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutWhy;
