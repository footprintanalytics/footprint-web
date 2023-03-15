/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Select } from "antd";
import { withRouter } from "react-router";
import { useQuery } from "react-query";
import { set } from "lodash";
import { getUser } from "metabase/selectors/user";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { GetFgaProject } from "metabase/new-service";
import { PublicApi, maybeUsePivotEndpoint } from "metabase/services";
import { top_protocols } from "../utils/data";
import "../css/index.css";
import {
  getGASearchHistory,
  saveGASearchHistory,
  getLatestGAProject,
  saveLatestGAProject,
  saveLatestGAProjectId,
  getGrowthProjectPath,
} from "../utils/utils";

const GaProjectSearch = props => {
  const { router, location, user, menu, projectPath } = props;
  const [userProject, setUserProject] = useState([]);
  const [currentProject, setCurrentProject] = useState(projectPath);
  const { isLoading, data } = useQuery(
    ["GetFgaProject", user, projectPath],
    async () => {
      if (user) {
        return await GetFgaProject();
      } else {
        return;
      }
    },
    QUERY_OPTIONS,
  );

  const getAllProtocol = async () => {
    const uuid = "5276dcf1-0e5f-49d1-a49a-c405d2caa3d4";
    // const uuid = "93629e56-00c0-48cd-83b0-79fb0b0054f2";
    const { data } = await PublicApi.card({
      uuid,
    });
    const card = data;
    const newResult = await maybeUsePivotEndpoint(
      PublicApi.cardQuery,
      card,
    )({
      uuid,
      parameters: JSON.stringify([]),
    });
    const protocols = [];
    newResult?.data?.rows?.map((i, index) => {
      const p = {};
      newResult?.data?.cols?.map((j, index) => {
        if (j.name === "collections_list") {
          const l = i[index]
            .replace("[", "")
            .replace("]", "")
            .replaceAll(" ", "")
            .split(",");
          set(p, j.name, l);
        } else {
          set(p, j.name, i[index]);
        }
      });
      protocols.push(p);
    });
    console.log("getAllProtocol", uuid, newResult, protocols);
  };

  useEffect(() => {
    if (!isLoading) {
      if (data?.data?.length > 0) {
        const projects = [];
        data?.data?.map(p => {
          projects.push({
            ...p,
            value: p.protocolSlug,
            label: p.name,
            key: p.protocolSlug + p.id,
          });
        });
        const index = projects.findIndex(i => i.value === currentProject);
        const projectIndex = index === -1 ? 0 : index;
        setCurrentProject(projects[projectIndex].value);
        saveLatestGAProject(projects[projectIndex].value);
        saveLatestGAProjectId(projects[projectIndex].id);
        setUserProject(projects);
        if (index === -1) {
          router?.push({
            pathname: getGrowthProjectPath(projects[projectIndex].value, menu),
          });
        }
      }
    }
    // getAllProtocol();
  }, [currentProject, data?.data, menu, isLoading, router]);

  // monitor data
  const normalOptions = [];
  const recommendOptions = [];
  top_protocols.map((i, index) => {
    if (i.isDemo) {
      recommendOptions.push({
        ...i,
        value: i.protocol_slug,
        key: i.protocol_slug + "-recommend",
        label: i.protocol_name,
      });
    }
    // if (index < 3) {
    //   recommendOptions.push({
    //     ...i,
    //     value: i.protocol_slug,
    //     key: i.protocol_slug + "-recommend",
    //     label: i.protocol_name,
    //   });
    // } else {
    //   normalOptions.push({
    //     ...i,
    //     value: i.protocol_slug,
    //     key: i.protocol_slug,
    //     label: i.protocol_name,
    //   });
    // }
  });
  // const historyOptions = getGASearchHistory();
  const finalOptions = [];
  finalOptions.push({ label: "Recommend Projects", options: recommendOptions });
  // if (historyOptions.length > 0) {
  //   finalOptions.push({ label: "History Search", options: historyOptions });
  // }
  // finalOptions.push({ label: "All Projects", options: normalOptions });

  useEffect(() => {
    if (projectPath) {
      setCurrentProject(projectPath);
      saveLatestGAProject(projectPath);
    } else {
      const temp_project =
        getLatestGAProject() ??
        (userProject.length > 0 ? userProject : recommendOptions)[0].value;
      setCurrentProject(temp_project);
      if (location.pathname.startsWith("/growth/project")) {
        router?.push({
          pathname: getGrowthProjectPath(temp_project, menu),
        });
      }
    }
  }, [
    projectPath,
    menu,
    userProject,
    recommendOptions,
    router,
    location.pathname,
  ]);
  const handleProjectChange = (value, option) => {
    const item = option;
    item.key = item.value + "-histroy";
    saveGASearchHistory(item);
    saveLatestGAProject(option.value);
    setCurrentProject(option.value);
    if (option.id) {
      saveLatestGAProjectId(option.id);
    }
    if (location.pathname.startsWith("/growth/project")) {
      router?.push({
        pathname: getGrowthProjectPath(option.value, menu),
      });
    }
  };
  return (
    <div className="flex flex-column items-center" style={{ minWidth: 300 }}>
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
        options={userProject.length > 0 ? userProject : finalOptions}
      />
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectPath: props.params.project,
    menu: props.params.menu,
  };
};

export default withRouter(connect(mapStateToProps)(GaProjectSearch));
