/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { Select, Modal, Skeleton } from "antd";
import { withRouter } from "react-router";
import { useQuery } from "react-query";
import { set } from "lodash";
import { getUser, getFgaProject } from "metabase/selectors/user";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { GetFgaProject } from "metabase/new-service";
import { PublicApi, maybeUsePivotEndpoint } from "metabase/services";
import { loadCurrentFgaProject } from "metabase/redux/user";
import "../css/index.css";
import {
  getGASearchHistory,
  saveGASearchHistory,
  getLatestGAProject,
  saveLatestGAProject,
  saveLatestGAProjectId,
  getGrowthProjectPath,
  getDashboardDatas,
  checkIsNeedContactUs,
} from "../utils/utils";

const GaProjectSearch = props => {
  const {
    router,
    location,
    user,
    menu,
    projectPath,
    setCreateFgaProjectModalShowAction,
    logout,
  } = props;
  const [userProject, setUserProject] = useState([]);
  const [currentProject, setCurrentProject] = useState(projectPath);
  const { isLoading, data } = useQuery(
    ["GetFgaProject", user?.id],
    async () => {
      return await GetFgaProject();
    },
    QUERY_OPTIONS,
  );

  const loadProjectDetail = project_id => {
    props.dispatch(loadCurrentFgaProject(parseInt(project_id)));
  };

  useEffect(() => {
    if (!isLoading && data?.data) {
      if (data?.data?.length > 0) {
        const projects = [];
        data?.data?.map(p => {
          projects.push({
            ...p,
            value: p.protocolSlug,
            label: p.protocolName ?? p.name,
            key: p.protocolSlug + p.id,
          });
        });
        const index = projects.findIndex(i => i.value === currentProject);
        const projectIndex = index === -1 ? 0 : index;
        setCurrentProject(projects[projectIndex].value);
        saveLatestGAProject(projects[projectIndex].value);
        saveLatestGAProjectId(projects[projectIndex].id);
        loadProjectDetail(projects[projectIndex].id);
        setUserProject(projects);
        if (
          index === -1 ||
          location.pathname === "/growth" ||
          location.pathname.startsWith("/growth/project")
        ) {
          router?.push({
            pathname: getGrowthProjectPath(projects[projectIndex].value, menu),
          });
        }
      } else {
        setUserProject([]);
        if (user) {
          checkIsNeedContactUs(
            modal,
            null,
            () => {
              setCreateFgaProjectModalShowAction({ show: true });
            },
            () => {},
            false,
          );
          // setCreateFgaProjectModalShowAction?.({
          //   show: true,
          //   force: true,
          // });
        }
      }
    }
    // getAllProtocol();
  }, [data, isLoading]);

  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    if (projectPath) {
      setCurrentProject(projectPath);
      saveLatestGAProject(projectPath);
    } else {
      const temp_project =
        getLatestGAProject() ??
        (userProject?.length > 0 ? userProject[0].value : null);
      if (temp_project) {
        saveLatestGAProject(temp_project);
        setCurrentProject(temp_project);
        if (
          location.pathname.startsWith("/growth/project") ||
          location.pathname === "/growth"
        ) {
          router?.push({
            pathname: getGrowthProjectPath(temp_project),
          });
        }
      }
    }
  }, [projectPath]);
  const handleProjectChange = (value, option) => {
    saveLatestGAProject(option.value);
    setCurrentProject(option.value);
    if (option.id) {
      saveLatestGAProjectId(option.id);
      loadProjectDetail(option.id);
    }
    if (
      (location.pathname.startsWith("/growth/project") ||
        location.pathname === "/growth") &&
      option.value
    ) {
      // window.location.href = getGrowthProjectPath(option.value);
      router?.push({
        pathname: getGrowthProjectPath(option.value),
      });
    }
  };
  return (
    <div className="flex flex-column items-center" style={{ minWidth: 300 }}>
      {userProject?.length > 0 ? (
        <Select
          showSearch
          style={{ width: 300 }}
          value={currentProject}
          loading={isLoading}
          onChange={handleProjectChange}
          placeholder="Search by protocol or nft collection address"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase()) ||
            (option?.collections_list ?? [])
              .join(",")
              .includes(input.toLowerCase())
          }
          options={userProject?.length > 0 ? userProject : []}
        />
      ) : (
        <Skeleton.Button
          active={true}
          className="flex flex-column items-center"
          style={{ width: 300, height: 30, marginTop: 15, padding: 0 }}
          paragraph={false}
        />
      )}

      {contextHolder}
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectObject: getFgaProject(state),
    projectPath: props.params.project,
    menu: props.params.menu,
  };
};

export default withRouter(connect(mapStateToProps)(GaProjectSearch));
