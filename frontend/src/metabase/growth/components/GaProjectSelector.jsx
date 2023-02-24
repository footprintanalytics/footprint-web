/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Select } from "antd";
import { withRouter } from "react-router";
import { getUser } from "metabase/selectors/user";
import { getLatestGAProject, saveLatestGAProject } from "../utils/utils";
import "../css/index.css";

const GaProjectSelector = props => {
  const { router, location } = props;
  const projects = [
    { value: "the-sandbox", label: "The Sandbox" },
    { value: "sunflower-farmers", label: "Sunflower Farmers" },
  ];

  const [currentProject, setCurrentProject] = useState();
  useEffect(() => {
    if (location?.query?.project_name) {
      setCurrentProject(location.query.project_name);
      saveLatestGAProject(location.query.project_name);
    } else {
      setCurrentProject(
        getLatestGAProject() ? getLatestGAProject() : projects[0].value,
      );
    }
  }, [location?.query?.project_name]);
  const handleProjectChange = value => {
    router?.push({
      pathname: location.pathname,
      query: { ...location.query, project_name: value, gamefi: value },
    });
  };
  return (
    <div className="flex flex-column items-center">
      {projects && projects.length > 0 && (
        <Select
          value={currentProject}
          size={"large"}
          style={{ margin: "0px", width: "300px", borderRadius: "15px" }}
          onChange={handleProjectChange}
          options={projects}
        />
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default withRouter(connect(mapStateToProps)(GaProjectSelector));
