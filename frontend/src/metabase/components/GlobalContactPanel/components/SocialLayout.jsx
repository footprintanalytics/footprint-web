/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import Link from "metabase/core/components/Link";
import { trackStructEvent } from "metabase/lib/analytics";
import { socialData } from "metabase/components/GlobalContactPanel/data";
import cx from "classnames";

const SocialLayout = props => {
  const { title, className } = props;

  return (
    <div className={cx("global-contact-panel__social-layout", className)}>
      {title && (<span className="mr1 global-contact-panel__social-title">{title}</span>)}
      {socialData
        .filter(item => item.icon)
        .map(item => {
          return (
            <Link
              className="global-contact-panel__social-item"
              key={item.label}
              to={item.url}
              onClick={e => {
                e.preventDefault();
                trackStructEvent(
                  ` help-center click social out ${item.label}`,
                );
                window.open(item.url, "_blank");
              }}
            >
              {/*<Icon name={item.icon} size={24} color={color("brand")} style={{background: "white"}}/>*/}
              {item.svg}
              <div className="global-contact-panel__social-item-icon-bg"/>
            </Link>
          );
        })}
    </div>
  );
};

export default SocialLayout;
