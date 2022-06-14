/* eslint-disable react/prop-types */

import React from "react";
import { Skeleton } from "antd";
import ProjectItem from "./ProjectItem";

const ProjectList = ({ projects }) => {
  return (
    <div className="project-analytics__list">
      {projects === null ? (
        <Skeleton active />
      ) : (
        projects.map(item => (
          <ProjectItem key={item.landingId} project={item} />
        ))
      )}
    </div>
  );
};

export default ProjectList;
