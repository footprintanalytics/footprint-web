/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { getUser, getFgaProject } from "metabase/selectors/user";
import { StatisticIndex } from "../components/Community/StatisticIndex";
import { QuickFilter } from "../components/Community/QuickFilter";
import { ValueFilter } from "../components/Community/ValueFilter";
import { WalletList } from "../components/Community/WalletList";

const Community = props => {
  const { router, location, children, user, projectPath, menu, projectObject } =
    props;
  return (
    <div className="flex flex-column items-center w-full p2">
      <StatisticIndex />
      <ValueFilter />
      <QuickFilter />
      <WalletList />
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectPath: props?.params?.project,
    projectObject: getFgaProject(state),
    menu: props?.params?.menu,
  };
};

export default connect(mapStateToProps)(Community);
