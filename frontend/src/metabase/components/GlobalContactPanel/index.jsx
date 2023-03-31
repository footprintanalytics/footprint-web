import React, { useState } from "react";
import cx from "classnames";
import "./index.css";
import { isDefi360 } from "metabase/lib/project_info";
import Panel from "metabase/components/GlobalContactPanel/components/panel";
import { spring } from "react-motion";
import Motion from "react-motion/lib/Motion";
import Icon from "metabase/components/Icon";
import { trackStructEvent } from "metabase/lib/analytics";
import Link from "metabase/core/components/Link";
import { deviceInfo } from "metabase-lib/lib/Device";
import { socialData } from "metabase/components/GlobalContactPanel/data";

const Index = () => {
  const [mouseOver, setMouseOver] = useState(false);
  const [active, setActive] = useState(false);
  const helpRef = React.createRef();

  const isChart = window?.location?.pathname?.startsWith("/chart");
  const isAdminPage = window?.location?.pathname?.startsWith("/admin");
  const showSocialPanel =
    !isChart
    && !isAdminPage
    && !deviceInfo.isMobile;
  const showHelpButtonPanel = false;
  const isDark = window?.location?.pathname === "/";

  const closeAction = () => {
    setActive(false);
    trackStructEvent("help-center click close");
  };

  if (isDefi360()) {
    return null;
  }

  return (
    <div
      className={cx("global-contact-panel__container html2canvas-filter", { "dark": isDark })}
    >
      {active && (
        <Motion
          defaultStyle={{
            opacity: 0,
            translateX: 380,
          }}
          style={{
            opacity: active ? spring(1) : spring(0),
            translateX: active ? spring(0) : spring(380),
          }}
        >
          {({ opacity, translateX }) => (
            <Panel
              style={{
                borderRadius: 0,
                opacity,
                transform: `translateX(${translateX}px)`,
              }}
              closeAction={closeAction}
            />
          )}
        </Motion>
      )}

      {showSocialPanel && (
        <div className="global-contact-panel__social">
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
      )}

      {showHelpButtonPanel && (
        <Motion
          defaultStyle={{ width: 40 }}
          style={{ width: mouseOver || active ? spring(74) : spring(40) }}
        >
          {({ width }) => (
            <div
              className="global-contact-panel__contact"
              ref={helpRef}
              style={{ width }}
              onMouseEnter={() => setMouseOver(true)}
              onMouseLeave={() => setMouseOver(false)}
              onClick={e => {
                e.preventDefault();
                if (!active) {
                  trackStructEvent("help-center click open");
                } else {
                  trackStructEvent("help-center click close");
                }
                setActive(!active);
              }}
            >
              <Icon name="help_center" size={24} />
              {width > 60 && <span>Help</span>}
            </div>
          )}
        </Motion>
      )}
    </div>
  );
};

export default Index;
