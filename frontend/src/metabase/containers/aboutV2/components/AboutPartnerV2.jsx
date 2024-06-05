/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";

const AboutPartnerV2 = () => {
  const data = [
    { image: "home-v2/partner/img_partner_v2_consulting_group.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_ABGA.png", title: "ABGA" },
    // { image: "home-v2/partner/img_partner_v2_animoca Brands.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_arbitrum.png?1=1", title: "" },
    { image: "home-v2/partner/img_partner_v2_beosin.png?1=1", title: "" },
    { image: "home-v2/partner/img_partner_v2_bloomberg.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_coinGecko.png?1=1", title: "" },
    { image: "home-v2/partner/img_partner_v2_coinMarketCap.png?1=1", title: "" },
    { image: "home-v2/partner/img_partner_v2_combo.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_core_chain.png?1=1", title: "" },
    { image: "home-v2/partner/img_partner_v2_cronos.png?1=1", title: "" },
    { image: "home-v2/partner/img_partner_v2_crypto_times.png?1=1", title: "" },
    { image: "home-v2/partner/img_partner_v2_cryptoSlate.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_delphi_digital.png?1=1", title: "" },
    { image: "home-v2/partner/img_partner_v2_double_jump.png?1=1", title: "" },
    { image: "home-v2/partner/img_partner_v2_galachain.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_goplus.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_harmony.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_icp.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_merlin_chain.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_nautilus_chain.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_oasys.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_optimism.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_pebble.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_planet_IX.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_polygon.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_ronin.png?1=1", title: "" },
    { image: "home-v2/partner/img_partner_v2_rootstock.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_space_id.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_starknet.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_sui.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_taiko.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_trusta.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_walken.png", title: "" },
    { image: "home-v2/partner/img_partner_v2_xangle.png", title: "" }

    ];

  const topData = [...data.slice(0, 17), ...data.slice(0, 17), ]
  const bottomData = [...data.slice(17, data.length), ...data.slice(17, data.length), ].reverse()

  return (
    <div className="About__partnerV2">
      <div className="About__partnerV2-list-top">
        <ul>
          {topData.map((item, index) =>
            <li key={index}>
              <div className="About__partnerV2-list-item">
                <img src={getOssUrl(item.image)} alt={item.title} placeholder={null}/>
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
                <img src={getOssUrl(item.image)} alt={item.title} placeholder={null}/>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AboutPartnerV2;
