/* eslint-disable react/prop-types */
import React from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { getUser } from "metabase/selectors/user";
import { getGrowthProjectPath } from "metabase/growth/utils/utils";

const ToAllUser = ({ style, user, router, menu, project }) => {
  return (
    <>
      <Button
        type="primary"
        style={style}
        onClick={() => {
          router?.push({
            pathname: getGrowthProjectPath(project, "Potential Users"),
          });
        }}
      >
        All users
      </Button>
    </>
  );
};
const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    project: props.params.project,
    menu: props.params.menu,
  };
};
export default withRouter(connect(mapStateToProps)(ToAllUser));
