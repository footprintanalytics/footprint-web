/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";

const AboutPartnerV2 = () => {
  const data = [
    { image: "home-v2/img_partner_1.png", title: "near" },
    { image: "home-v2/img_partner_2.png", title: "getblock" },
    { image: "home-v2/img_partner_3.png", title: "CryptoSlate" },
    { image: "home-v2/img_partner_4.png", title: "GMX" },
    { image: "home-v2/img_partner_5.png", title: "ABGA" },
    { image: "home-v2/img_partner_6.png", title: "G+" },
    { image: "home-v2/img_partner_34.png", title: "GAME MINE" },
    { image: "home-v2/img_partner_21.png", title: "Bloomberg" },
    { image: "home-v2/img_partner_22.png", title: "animoca brands" },
    { image: "home-v2/img_partner_23.png", title: "scopely" },
    { image: "home-v2/img_partner_24.png", title: "polemos" },
    { image: "home-v2/img_partner_25.png", title: "tokens.com" },
    { image: "home-v2/img_partner_26.png", title: "talentum" },
    { image: "home-v2/img_partner_27.png", title: "particle network" },
    { image: "home-v2/img_partner_7.png", title: "walken" },
    { image: "home-v2/img_partner_8.png", title: "BA7" },
    { image: "home-v2/img_partner_9.png", title: "elven" },
    { image: "home-v2/img_partner_10.png", title: "Cordy" },
    { image: "home-v2/img_partner_11.png", title: "Ginoa.io" },
    { image: "home-v2/img_partner_12.png", title: "TRUSTA" },
    { image: "home-v2/img_partner_13.png", title: "ALIS" },
    { image: "home-v2/img_partner_14.png", title: "PLANETIX" },
    { image: "home-v2/img_partner_15.png", title: "GAVE" },
    { image: "home-v2/img_partner_17.png", title: "polygon" },
    { image: "home-v2/img_partner_18.png", title: "cronos" },
    { image: "home-v2/img_partner_19.png", title: "Harmony" },
    { image: "home-v2/img_partner_20.png", title: "HIVE" },
    { image: "home-v2/img_partner_28.png", title: "BEOSIN" },
    { image: "home-v2/img_partner_36.png", title: "Pebble" },
    { image: "home-v2/img_partner_29.png", title: "Moonbeam" },
    { image: "home-v2/img_partner_30.png", title: "SEPTENI INCUBATE" },
    { image: "home-v2/img_partner_31.png", title: "Crypto Times" },
    { image: "home-v2/img_partner_32.png", title: "NFT Plazas" },
    { image: "home-v2/img_partner_33.png", title: "NFTb" },
    ];

  const topData = [...data.slice(0, 16), ...data.slice(0, 16), ]
  const bottomData = [...data.slice(16, data.length), ...data.slice(16, data.length), ]

  return (
    <div className="About__partnerV2">
      <div className="About__partnerV2-list-top">
        <ul>
          {topData.map((item, index) =>
            <li key={index}>
              <div className="About__partnerV2-list-item">
                <AboutImage src={getOssUrl(item.image)} alt={item.title} placeholder={null}/>
              </div>
            </li>
          )}
        </ul>
      </div>
      <div className="About__partnerV2-list-bottom">
        <ul>
          {bottomData.map((item, index) =>
            <li key={index}>
              <div className="About__partnerV2-list-item">
                <AboutImage src={getOssUrl(item.image)} alt={item.title} placeholder={null}/>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AboutPartnerV2;
