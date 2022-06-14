/* eslint-disable react/prop-types */

import React from "react";
import Icon from "metabase/components/Icon";
import { IconBack } from "metabase/components/IconBack";

const DetailHead = ({ project, router }) => {
  return (
    <div className="project-detail__head">
      <div className="project-detail__head-container">
        <div className="project-detail__head-info">
          <div className="flex align-center">
            <IconBack router={router} url="/project" />
            <img
              className="project-detail__head-icon"
              src={project.icon}
              alt=""
            />
            <span className="project-detail__head-info-name">
              {project.name}
            </span>
          </div>

          {project.tags && project.tags.length > 0 && (
            <div className="project-detail__head-list-container">
              <span className="project-detail__head-list-label">Tags:</span>
              <div className="project-detail__head-list">
                {project.tags.map(tag => (
                  <span key={tag} className="project-detail__head-tag-item">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.contact && (
            <div className="project-detail__head-list-container">
              <span className="project-detail__head-list-label">Socials:</span>
              <div className="project-detail__head-list">
                {Object.keys(project.contact).map(key => {
                  const url = project.contact[key];
                  return url ? (
                    <Icon
                      key={key}
                      name={key}
                      className="project-detail__head-socail-item"
                      size={18}
                      color="#B8C1E3"
                      onClick={() => {
                        window.open(project.contact[key]);
                      }}
                    />
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailHead;
