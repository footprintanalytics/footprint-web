/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { withRouter } from "react-router";
import {
  Button,
  message,
  Modal,
  Dropdown,
  AutoComplete,
  Input,
  Typography,
} from "antd";
import { connect } from "react-redux";
import {
  getLatestGAProjectId,
  getGrowthProjectPath,
} from "metabase/ab/utils/utils";
import { getUser } from "metabase/selectors/user";
import {
  loginModalShowAction,
  createFgaProjectModalShowAction,
} from "metabase/redux/control";
import { FilterOut } from "metabase/ab/components/FilterOut";
const { TextArea } = Input;

const SocialConnect = ({
  style,
  user,
  setLoginModalShowAction,
  setCreateFgaProjectModalShowAction,
  project,
  btnText,
  router,
}) => {
  return (
    <>
      <Button
        type="primary"
        style={style}
        onClick={e => {
          e.preventDefault();
          router?.push({
            pathname: getGrowthProjectPath(project, "Social Connect"),
          });
        }}
      >
        {btnText ?? "Map wallet address"}
      </Button>
    </>
  );
};

const mapDispatchToProps = {
  setLoginModalShowAction: loginModalShowAction,
  setCreateFgaProjectModalShowAction: createFgaProjectModalShowAction,
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    project: props.params.project,
    menu: props.params.menu,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SocialConnect),
);
