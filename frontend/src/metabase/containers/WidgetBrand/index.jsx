/* eslint-disable react/prop-types */
import React from "react";
import "./index.css";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import _ from "underscore";

const WidgetBrand = ({ color }) => {
  const text = "Footprint";

  return (
    <div className="widget-brand" style={{ color: color || "#dcdcdc" }}>
      {text}
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    color: props?.location?.query?.color,
  };
};

export default _.compose(
  withRouter,
  connect(mapStateToProps, null),
)(WidgetBrand);
