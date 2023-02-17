/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import "../../containers/why/index.css";

const About = props => {
  const { router, location, children, user } = props;
  return <div>Growth Analytics</div>;
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(About);
