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
      label: "BAYC",
    },
    {
      value: "Moonbird",
      label: "Moonbird",
    },
    {
      value: "AlienWar",
      label: "AlienWar",
    },
    {
      value: "Decentraland",
      label: "Decentraland",
    },
    {
      value: "FootprintNFT",
      label: "FootprintNFT",
    },
    {
      value: "Era7",
      label: "Era7",
    },
    {
      value: "the-sandbox",
      label: "The Sandbox",
    },
    { value: "sunflower-farmers", label: "Sunflower Farmers" },
  ];
  // const recommendOptions = [
  //   {
  //     value: "the-sandbox",
  //     label: "The Sandbox",
  //   },
  //   { value: "sunflower-farmers", label: "Sunflower Farmers" },
  // ];
  // const historyOptions = getGASearchHistory();
  // const allOptions = [];
  // normalOptions.map(j => {
  //   if (
  //     (recommendOptions.find(i => i.value === j.value) === -1) &
  //     (historyOptions.find(i => i.value === j.value) === -1)
  //   ) {
  //     allOptions.push(j);
  //   }
  // });
  // const finalOptions = [];
  // finalOptions.push({ label: "All Projects", options: allOptions });
  // if (historyOptions.length > 0) {
  //   finalOptions.push({ label: "History Search", options: historyOptions });
  // }
  // finalOptions.push({ label: "Recommend Projects", options: recommendOptions });

  const [currentProject, setCurrentProject] = useState();
  useEffect(() => {
    if (location?.query?.project_name) {
      setCurrentProject(location.query.project_name);
      saveLatestGAProject(location.query.project_name);
    } else {
      setCurrentProject(
        getLatestGAProject() ? getLatestGAProject() : normalOptions[0].value,
      );
    }
  }, [location?.query?.project_name]);
  const handleProjectChange = (value, option) => {
    saveGASearchHistory(option);
    router?.push({
      pathname: location.pathname,
      query: { ...location.query, project_name: value },
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
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? "")
            .toLowerCase()
            .localeCompare((optionB?.label ?? "").toLowerCase())
        }
        options={normalOptions}
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
