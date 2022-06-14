/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import Icon from "metabase/components/Icon";
import Link from "metabase/components/Link";
import { trackStructEvent } from "metabase/lib/analytics";
import { color } from "metabase/lib/colors";
import { socialData } from "metabase/components/GlobalContactPanel/data";

const Panel = props => {
  const { closeAction, style } = props;

  return (
    <div
      className="global-contact-panel__inner"
      style={{
        ...style,
      }}
    >
      <div className="footprint-title2 global-contact-panel__section">
        Need More Help?
      </div>
      <Icon
        className="global-contact-panel__close"
        name="close"
        size={20}
        onClick={closeAction}
      />
      <div
        style={{
          display: "grid",
          gridGap: "10px",
          width: "100%",
          marginTop: 50,
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
        }}
      >
        {socialData.map(item => {
          return (
            <Link
              className="global-contact-panel__item"
              to={item.url}
              key={item.label}
              onClick={e => {
                e.preventDefault();
                trackStructEvent(`help-center click social ${item.label}`);
                window.open(item.url);
              }}
            >
              {item.icon ? (
                <Icon name={item.icon} size={25} color={color("brand")} />
              ) : (
                <span>{item.label}</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Panel;
