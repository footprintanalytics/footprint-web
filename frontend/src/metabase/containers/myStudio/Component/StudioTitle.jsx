/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import "../index.css";

const StudioTitle = props => {
  const { title } = props;
  return (
    <>
      <div className={"studio-title"}>
        <h2 className={"studio-title__text"}>
          {title}
        </h2>
        <div className="studio__line"/>
      </div>
    </>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: state.currentUser,
  };
};

export default connect(mapStateToProps)(StudioTitle);
