/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import _ from "underscore";
import { trackStructEvent } from "metabase/lib/analytics";
import AboutSocial from "metabase/containers/about/components/AboutSocial";
import AboutBasic from "metabase/containers/about/components/AboutBasic";
import { getOssUrl } from "metabase/lib/image";
import { loginModalShowAction } from "metabase/redux/control";
import { getUser } from "metabase/selectors/user";
import data from "../data";
import WrapLink from "./WrapLink";

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
        <h1>Blockchain analytics made simple</h1>
        <h2>
          Explore community-built analysis and create charts <br />
          with no code required.
        </h2>
      </div>
      <div className="About__start-text-highlight">
        <img
          className="mr1"
          src={getOssUrl("img-home-celebrate.png")}
          alt="celebrate"
        />
        Full history, real time!
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
