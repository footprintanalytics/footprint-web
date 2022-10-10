/* eslint-disable react/prop-types */
import { Image, Skeleton } from "antd";
import { trackStructEvent } from "metabase/lib/analytics";
import React, { useState } from "react";
import WrapLink from "metabase/containers/about/components/WrapLink";
import { getUser } from "metabase/selectors/user";
import { push } from "react-router-redux";
import { loginModalShowAction } from "metabase/redux/control";
import _ from "underscore";
import { connect } from "react-redux";
import { RightOutlined } from "@ant-design/icons";

const AboutSection = ({
  reverse,
  borderless,
  title,
  subTitle,
  desc,
  list,
  height,
  exploreButton,
  onChangeLocation,
  setLoginModalShow,
  user,
}) => {
  const [sectionList, setSectionList] = useState(
    list.map((item, i) => ({ ...item, active: i === 0 })),
  );
  const active = sectionList.find(item => item.active);
  const isLogin = () => {
    if (user) {
      return true;
    } else {
      setLoginModalShow({ show: true, from: "Dashboards Profile" });
      return false;
    }
  };
  return (
    <div
      className={`About__container About__section ${
        borderless ? "About__section--borderless" : ""
      }`}
    >
      {title && <h3 className="About__title">{title}</h3>}
      <div
        className={`About__section-wrap ${
          reverse ? "About__section-wrap--reverse" : ""
        }`}
        style={height ? { height } : {}}
      >
        <div className="About__section-side">
          <ul>
            {sectionList.map(item => (
              <li
                className={item.active ? "About__section-side--active" : ""}
                key={item.title}
                onMouseOver={() => {
                  setSectionList(prev =>
                    prev.map(p => ({ ...p, active: p.title === item.title })),
                  );
                  trackStructEvent("About", `Section ${item.title}`);
                }}
              >
                {item.title}
              </li>
            ))}
          </ul>
          {exploreButton && (
            <WrapLink url={exploreButton?.url}>
              <div
                className={`About__btn About__btn--lg ${exploreButton?.className}`}
                onClick={e => {
                  trackStructEvent("About", exploreButton?.title);
                  if (exploreButton?.auth) {
                    e.preventDefault();
                    if (isLogin()) {
                      onChangeLocation(exploreButton?.url);
                    }
                  }
                }}
              >
                {exploreButton?.title}{" "}
                {exploreButton?.rightArrow && <RightOutlined className="ml1" />}
              </div>
            </WrapLink>
          )}
        </div>
        <div className="About__section-preview">
          <h4>{active.subTitle || subTitle}</h4>
          <p>{active.desc || desc}</p>
          <Image
            key={active.title}
            placeholder={
              <div className="About__section-img-placeholder">
                <Skeleton active />
              </div>
            }
            preview={false}
            className={`About__section-img ${
              active.hideBoxShadow ? "" : "About__section-img-shadow"
            }`}
            src={active.img}
            alt={active.title}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => ({
  user: getUser(state, props),
});

const mapDispatchToProps = {
  onChangeLocation: push,
  setLoginModalShow: loginModalShowAction,
};

export default _.compose(connect(mapStateToProps, mapDispatchToProps))(
  AboutSection,
);
