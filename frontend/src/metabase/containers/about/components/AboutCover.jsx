/* eslint-disable react/prop-types */
import { Spin } from "antd";
import { getOssUrl } from "metabase/lib/image";
import React from "react";

const AboutCover = ({ indicator }) => {
  const list = [
    {
      title: "We Cover",
      list: [
        { title: "Chains", total: indicator?.chains },
        { title: "Protocols", total: indicator?.protocols },
        { title: "Token", total: indicator?.tokens },
        { title: "NFT Collections", total: indicator?.nftCollections },
        { title: "Address Tags", total: indicator?.tags },
      ],
    },
    {
      title: "We Share",
      list: [
        { title: "Dashboards", total: indicator?.dashboards },
        { title: "Charts", total: indicator?.charts },
      ],
    },
  ];

  return (
    <div
      className="About__cover"
      style={{ backgroundImage: `url(${getOssUrl("20220602175846.png")})` }}
    >
      <div className="About__container About__cover-wrap">
        {list.map(item => (
          <div key={item.title} className="About__cover-list">
            <h3 className="About__title">{item.title}</h3>
            <ul>
              {item.list.map(item => (
                <li key={item.title}>
                  <b>{item.total ? item.total.toLocaleString() : <Spin />}</b>
                  <h4>{item.title}</h4>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutCover;
