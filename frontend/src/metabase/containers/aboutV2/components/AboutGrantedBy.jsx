/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";

const AboutGrantedBy = () => {
  const data = [
    "home-v2/img_by_near_v2.png?image_process=resize,w_330/crop,h_146/format,jpg",
    "home-v2/img_by_cronos_v2.png?image_process=resize,w_330/crop,h_146/format,jpg",
    "home-v2/img_by_optimism_v2.png?image_process=resize,w_330/crop,h_146/format,jpg",
    "home-v2/img_by_sui.png?image_process=resize,w_330/crop,h_146/format,jpg",
    "home-v2/img_by_combo.png?image_process=resize,w_330/crop,h_146/format,jpg",
    "home-v2/img_by_dfinity.png?image_process=resize,w_330/crop,h_146/format,jpg",
    "home-v2/img_by_nautilus.png?image_process=resize,w_330/crop,h_146/format,jpg",
    "home-v2/img_by_rootstock.png?image_process=resize,w_330/crop,h_146/format,jpg",
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
