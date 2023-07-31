/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { getFgaProject, getUser } from "metabase/selectors/user";
import Edit from "./component/edit";
import View from "metabase/ab/containers/Journey/component/view";

const Journey = props => {
  // const { router, location, children, user, projectPath, menu, projectObject } =
  //   props;
  return (
    <div className="flex flex-column items-center">
      <View />
    </div>
  );
};


export default Journey;
