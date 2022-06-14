/* eslint-disable react/prop-types */
import { trackStructEvent } from "metabase/lib/analytics";
import { getOssUrl } from "metabase/lib/image";
import React from "react";
import WrapLink from "./WrapLink";

const AboutPartner = ({ list }) => {
  return (
    <div className="About__container About__partner">
      <h3 className="About__title">Partner</h3>
      <ul>
        {list.map(item => (
          <li key={item.url}>
            <WrapLink
              url={item.url}
              onClick={() => trackStructEvent("About", `Partner ${item.url}`)}
            >
              <img src={getOssUrl(item.logo)} alt={item.url} />
            </WrapLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AboutPartner;
