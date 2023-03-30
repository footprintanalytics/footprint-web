/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";

const AboutPartnerV2 = ({ list }) => {
  const data = [
    "home-v2/img_partner_1.png",
    "home-v2/img_partner_2.png",
    "home-v2/img_partner_3.png",
    "home-v2/img_partner_4.png",
    "home-v2/img_partner_5.png",
    "home-v2/img_partner_6.png",
    "home-v2/img_partner_7.png",
    "home-v2/img_partner_8.png",
    "home-v2/img_partner_9.png",
    "home-v2/img_partner_10.png",
    "home-v2/img_partner_11.png",
    "home-v2/img_partner_12.png",
    "home-v2/img_partner_13.png",
    "home-v2/img_partner_14.png",
    "home-v2/img_partner_15.png",
    "home-v2/img_partner_16.png",
    "home-v2/img_partner_17.png",
    "home-v2/img_partner_18.png",
    "home-v2/img_partner_19.png",
    "home-v2/img_partner_20.png",
  ];

  const topData = [...data.slice(0, 10), ...data.slice(0, 10), ]
  const bottomData = [...data.slice(10, 20), ...data.slice(10, 20), ]

  return (
    <div className="About__partnerV2">
      <div className="About__partnerV2-list-top">
        <ul>
          {topData.map(item =>
            <li key={item}>
              <div className="About__partnerV2-list-item">
                <AboutImage src={getOssUrl(item)} alt={item} placeholder={null}/>
              </div>
            </li>
          )}
        </ul>
      </div>
      <div className="About__partnerV2-list-bottom">
        <ul>
          {bottomData.map(item =>
            <li key={item}>
              <div className="About__partnerV2-list-item">
                <AboutImage src={getOssUrl(item)} alt={item} placeholder={null}/>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AboutPartnerV2;
