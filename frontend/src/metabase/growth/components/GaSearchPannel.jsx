/* eslint-disable react/prop-types */
import React, { useContext } from "react";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import { getOssUrl } from "metabase/lib/image";
import Meta from "metabase/components/Meta";
import { StateProvider, StateContext } from "./StateProvider";
import "../css/index.css";

const GaSearchPannel = props => {
  return (
    <div
      className="flex flex-column items-center"
      style={{ minWidth: 400, minHeight: 400 }}
    ></div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(GaSearchPannel);
