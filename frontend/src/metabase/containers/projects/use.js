import { useEffect, useState } from "react";
import { getLandingList, getLandingDetail } from "metabase/new-service";
import { getLandingInfo } from "metabase/containers/projects/common";

export const useProjectList = () => {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    const _getProjects = async () => {
      const res = await getLandingList(getLandingInfo().type);
      setProjects(res.data);
    };

    _getProjects();
  }, []);

  return {
    projects,
  };
};

export const useProject = ({ landingId }) => {
  const [project, setProject] = useState();

  useEffect(() => {
    const _getProjectDetail = async () => {
      const res = await getLandingDetail(getLandingInfo().type, { landingId });
      setProject(res);
    };

    _getProjectDetail();
  }, [landingId]);

  return {
    project,
  };
};
