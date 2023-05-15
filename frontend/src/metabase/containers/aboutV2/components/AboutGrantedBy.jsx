/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";

const AboutGrantedBy = () => {
  const data = [
    "home-v2/img_by_near.png",
    "home-v2/img_by_cronos.png",
    "home-v2/img_by_optimism.png",
  ];

  return (
    <div className="About__granted-by">
      <h3 className="About__title">Granted by</h3>
      <ul>
        {data.map(item => {
          return (
            <li key={item}>
              <img src={getOssUrl(item)}/>
            </li>
          )
        })}
      </ul>
    </div>
  );
};

export default AboutGrantedBy;
