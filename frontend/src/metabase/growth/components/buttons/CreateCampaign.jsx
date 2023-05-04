/* eslint-disable react/prop-types */
import React from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import {
  loginModalShowAction,
  createFgaProjectModalShowAction,
} from "metabase/redux/control";
import { getFgaProject, getUser } from "metabase/selectors/user";
import { getGrowthProjectPath } from "metabase/growth/utils/utils";

const CreateCampaign = ({
  style,
  user,
  setLoginModalShowAction,
  setCreateFgaProjectModalShowAction,
  project,
  projectDetails,
  plain,
}) => {
  const onClickCreateCampaign = () => {
    getGrowthProjectPath(project, "CreateCampaign");
  };
  return (
    <>
      {plain ? (
        <div onClick={onClickCreateCampaign}>Create Campaign</div>
      ) : (
        <Button type="primary" style={style} onClick={onClickCreateCampaign}>
          Create Campaign
        </Button>
      )}
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
    projectDetails: getFgaProject(state),
    project: props.params.project,
    menu: props.params.menu,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateCampaign);
