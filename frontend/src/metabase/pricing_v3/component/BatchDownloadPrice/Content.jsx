/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { loginModalShowAction } from "metabase/redux/control";

const Content = ({ data, user, setLoginModalShow, onCancelSubscription }) => {
  const formatValue = (value) => {
    if (!value) {
      return "/";
    }
    return `$${value?.toLocaleString()}`
  }
  return (
    <div className="batch-download-content">
      <ul>
        {data?.map(item => {
          return (
            <li key={item.chain}>
              <div>{item.chain}</div>
              <div>{formatValue(item.bronze?.historical)}</div>
              <div>{formatValue(item.bronze?.incremental)}</div>
              <div>{formatValue(item.trace?.historical)}</div>
              <div>{formatValue(item.trace?.incremental)}</div>
            </li>
          )
        })}
      </ul>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
