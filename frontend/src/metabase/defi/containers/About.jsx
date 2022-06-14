/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import Layout from "../components/Layout";
import DashboardSubmitProtocol from "../components/DashboardSubmitProtocol";
import { Space } from "antd";
import AboutBanner from "../components/AboutBanner";
import AboutEmpower from "../components/AboutEmpower";
import AboutChain from "../components/AboutChain";
import AboutTVL from "../components/AboutTVL";
import AboutTrade from "../components/AboutTrade";
import AboutTarget from "../components/AboutTarget";
import AboutCompetiveness from "../components/AboutCompetiveness";
import AboutWhat from "../components/AboutWhat";
import AboutWhy from "../components/AboutWhy";
import Best from "metabase/containers/why/components/Best";
import Partners from "metabase/containers/why/components/Partners";
import HomeFooter from "metabase/containers/home/components/HomeFooter";
import "../../containers/why/index.css";

const About = props => {
  const { router, location, children, user } = props;

  return (
    <div className="defi-about">
      <Layout
        router={router}
        location={location}
        rightHeader={
          <Space>
            <DashboardSubmitProtocol />
          </Space>
        }
      >
        <div className="defi-about__content">
          <AboutBanner user={user} />
          <AboutEmpower />
          <AboutChain />
          <AboutTVL />
          <AboutTrade />
          <AboutTarget />
          <AboutCompetiveness />
          <AboutWhy />
          <AboutWhat />
          <Best />
          <Partners />
          <HomeFooter />
        </div>
      </Layout>
      {children}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(About);
