/* eslint-disable react/prop-types */
import React from "react";

const ProjectHealth = props => {
  const { router, location, children, user, projectPath, menu, projectObject } =
    props;
  return (
    <div className="flex flex-column items-center">
      Project Health
    </div>
  );
};


export default ProjectHealth;
