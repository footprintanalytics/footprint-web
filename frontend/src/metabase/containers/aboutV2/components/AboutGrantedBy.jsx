/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";
import { Link } from "react-router";

const AboutGrantedBy = () => {
  const data = [
    { image: "home-v2/img_by_sui.png?image_process=resize,w_330/crop,h_146/format,jpg", title: "sui" },
    { image: "home-v2/img_by_near_v2.png?image_process=resize,w_330/crop,h_146/format,jpg", title: "near" },
    { image: "home-v2/img_by_cronos_v2.png?image_process=resize,w_330/crop,h_146/format,jpg", title: "cronos" },
    { image: "home-v2/img_by_arb.jpg?image_process=resize,w_330/crop,h_146/format,jpg", title: "arbitrum", link: "https://portal.arbitrum.io/?project=footprint-analytics" },
    { image: "home-v2/img_by_nautilus.png?image_process=resize,w_330/crop,h_146/format,jpg", title: "nautilus", link: "https://nautchain.xyz/#/ecosystem" },
    { image: "home-v2/img_by_dfinity.png?image_process=resize,w_330/crop,h_146/format,jpg", title: "dfinity", link: "https://dfinity.org/grants" },
    { image: "home-v2/img_by_combo.png?image_process=resize,w_330/crop,h_146/format,jpg", title: "combo", link: "https://combonetwork.io/all-apps" },
    { image: "home-v2/img_by_starknet.jpg?image_process=resize,w_330/crop,h_146/format,jpg", title: "starknet", link: "https://www.starknet.io/en/ecosystem/block-explorers-indexers-and-enhanced-api" },
    { image: "home-v2/img_by_tarko.jpg?image_process=resize,w_330/crop,h_146/format,jpg", title: "rootstock" },
    { image: "home-v2/img_by_merlin.jpg?image_process=resize,w_330/crop,h_146/format,jpg", title: "merlin" },
    { image: "home-v2/img_by_gala.jpg?image_process=resize,w_330/crop,h_146/format,jpg", title: "galachain" },
    { image: "home-v2/img_by_core.jpg?image_process=resize,w_330/crop,h_146/format,jpg", title: "corechain", link: "https://coredao.org/explore/ecosystem" },
    { image: "home-v2/img_by_optimism_v2.png?image_process=resize,w_330/crop,h_146/format,jpg", title: "optimism" },
    { image: "home-v2/img_by_rootstock.png?image_process=resize,w_330/crop,h_146/format,jpg", title: "rootstock", link: "https://rootstock.io/ecosystem" },
  ];

  return (
    <div className="About__granted-by">
      <h2 className="About__title">Granted by</h2>
      <ul>
        {data.map((item, index) => {
          return (
            <li key={index}>
              <Link to={item.link} target="_blank">
                <img src={getOssUrl(item.image)} alt={item.title}/>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  );
};

export default AboutGrantedBy;
