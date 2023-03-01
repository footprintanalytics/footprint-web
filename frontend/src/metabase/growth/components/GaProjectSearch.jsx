/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Select } from "antd";
import { withRouter } from "react-router";
import { getUser } from "metabase/selectors/user";
import { useQuery } from "react-query";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { GetFgaProject } from "metabase/new-service";
import "../css/index.css";
import {
  getGASearchHistory,
  saveGASearchHistory,
  getLatestGAProject,
  saveLatestGAProject,
} from "../utils/utils";

const GaProjectSearch = props => {
  const { router, location } = props;
  const [userProject, setUserProject] = useState([]);
  const { isLoading, data } = useQuery(
    ["GetFgaProject"],
    async () => {
      return await GetFgaProject();
    },
    QUERY_OPTIONS,
  );
  useEffect(() => {
    if (!isLoading) {
      console.log("GetFgaProject", data);
      if (data.data?.length > 0) {
        const projects = [];
        data.data.map(p => {
          projects.push({
            ...p,
            value: p.protocolSlug,
            label: p.name,
            key: p.protocolSlug + p.id,
          });
        });
        setUserProject(projects);
      }
    }
  }, [isLoading]);

  // monitor data
  const normalOptions = [
    {
      value: "BAYC",
      key: "BAYC",
      label: "BAYC",
    },
    {
      value: "Moonbird",
      key: "Moonbird",
      label: "Moonbird",
    },
    {
      value: "AlienWar",
      key: "AlienWar",
      label: "AlienWar",
    },
    {
      value: "Decentraland",
      key: "Decentraland",
      label: "Decentraland",
    },
    {
      value: "FootprintNFT",
      key: "FootprintNFT",
      label: "FootprintNFT",
    },
    {
      value: "Era7",
      key: "Era7",
      label: "Era7",
    },
    {
      value: "the-sandbox",
      key: "the-sandbox",
      label: "The Sandbox",
    },
    {
      value: "sunflower-farmers",
      key: "sunflower-farmers",
      label: "Sunflower Farmers",
    },
  ];
  const recommendOptions = [
    {
      value: "the-sandbox",
      key: "the-sandbox-recommend",
      label: "The Sandbox",
    },
    {
      value: "sunflower-farmers",
      key: "sunflower-farmers-recommend",
      label: "Sunflower Farmers",
    },
  ];
  const historyOptions = getGASearchHistory();
  const finalOptions = [];
  finalOptions.push({ label: "Recommend Projects", options: recommendOptions });
  if (historyOptions.length > 0) {
    finalOptions.push({ label: "History Search", options: historyOptions });
  }
  finalOptions.push({ label: "All Projects", options: normalOptions });

  const [currentProject, setCurrentProject] = useState();
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
        // filterSort={(optionA, optionB) =>
        //   (optionA?.label ?? "")
        //     .toLowerCase()
        //     .localeCompare((optionB?.label ?? "").toLowerCase())
        // }
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
