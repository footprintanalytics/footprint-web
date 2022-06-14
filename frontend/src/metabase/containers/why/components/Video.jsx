/* eslint-disable react/prop-types */

import React from "react";
import { getOssUrl } from "metabase/lib/image";
import { push } from "react-router-redux";
import connect from "react-redux/lib/connect/connect";
import Button from "metabase/components/Button";
import TitleDesc from "metabase/containers/why/components/TitleDesc";
import Link from "metabase/components/Link";
import { formatName } from "metabase/lib/urls";

const data = [
  {
    video: "https://www.youtube.com/embed/Ekr5h1dZL20",
  },
  {
    image: "img-video-3d.png",
    url: `https://www.footprint.network/guest/dashboard/cbb4b11a-8b58-4148-98ed-2bfdb7bcf633/${formatName(
      "3D Dynamic Charts About TVL",
    )}`,
  },
];

const Video = ({ onChangeLocation }) => {
  return (
    <div className="video why-component">
      <TitleDesc
        title={"Footprint helps people and organizations be more data-driven"}
        desc={
          "We believe that there is value in every movement. Footprint helps people transforming data and information into actionable insights."
        }
      />
      <div className="flex justify-center mt4" style={{ width: "100%" }}>
        {data.map((item, index) => {
          return (
            <div className="video__item" key={index}>
              {item.video && (
                <iframe
                  className="video__item-iframe"
                  width="580"
                  height="326"
                  src={item.video}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
              {item.image && (
                <Link to={item.url} className="video__item-image">
                  <img
                    src={getOssUrl(item.image)}
                    style={{ width: "100%", height: "auto" }}
                    alt="Footprint analytics"
                  />
                  <div className="video__item-image-mask">
                    <Button className="video__item-image-mask-button">
                      Explore {"->"}
                    </Button>
                  </div>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  onChangeLocation: push,
};

export default connect(null, mapDispatchToProps)(Video);
