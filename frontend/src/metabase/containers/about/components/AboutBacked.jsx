/* eslint-disable react/prop-types */
import { trackStructEvent } from "metabase/lib/analytics";
import { getOssUrl } from "metabase/lib/image";
import React from "react";
import WrapLink from "./WrapLink";

const AboutBacked = ({ list }) => {
  return (
    <div className="About__container About__backed">
      <h3 className="About__title">Backed by the best</h3>
      <ul>
        {list.map(item => (
          <li key={item.url}>
            <WrapLink
              url={item.url}
              onClick={() => trackStructEvent("About", `Backed ${item.url}`)}
            >
              <img src={getOssUrl(item.logo)} alt={item.url} />
            </WrapLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AboutBacked;
