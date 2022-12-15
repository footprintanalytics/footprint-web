/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import "./index.css";
import Tops from "metabase/containers/why/components/Tops";
import Video from "metabase/containers/why/components/Video";
import Panel from "metabase/containers/why/components/Panel";
import Feedback from "metabase/containers/why/components/Feedback";
import AboutUs from "metabase/containers/why/components/AboutUs";
import Partners from "metabase/containers/why/components/Partners";
import HomeFooter from "metabase/containers/home/components/HomeFooter";
import Best from "metabase/containers/why/components/Best";

const Why = ({ children }) => {
  return (
    <div className="why bg-gray">
      <Tops />
      <Video />
      <Panel />
      <Feedback />
      <AboutUs />
      <Best />
      <Partners />
      <HomeFooter />
      {children}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

export default connect(mapStateToProps)(Why);
