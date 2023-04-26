/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { getOssUrl } from "metabase/lib/image";
import { loginModalShowAction } from "metabase/redux/control";
import { getUser } from "metabase/selectors/user";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";
import AboutButton from "metabase/containers/aboutV2/components/AboutButton";

const AboutStart = ({
  user,
  setLoginModalShow,
}) => {
  const isLogin = () => {
    if (user) {
      return true;
    } else {
      setLoginModalShow({ show: true, from: "Dashboards Profile", defaultRegister: true });
      return false;
    }
  };

  const CreateImage = () => {
    return <AboutImage src={getOssUrl("home-v2/img_right_icon.png")}/>;
  }
  return (
    <div className="About__start">
      <div className="About__start-title">
        <h1>Empower Decisions <br/>with Unified Off-Chain <br/>and Web3 Data</h1>
        <ul>
          <li>
            <CreateImage />
            <h2>26 Chains</h2>
          </li>
          <li>
            <CreateImage />
            <h2>GameFi, NFT, DeFi Sectors</h2>
          </li>
          <li>
            <CreateImage />
            <h2>Off-Chain & On-Chain Data</h2>
          </li>
        </ul>
        <div className="flex" style={{ marginTop: 50 }}>
          <AboutButton
            buttonText={user ? "View Docs" : "Try for Free"}
            onClick={(e) => {
              e.preventDefault()
              if (isLogin()) {
                window.open("https://docs.footprint.network/");
              }
            }}
          />
          <AboutButton className="ml2" buttonClassName="about__button-second" buttonText="Contact Us" link="mailto:sales@footprint.network"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(AboutStart);
