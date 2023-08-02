/* eslint-disable react/prop-types */
import React from "react";
import { Button } from "antd";
import Icon from "metabase/components/Icon";
import "../index.css";
import { getFgaProject } from "metabase/selectors/user";
// eslint-disable-next-line import/order
import { connect } from "react-redux";
import Link from "metabase/core/components/Link";

const Buttons = props => {
  const { type, projectObject } = props;
  const projectName = projectObject.protocolSlug;
  if (type === "create") {
    return (
      <Link className="flex align-center" to={`/ab/project/${projectName}/journey-edit`}>
        <Button className="mx1" type="primary">
          <Icon className="mr1" name="add" size={10} />
            Create
        </Button>
      </Link>
    );
  }
  if (type === "list") {
    return (
      <Link to={`/ab/project/${projectName}/journey-list`}>
        <Button className="mx1">
          Saved Journey
        </Button>
      </Link>
    );
  }
  return (
    <div>

    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    projectObject: getFgaProject(state),
  };
};

export default connect(
  mapStateToProps,
  null,
)(Buttons);
