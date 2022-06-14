/* eslint-disable react/prop-types */

import React from "react";
import { getOssUrl } from "metabase/lib/image";
import TitleDesc from "metabase/containers/why/components/TitleDesc";
import { staticBucketUrl } from "metabase/env";

const data = [
  {
    name: "Gordon Lewis",
    desc:
      "With Footprint, I can create complex visualizations by simply dragging and dropping fields to deliver our insights in a much easier way.",
    img: "img-feedback-gordon-lewis.png",
  },
  {
    name: "David Brown",
    desc:
      "It is really an exciting tool for us to explore cross-chain data. We can unlock insights from over a billion daily transactions without any trouble.",
    img: "img-feedback-david-brown.png",
  },
  {
    name: "Jasper Smith",
    desc:
      "Footprint helps me to track and visualize insights across the blockchain. Looking forwards to its enriching labels.",
    img: "img-feedback-jasper-smith.png",
  },
];

const Feedback = () => {
  return (
    <div className="feedback why-component">
      <TitleDesc title={"User feedback"} />
      <div className="flex justify-center mt4">
        {data.map(item => {
          return (
            <div
              key={item.name}
              className="feedback__box feedback__box-bg"
              style={{
                backgroundImage: `url("${staticBucketUrl}/img-feedback-box-bg.png")`,
              }}
            >
              <div className="flex align-center">
                <img src={getOssUrl(item.img)} alt={item.name} />
                <div className="feedback__box-name footprint-title2">
                  {item.name}
                </div>
              </div>
              <div className="feedback__box-desc footprint-primary-text">
                {item.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Feedback;
