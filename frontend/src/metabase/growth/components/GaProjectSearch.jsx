/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Select } from "antd";
import { withRouter } from "react-router";
import { useQuery } from "react-query";
import { getUser } from "metabase/selectors/user";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { GetFgaProject } from "metabase/new-service";
import { top_protocols } from "../utils/data";
import "../css/index.css";
import {
  getGASearchHistory,
  saveGASearchHistory,
  getLatestGAProject,
  saveLatestGAProject,
  saveLatestGAProjectId,
} from "../utils/utils";

const GaProjectSearch = props => {
  const { router, location } = props;
  const [userProject, setUserProject] = useState([]);
  const [currentProject, setCurrentProject] = useState();
  const { isLoading, data } = useQuery(
    ["GetFgaProject"],
    async () => {
      return await GetFgaProject();
    },
    QUERY_OPTIONS,
  );

  useEffect(() => {
    if (!isLoading) {
      if (data?.data?.length > 0) {
        const projects = [];
        data.data.map(p => {
          projects.push({
            ...p,
            value: p.protocolSlug,
            label: p.name,
            key: p.protocolSlug + p.id,
          });
        });
        if (projects.findIndex(i => i.value === currentProject) !== -1) {
          setCurrentProject(projects[0].value);
        }
        setUserProject(projects);
      }
    }
  }, [currentProject, data?.data, isLoading]);

  // monitor data
  const normalOptions = [];
  const recommendOptions = [];
  top_protocols.map((i, index) => {
    if (index < 3) {
      recommendOptions.push({
        ...i,
        value: i.protocol_slug,
        key: i.protocol_slug + "-recommend",
        label: i.protocol_name,
      });
    } else {
      normalOptions.push({
        ...i,
        value: i.protocol_slug,
        key: i.protocol_slug,
        label: i.protocol_name,
      });
    }
  });

  const historyOptions = getGASearchHistory();
  const finalOptions = [];
  finalOptions.push({ label: "Recommend Projects", options: recommendOptions });
  if (historyOptions.length > 0) {
    finalOptions.push({ label: "History Search", options: historyOptions });
  }
  finalOptions.push({ label: "All Projects", options: normalOptions });

  useEffect(() => {
    if (location?.query?.project_name) {
      setCurrentProject(location.query.project_name);
      saveLatestGAProject(location.query.project_name);
    } else {
      setCurrentProject(
        getLatestGAProject()
          ? getLatestGAProject()
          : (userProject.length > 0 ? userProject : recommendOptions)[0].value,
      );
    }
  }, [location?.query?.project_name, isLoading]);
  const handleProjectChange = (value, option) => {
    const item = option;
    item.key = item.value + "-histroy";
    saveGASearchHistory(item);
    saveLatestGAProject(option.value);
    saveLatestGAProjectId(option.id);
    router?.push({
      pathname: location.pathname,
      query: { ...location.query, project_name: option.value },
    });
  };
  return (
    <div className="flex flex-column items-center" style={{ minWidth: 300 }}>
      <Select
        showSearch
        style={{ width: 300 }}
        value={currentProject}
        loading={isLoading}
        onChange={handleProjectChange}
        placeholder="Search to Select"
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        options={userProject.length > 0 ? userProject : finalOptions}
      />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default withRouter(connect(mapStateToProps)(GaProjectSearch));
