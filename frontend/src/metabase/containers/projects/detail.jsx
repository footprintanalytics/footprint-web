/* eslint-disable react/prop-types */

import React, { useEffect, useState } from "react";
import { useProject } from "./use";
import DetailHead from "./components/DetailHead";
import ShareModal from "metabase/containers/home/components/ShareModal";
import PreviewDashboardCard from "metabase/components/PreviewDashboardCard";
import "./detail.css";
import DefaultDashboardCard from "metabase/components/DefaultDashboardCard";
import title, { updateTitle } from "metabase/hoc/Title";

const ProjectDetail = ({ params, router }) => {
  const landingId = params.slug;
  const { project } = useProject({ landingId });
  const [shareModalResource, setShareModalResource] = useState({});

  useEffect(() => {
    if (project) {
      updateTitle(project.name);
    }
  }, [project]);

  return (
    <React.Fragment>
      <div className="project-detail__container">
        {project && (
          <React.Fragment>
            <DetailHead project={project} router={router} />
            <div className="project-detail__Content">
              <div className="project-detail__section">
                <span className="project-detail__section-title">
                  Featured Dashboard
                </span>

                <div className="project-detail__dashboard-list">
                  {project.dashboardList.length === 0 && (
                    <DefaultDashboardCard height={225} />
                  )}
                  {project.dashboardList.map(item => (
                    <div
                      key={item.publicUuid + item.id + item.type}
                      className="project-detail__dashboard-item"
                    >
                      <PreviewDashboardCard
                        item={item}
                        shareAction={entity => {
                          setShareModalResource({
                            open: true,
                            public_uuid: entity.publicUuid,
                            type: entity.type,
                            name: entity.name,
                            id: entity.id,
                            uniqueName: entity.uniqueName,
                            creator: entity.creator,
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              {project.desc && (
                <div className="project-detail__section">
                  <span className="project-detail__section-title">
                    About {project.name}
                  </span>
                  <div className="project-detail__about">{project.desc}</div>
                </div>
              )}
            </div>
          </React.Fragment>
        )}
      </div>
      <ShareModal
        resource={shareModalResource}
        onClose={() => setShareModalResource({})}
      />
    </React.Fragment>
  );
};

export default title()(ProjectDetail);
