/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";

const AboutGrantedBy = () => {
  const data = [
    { image: "home-v2/img_by_near_v2.png?image_process=resize,w_330/crop,h_146/format,jpg", title: "near" },
    { image: "home-v2/img_by_cronos_v2.png?image_process=resize,w_330/crop,h_146/format,jpg", title: "cronos" },
    { image: "home-v2/img_by_optimism_v2.png?image_process=resize,w_330/crop,h_146/format,jpg", title: "optimism" },
    { image: "home-v2/img_by_sui.png?image_process=resize,w_330/crop,h_146/format,jpg", title: "sui" },
    { image: "home-v2/img_by_combo.png?image_process=resize,w_330/crop,h_146/format,jpg", title: "combo" },
    { image: "home-v2/img_by_dfinity.png?image_process=resize,w_330/crop,h_146/format,jpg", title: "dfinity" },
    { image: "home-v2/img_by_nautilus.png?image_process=resize,w_330/crop,h_146/format,jpg", title: "nautilus" },
    { image: "home-v2/img_by_rootstock.png?image_process=resize,w_330/crop,h_146/format,jpg", title: "rootstock" },
  ];

  return (
    <div className="About__granted-by">
      <h2 className="About__title">Granted by</h2>
      <ul>
        {data.map(item => {
          return (
            <li key={item.title}>
              <img src={getOssUrl(item.image)} alt={item.title}/>
            </li>
          )
        })}
      </ul>
    </div>
  );
};

export default AboutGrantedBy;
