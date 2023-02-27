/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Select } from "antd";
import { withRouter } from "react-router";
import { getUser } from "metabase/selectors/user";
import "../css/index.css";
import {
  getGASearchHistory,
  saveGASearchHistory,
  getLatestGAProject,
  saveLatestGAProject,
} from "../utils/utils";

const GaProjectSearch = props => {
  const { router, location } = props;
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
  console.log("finalOptions", finalOptions);
  const [currentProject, setCurrentProject] = useState();
  useEffect(() => {
    if (location?.query?.project_name) {
      setCurrentProject(location.query.project_name);
      saveLatestGAProject(location.query.project_name);
    } else {
      setCurrentProject(
        getLatestGAProject() ? getLatestGAProject() : recommendOptions[0].value,
      );
    }
  }, [location?.query?.project_name]);
  const handleProjectChange = (value, option) => {
    const item = option;
    // item.value = item.key + "-histroy";
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
        options={finalOptions}
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
