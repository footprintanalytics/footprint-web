import React from "react";
import { getOssUrl } from "../../lib/image";

const AboutEmpower = () => {
  return (
    <div className="defi-about__wrap">
      <h3 className="defi-my-120">Empower every team with reliable data</h3>
      <div className="defi-about__empower">
        <img
          className="defi-about__empower-demo"
          src={getOssUrl("202205121521624.png")}
          width={440}
          height={260}
          alt="Empower every team with reliable data"
        />
        <div className="defi-about__empower-logo">
          <img
            src={getOssUrl("20220225181036.png")}
            width={394}
            alt="Footprint"
          />
          <h4>Footprint Enterprise</h4>
        </div>
        <ul className="defi-about__empower-list">
          <li>
            <h4>Marketing</h4>
            <p>Actionable insights to obtain rapid growth</p>
          </li>
          <li>
            <h4>Product</h4>
            <p>Powerful reports to know your users</p>
          </li>
          <li>
            <h4>Engineering</h4>
            <p>
              No-code and zero maintenance, super easy to
              <br />
              setup
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutEmpower;
