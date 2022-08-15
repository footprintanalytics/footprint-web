import React from "react";
import data from "../data";
import { getOssUrl } from "metabase/lib/image";

const AboutBasic = () => {
  return (
    <div className="About__basic">
      <div className="About__basic-process">
        {data.basicData.map((item, index) => {
          return (
            <div className="About__basic-item" key={item.title}>
              <div style={{ marginTop: index % 2 === 1 ? 0 : 90 }} />
              <div className="About__basic-item-box">
                <h3>{item.count}</h3>
                <span>{item.title}</span>
                <img src={getOssUrl(item.image)} alt={item.title} />
              </div>
              <div className="About__basic-item-circle">
                <div className="About__basic-item-circle-inner" />
              </div>
            </div>
          );
        })}
      </div>
      <img
        className="About__basic-bottom-bg"
        src={getOssUrl("img_about_basic_2022081305.png")}
        alt="bg"
      />
    </div>
  );
};

export default AboutBasic;
