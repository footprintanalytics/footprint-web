/* eslint-disable react/prop-types */
import React from "react";
import { trackStructEvent } from "metabase/lib/analytics";
import Icon from "metabase/components/Icon";
import { color } from "metabase/lib/colors";
import data from "../data";
import WrapLink from "./WrapLink";

const AboutSocial = ({ size = 16 }) => {
  return (
    <div className="About__social">
      {data.socialData.map(item => {
        return (
          <WrapLink
            className="About__social-item"
            key={item.label}
            url={item.url}
            onClick={e => {
              trackStructEvent(`about click social out ${item.label}`);
            }}
          >
            <div
              className="About__social-item-icon-bg"
              style={{ background: item.background }}
            >
              <Icon name={item.icon} size={size} color={color("white")} />
            </div>
          </WrapLink>
        );
      })}
    </div>
  );
};

export default AboutSocial;
