/* eslint-disable react/prop-types */
import React from "react";
import { push } from "react-router-redux";
import connect from "react-redux/lib/connect/connect";
import { getChannel } from "metabase/selectors/app";
import "../index.css";
import "../../academy/index.css";
import Box from "metabase/containers/academy/components/Box";

const Index = ({ router }) => {
  const selectCategory = { label: "Feature Charts", value: "Feature Charts" };
  return (
    <div className="news-articles__container">
      <Box router={router} selectCategory={selectCategory} />
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
