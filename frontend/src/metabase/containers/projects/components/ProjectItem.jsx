/* eslint-disable react/prop-types */

import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { push } from "react-router-redux";
import PreviewDashboardCard from "metabase/components/PreviewDashboardCard";
import { getLandingInfo } from "metabase/containers/projects/common";
// import DefaultDashboardCard from "metabase/components/DefaultDashboardCard";
import cx from "classnames";
import Link from "metabase/components/Link";
import { formatName } from "metabase/lib/urls";

const ProjectItem = ({ project, onChangeLocation }) => {
  const [showTagListScroll, setShowTagListScroll] = useState(false);
  const url = `/Detail/${project.landingId}/${formatName(project.name)}`;

  return (
    <React.Fragment>
      <Link
        className="project-analytics__item"
        to={`/${getLandingInfo().type}${url}`}
      >
        <div
          className="project-analytics__item-info"
          style={project.dashboardList.length ? {} : { minWidth: "100%" }}
        >
          <div className="flex align-center">
            <img
              className="project-analytics__item-icon"
              src={project.icon}
              alt=""
            />
            <span className="project-analytics__item-info-name">
              {project.name}
            </span>
          </div>
          <span
            className="project-analytics__item-info-desc"
            style={{ WebkitBoxOrient: "vertical" }}
          >
            {project.desc}
          </span>
          <div style={{ height: 60 }}>
            <div
              className={cx(
                "project-analytics__item-tag-list",
                showTagListScroll ? "overflow-auto" : "overflow-hidden",
              )}
              onMouseOver={() => setShowTagListScroll(true)}
              onMouseOut={() => setShowTagListScroll(false)}
            >
              {project.tags.map(tag => (
                <span key={tag} className="project-analytics__item-tag-item">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="project-analytics__item-dashboard-list">
          {/* {project.dashboardList.length === 0 && <DefaultDashboardCard />} */}
          {project.dashboardList.map(item => (
            <div
              key={item.publicUuid + item.id + item.type}
              className="project-analytics__item-dashboard-item"
            >
              <PreviewDashboardCard item={item} thumbMode={true} />
            </div>
          ))}
        </div>
      </Link>
    </React.Fragment>
  );
};

const mapDispatchToProps = {
  onChangeLocation: push,
};

export default withRouter(connect(null, mapDispatchToProps)(ProjectItem));
