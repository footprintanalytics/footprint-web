/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { getOssUrl } from "metabase/lib/image";
import { loginModalShowAction } from "metabase/redux/control";
import { getUser } from "metabase/selectors/user";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";
import AboutButton from "metabase/containers/aboutV2/components/AboutButton";
import { CHAIN_COUNT } from "metabase/lib/constants";
import Link from "metabase/core/components/Link";
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
    return <img height={28} width={28} src={getOssUrl("home-v2/img_right_icon.png")} alt={"Arrow Right"}/>;
  }
  return (
    <div className="About__start">
      <div className="About__start-pea">
        <img src={getOssUrl("icon_pea.png?1=1")} alt="Pea AI" />
        <span style={{ color: "#B275FF" }}>Pea.AI</span><div><span>: The first GPT creation platform based on crypto vertical LLM! <br/>Go and earn Points by contributing data. </span>
        <Link style={{ color: "#B275FF", marginLeft: 4 }} href={"https://www.pea.ai"} target={"_blank"}>Join now {">>"}</Link></div>
      </div>
      <div className="About__start-title">
        <h1>Empower Decisions <br/>with Unified Web2 <br/>and Web3 Data</h1>
        <ul>
          <li>
            <CreateImage />
            <span>{CHAIN_COUNT} Chains</span>
          </li>
          <li>
            <CreateImage />
            <span>GameFi, NFT, and DeFi sectors</span>
          </li>
          <li>
            <CreateImage />
            <span>Off-Chain & On-Chain Data</span>
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
