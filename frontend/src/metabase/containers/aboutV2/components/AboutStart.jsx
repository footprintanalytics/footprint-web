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
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";
import AboutButton from "metabase/containers/aboutV2/components/AboutButton";

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

  const CreateImage = () => {
    return <AboutImage src={getOssUrl("home-v2/img_right_icon.png")}/>;
  }
  return (
    <div className="About__start">
      <div className="About__start-title">
        <h1>Empower Decisions <br/>with Unified Off-Chain <br/>and & Web3 Data</h1>
        <ul>
          <li>
            <CreateImage />
            <span>25+ Chains</span>
          </li>
          <li>
            <CreateImage />
            <span>GameFi, NFT, DeFi Sectors</span>
          </li>
          <li>
            <CreateImage />
            <span>Off-chain & On-chain Data</span>
          </li>
        </ul>
        <div className="flex" style={{ marginTop: 50 }}>
          <AboutButton
            buttonText={user ? "view docs" : "Try for free"}
            onClick={(e) => {
            if (isLogin()) {
              window.open("https://docs.footprint.network/");
            }
          }}/>
          <AboutButton className="ml2" buttonText="Contact us" link="mailto:sales@footprint.network"/>
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
  AboutStart,
);
