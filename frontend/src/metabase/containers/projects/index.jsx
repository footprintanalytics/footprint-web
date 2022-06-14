/* eslint-disable react/prop-types */

import React from "react";
import ProjectList from "./components/ProjectList";
import { useProjectList } from "./use";
import "./index.css";
import { getLandingInfo } from "metabase/containers/projects/common";

const ProjectAnalytics = () => {
  const { projects } = useProjectList();
  const title = getLandingInfo().title;
  const landingPageTitle = `${title} Analytics`;
  const landingPageDesc = `${title} Analytics on Footprint`;

  return (
    <div className="project-analytics__container">
      <div className="project-analytics__head">
        <span className="project-analytics__head-title">
          {landingPageTitle}
        </span>
        <span className="project-analytics__head-sub-title">
          {landingPageDesc}
        </span>
      </div>
      <ProjectList projects={projects} />
    </div>
  );
};

export default ProjectAnalytics;
