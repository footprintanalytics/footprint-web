/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { Select } from "antd";
import { withRouter } from "react-router";
import { useQuery } from "react-query";
import { set } from "lodash";
import { getUser, getFgaProject } from "metabase/selectors/user";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { GetFgaProject } from "metabase/new-service";
import { PublicApi, maybeUsePivotEndpoint } from "metabase/services";
import { loadCurrentFgaProject } from "metabase/redux/user";
import { top_protocols } from "../utils/data";
import "../css/index.css";
import {
  getGASearchHistory,
  saveGASearchHistory,
  getLatestGAProject,
  saveLatestGAProject,
  saveLatestGAProjectId,
  getGrowthProjectPath,
  getDashboardDatas,
} from "../utils/utils";

const GaProjectSearch = props => {
  const {
    router,
    location,
    user,
    menu,
    projectPath,
    setCreateFgaProjectModalShowAction,
  } = props;
  const [userProject, setUserProject] = useState([]);
  const [currentProject, setCurrentProject] = useState(projectPath);
  const { isLoading, data } = useQuery(
    ["GetFgaProject", user?.id],
    async () => {
      if (user) {
        return await GetFgaProject();
      } else {
        return;
      }
    },
    QUERY_OPTIONS,
  );

  const loadProjectDetail = project_id => {
    props.dispatch(loadCurrentFgaProject(parseInt(project_id)));
  };

  useEffect(() => {
    if (!isLoading && data?.data) {
      console.log("isLoading data?.data finish", data?.data?.length);
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
        console.log(4);
        saveLatestGAProject(projects[projectIndex].value);
        saveLatestGAProjectId(projects[projectIndex].id);
        loadProjectDetail(projects[projectIndex].id);
        setUserProject(projects);
        if (
          index === -1 ||
          location.pathname === "/growth" ||
          location.pathname.startsWith("/growth/project")
        ) {
          console.log(
            "router",
            1,
            getGrowthProjectPath(projects[projectIndex].value, menu),
          );
          router?.push({
            pathname: getGrowthProjectPath(projects[projectIndex].value, menu),
          });
        }
      } else {
        setUserProject([]);
        if (user) {
          setCreateFgaProjectModalShowAction?.({
            show: true,
            force: true,
          });
        }
      }
    }
    // getAllProtocol();
  }, [data, isLoading]);

  // monitor data
  const recommendOptions = useMemo(() => {
    return [
      {
        ...top_protocols[0],
        value: top_protocols[0].protocolSlug,
        key: top_protocols[0].protocolSlug + "-recommend",
        label: top_protocols[0].protocolName,
      },
    ];
  }, []);

  useEffect(() => {
    if (projectPath) {
      setCurrentProject(projectPath);
      console.log(1);
      saveLatestGAProject(projectPath);
    } else {
      const temp_project =
        getLatestGAProject() ??
        (userProject?.length > 0
          ? userProject[0].value
          : recommendOptions[0].value);
      setCurrentProject(temp_project);
      console.log(2);
      saveLatestGAProject(temp_project);
      if (
        location.pathname.startsWith("/growth/project") ||
        location.pathname === "/growth"
      ) {
        console.log("router", 2, getGrowthProjectPath(temp_project));
        router?.push({
          pathname: getGrowthProjectPath(temp_project),
        });
      }
    }
  }, [projectPath]);
  const handleProjectChange = (value, option) => {
    console.log(3);
    saveLatestGAProject(option.value);
    setCurrentProject(option.value);
    console.log("option", option);
    if (option.id) {
      saveLatestGAProjectId(option.id);
      loadProjectDetail(option.id);
    }
    if (
      (location.pathname.startsWith("/growth/project") ||
        location.pathname === "/growth") &&
      option.value
    ) {
      console.log("router", 3, getGrowthProjectPath(option.value));
      window.location.href = getGrowthProjectPath(option.value);
      // router?.push({
      //   pathname: getGrowthProjectPath(option.value),
      // });
    }
  };
  return (
    <div className="flex flex-column items-center" style={{ minWidth: 300 }}>
      {user && user.email !== "fga@footprint.network" && (
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
          options={
            userProject?.length > 0
              ? userProject
              : [{ label: "Recommend Projects", options: recommendOptions }]
          }
        />
      )}
    </div>
  );
};

const mapStateToProps = (state, props) => {
  console.log("state projectPath", props.params.project);
  return {
    user: getUser(state),
    projectObject: getFgaProject(state),
    projectPath: props.params.project,
    menu: props.params.menu,
  };
};

export default withRouter(connect(mapStateToProps)(GaProjectSearch));
