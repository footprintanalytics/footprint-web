/* eslint-disable react/prop-types */

import React from "react";
import { getOssUrl } from "metabase/lib/image";
import TitleDesc from "metabase/containers/why/components/TitleDesc";

const data = {
  desc:
    "Vantastone Technology PTE.LTD. strives to make technology that will enable more accessible and decentralized analytics solutions as blockchain technologies expand.\n\n\n" +
    "Based in Singapore, Vanstastone consists of an experienced team of DeFi enthusiasts with diverse backgrounds, including smart contract developers, consumer internet product designers, investment managers from the banking industry, and risk modeling practitioners.\n\n\n" +
    "Previously launched projects include a fintech lending platform, a personal credit risk modeling service, several mobile e-commerce applications, and a data-mining business.",
  img: "img-why-about-us.png",
};

const AboutUs = () => {
  return (
    <div className="about-us why-component">
      <TitleDesc title={"About us"} />
      <div className="about-us__panel">
        <img src={getOssUrl(data.img)} alt="Footprint analytics" />
        <div className="about-us__desc">{data.desc}</div>
      </div>
    </div>
  );
};

export default AboutUs;
