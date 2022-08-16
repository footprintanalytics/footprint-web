/* eslint-disable react/prop-types */
import React from "react";
import WrapLink from "./WrapLink";
import { trackStructEvent } from "metabase/lib/analytics";
import AboutSocial from "metabase/containers/about/components/AboutSocial";
import AboutBasic from "metabase/containers/about/components/AboutBasic";
import data from "../data";
import { getUser } from "metabase/selectors/user";
import { push } from "react-router-redux";
import { loginModalShowAction } from "metabase/redux/control";
import _ from "underscore";
import { connect } from "react-redux";
const AboutStart = ({
  user,
  setLoginModalShow,
  onChangeLocation,
  indicator,
}) => {
  const isLogin = () => {
    if (user) {
      return true;
    } else {
      setLoginModalShow({ show: true, from: "Dashboards Profile" });
      return false;
    }
  };
  return (
    <div className="About__start">
      <div className="About__start-title">
        <h3>
          The One-Stop Blockchain
          <br />
          Analytics Platform.
        </h3>
        <span>No-coding Required.</span>
      </div>
      <AboutSocial />
      <div className="About__start-buttons">
        {data.startButtonData.map(item => {
          return (
            <WrapLink
              key={item.title}
              url={item.url}
              onClick={e => {
                if (item.auth) {
                  e.preventDefault();
                  if (isLogin()) {
                    onChangeLocation(item.url);
                  }
                }
              }}
            >
              <div
                className={`About__btn About__btn--width-250 ${item.className}`}
                onClick={() => trackStructEvent("About", item.title)}
              >
                {item.title}
              </div>
            </WrapLink>
          );
        })}
      </div>
      <AboutBasic indicator={indicator} />
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
  AboutStart,
);
