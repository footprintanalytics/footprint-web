import React from "react";
import WrapLink from "./WrapLink";
import { trackStructEvent } from "metabase/lib/analytics";
import Icon from "metabase/components/Icon";
import { color } from "metabase/lib/colors";
import data from "../data";

const AboutSocial = () => {
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
              <Icon name={item.icon} size={16} color={color("white")} />
            </div>
          </WrapLink>
        );
      })}
    </div>
  );
};

export default AboutSocial;
