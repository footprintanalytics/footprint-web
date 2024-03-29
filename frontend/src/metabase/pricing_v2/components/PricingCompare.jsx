/* eslint-disable react/prop-types */
import React from "react";
import { getComparePlans } from "metabase/pricing_v2/config";
import { getOssUrl } from "metabase/lib/image";
import DataStaticTooltip from "metabase/containers/dataApi/components/DataStaticTooltip";

const PricingCompare = ({ user, groups, subscriptionDetailList }) => {
  const canBusinessSevenTrial = !!groups
    ?.find(group => group.type === "business")
    ?.products
    ?.find(product => product.category === "7-trial");
  const canTeamPay = !!groups
    ?.find(group => group.type === "team")
    ?.products?.length > 0;
  const comparePlans = getComparePlans({user, canBusinessSevenTrial, subscriptionDetailList, canTeamPay});

  return (
    <div className="Pricing__compare">
      <div className="Pricing__compare-head">
        <h3>{comparePlans.title}</h3>
        {comparePlans.columns.map(item => (
          <h4 key={item.value}>{item.label}</h4>
        ))}
      </div>
      <div className="Pricing__compare-body">
        {comparePlans.list.map(item => (
          <div key={item.type} className="Pricing__compare-body-list">
            <h5>{item.type}</h5>
            <ul className="Pricing__compare-body-item">
              {item.list.map(l => (
                <li key={l.name}>
                  <h6>{l.name}{l.dataStaticTooltip && (<DataStaticTooltip />)}</h6>
                  {comparePlans.columns.map(c => (
                    <section key={l.name + c.label}>
                      {l[c.value] === true && (
                        <img
                          src={getOssUrl("20220722115105.png")}
                          width={22}
                          height={16}
                        />
                      )}
                      {l[c.value] === false && (
                        <img
                          src={getOssUrl("20220722115336.png")}
                          width={20}
                          height={20}
                        />
                      )}
                      {typeof l[c.value] === "string" && (
                        <span>{l[c.value]}</span>
                      )}
                    </section>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingCompare;
