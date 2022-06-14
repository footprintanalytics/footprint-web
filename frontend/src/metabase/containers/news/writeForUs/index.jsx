/* eslint-disable react/prop-types */
import React from "react";
import { push } from "react-router-redux";
import connect from "react-redux/lib/connect/connect";
import { getChannel } from "metabase/selectors/app";
import "../index.css";
import Tops from "./components/Tops";
import Content from "./components/Content";

const Index = () => {
  return (
    <div className="news-us__container">
      <Tops />
      <Content />
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: state.currentUser,
    channel: getChannel(state, props),
  };
};

const mapDispatchToProps = {
  onChangeLocation: push,
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
