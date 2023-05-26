/* eslint-disable react/prop-types */
import React from "react";
import { getOssUrl } from "metabase/lib/image";
import "./index.css";
import DataStaticTooltip from "metabase/containers/dataApi/components/DataStaticTooltip";
import { getFgaComparePlans } from "metabase/growth/utils/data";

const FgaPricingCompare = ({ user }) => {
  const comparePlans = getFgaComparePlans({ user });

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
                  <h6>
                    {l.name}
                    {l.dataStaticTooltip && <DataStaticTooltip />}
                  </h6>
                  {comparePlans.columns.map(c => (
                    <section key={l.name + c.label}>
                      {typeof l[c.value] === "object" && (
                        <div className="flex flex-row items-center justify-center">
                          {" "}
                          <img
                            src={getOssUrl(
                              l[c.value].enable
                                ? "20220722115105.png"
                                : "20220722115336.png",
                            )}
                            width={22}
                            height={16}
                          />
                          <span className=" ml1">{l[c.value].tip}</span>
                        </div>
                      )}
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

export default FgaPricingCompare;
